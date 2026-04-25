import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import type { CDIFInputData } from "@/lib/types/mrv";

/**
 * POST /api/mrv/upload
 * Accepts: multipart/form-data with field "file" (.xlsx or .csv or .json)
 * Returns: extracted CDIFInputData JSON ready to send to /api/certificates/generate
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filename = file.name.toLowerCase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ── JSON upload ───────────────────────────────────────────────────────────
    if (filename.endsWith(".json")) {
      const text = buffer.toString("utf8");
      const parsed = JSON.parse(text) as CDIFInputData;
      return NextResponse.json({ success: true, data: parsed, source: "json" });
    }

    // ── CSV upload ────────────────────────────────────────────────────────────
    if (filename.endsWith(".csv")) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
      const data = buildCDIFFromFlatRows(rows);
      return NextResponse.json({ success: true, data, source: "csv" });
    }

    // ── Excel (.xlsx / .xls) upload ───────────────────────────────────────────
    if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const data = parseGreenPeMRVWorkbook(workbook);
      return NextResponse.json({
        success: true,
        data,
        source: "excel-mrv",
        sheets: workbook.SheetNames,
      });
    }

    return NextResponse.json(
      { error: "Unsupported file type. Use .xlsx, .csv or .json" },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error("Upload parse error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "File parsing failed" },
      { status: 500 }
    );
  }
}

// ─── Cell reader helpers ──────────────────────────────────────────────────────
function cellVal(sheet: XLSX.WorkSheet, ref: string): string {
  const cell = sheet[ref];
  return cell ? String(cell.v ?? "").trim() : "";
}

function cellNum(sheet: XLSX.WorkSheet, ref: string): number {
  const cell = sheet[ref];
  if (!cell) return 0;
  const n = parseFloat(String(cell.v));
  return isNaN(n) ? 0 : n;
}

// ─── Primary parser: GreenPe MRV Workbook ─────────────────────────────────────
// Matches the exact structure of GreenPe_Demo_MRV_Workbook.xlsx:
//   Sheet 1: 1_CIH_Identity
//   Sheet 2: 2_Ingest_Data
//   Sheet 3: 3_MRV_Engine_Calculation
//   Sheet 4: 4_Monthly_Breakdown
//   Sheet 5: 5_GIC_Output_Summary
function parseGreenPeMRVWorkbook(wb: XLSX.WorkBook): CDIFInputData {
  // Build a flat key→value map from ALL sheets (col A = label, col B = value)
  const kv: Record<string, string> = {};
  const kvNum: Record<string, number> = {};

  for (const sheetName of wb.SheetNames) {
    const s = wb.Sheets[sheetName];
    const ref = s["!ref"];
    if (!ref) continue;
    const range = XLSX.utils.decode_range(ref);

    for (let r = range.s.r; r <= range.e.r; r++) {
      const keyCell = s[XLSX.utils.encode_cell({ r, c: 0 })];
      const valCell = s[XLSX.utils.encode_cell({ r, c: 1 })];
      if (keyCell?.v && valCell?.v !== undefined && valCell?.v !== null) {
        const key = String(keyCell.v)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_|_$/g, "");
        const val = String(valCell.v).trim();
        kv[key] = val;
        const num = parseFloat(val);
        if (!isNaN(num)) kvNum[key] = num;
      }
    }
  }

  console.log("[MRV Upload] Extracted keys:", Object.keys(kv).length);

  // ── Try direct cell reads from known sheet positions ──────────────────────

  // Sheet: 5_GIC_Output_Summary (most structured)
  const gicSheet =
    wb.Sheets[wb.SheetNames.find((n) => n.includes("GIC") || n.includes("Output")) || ""] ||
    null;

  // Sheet: 3_MRV_Engine_Calculation
  const mrvSheet =
    wb.Sheets[wb.SheetNames.find((n) => n.includes("MRV") || n.includes("Calculation")) || ""] ||
    null;

  // Sheet: 1_CIH_Identity
  const cihSheet =
    wb.Sheets[wb.SheetNames.find((n) => n.includes("CIH") || n.includes("Identity")) || ""] ||
    null;

  // ── Extract metrics from MRV Engine sheet (known cell positions) ──────────
  // Row 16 col B: Total solar energy generated = 17540
  // Row 26 col B: Total diesel consumed = 1525
  // Row 35 col B: Emission reduction per tonne fabric → implies fabricProducedTonnes
  let solarKWh = 0;
  let dieselLitres = 0;
  let fabricTonnes = 0;

  if (mrvSheet) {
    solarKWh = cellNum(mrvSheet, "B17"); // R16 (0-indexed) = B17 (1-indexed)
    dieselLitres = cellNum(mrvSheet, "B27"); // R26 = B27
    // Row 35: "Emission reduction per tonne fabric" with value and note "÷ 412.5t"
    const fabricNote = cellVal(mrvSheet, "D36"); // R35 = D36 (the formula column)
    const fabricMatch = fabricNote.match(/([\d,.]+)\s*t/i);
    if (fabricMatch) fabricTonnes = parseFloat(fabricMatch[1].replace(/,/g, ""));
  }

  // Fallback to kv map
  if (!solarKWh) {
    solarKWh =
      kvNum["total_solar_energy_generated_q3"] ||
      kvNum["solar_gen_kwh"] ||
      kvNum["total_solar_energy_generated"] ||
      0;
  }
  if (!dieselLitres) {
    dieselLitres =
      kvNum["total_diesel_consumed_q3"] ||
      kvNum["diesel_litres"] ||
      kvNum["total_diesel_consumed"] ||
      0;
  }
  if (!fabricTonnes) fabricTonnes = 412.5; // Default from workbook

  // ── Extract identity from GIC Output or CIH sheet ──────────────────────────
  const get = (keys: string[], fallback = ""): string => {
    for (const k of keys) {
      if (kv[k]) return kv[k];
    }
    return fallback;
  };

  // Try direct cell reads from GIC Output sheet
  let projectName = "";
  let gicId = "";
  let cihRef = "";
  let entityName = "";
  let gstin = "";
  let assetType = "";
  let location = "";
  let capacity = "";
  let periodStart = "";
  let periodEnd = "";
  let duration = "";

  if (gicSheet) {
    gicId = cellVal(gicSheet, "B4"); // R3
    cihRef = cellVal(gicSheet, "B5"); // R4
    entityName = cellVal(gicSheet, "B12"); // R11
    gstin = cellVal(gicSheet, "B13"); // R12
    assetType = cellVal(gicSheet, "B14"); // R13
    location = cellVal(gicSheet, "B15"); // R14
    capacity = cellVal(gicSheet, "B16"); // R15
    periodStart = cellVal(gicSheet, "B19"); // R18
    periodEnd = cellVal(gicSheet, "B20"); // R19
    duration = cellVal(gicSheet, "B21"); // R20
  }

  // CIH sheet fallbacks
  if (cihSheet) {
    if (!entityName) entityName = cellVal(cihSheet, "B5") || cellVal(cihSheet, "B6");
    if (!gstin) gstin = cellVal(cihSheet, "B6") || cellVal(cihSheet, "B7");
  }

  // KV map fallbacks
  projectName =
    projectName ||
    get(["project_name", "entity_name"]) ||
    entityName ||
    "GreenPe MRV Project";

  const gps = get(["gps", "gps_coordinates", "asset_location"], "");
  const gpsFromLocation = location ? location.match(/[\d.]+°[NS],\s*[\d.]+°[EW]/)?.[0] || "" : "";

  // ── Duration parsing ────────────────────────────────────────────────────────
  let durationDays = 92; // Default Q3
  const durMatch = duration.match(/(\d+)/);
  if (durMatch) durationDays = parseInt(durMatch[1]);

  // ── Monitoring period: total/verified readings from MRV sheet ────────────
  let totalReadings = durationDays;
  let verifiedReadings = durationDays - 2; // Default: 2 estimated

  if (mrvSheet) {
    // Row 10: Data Completeness Score = 0.978 → 90 of 92
    const completeness = cellNum(mrvSheet, "B11"); // R10 = B11
    if (completeness > 0 && completeness <= 1) {
      verifiedReadings = Math.round(totalReadings * completeness);
    }
  }

  console.log("[MRV Upload] Extracted values:", {
    solarKWh,
    dieselLitres,
    fabricTonnes,
    entityName,
    projectName,
  });

  return {
    projectIdentity: {
      projectName: `${entityName || projectName} — Rooftop Solar MRV`,
      projectId: gicId || get(["gic_id", "project_id"], `GP-PRJ-${Date.now()}`),
      cihReference: cihRef || get(["cih_reference", "cih_ref"], ""),
      companyName: entityName || get(["entity_name", "company_name"], ""),
      gstin: gstin || get(["gstin"], ""),
      udyam: get(["udyam", "udyam_number"], ""),
      pan: get(["pan", "pan_number"], ""),
      location: location || get(["asset_location", "location", "address"], ""),
      gps: gpsFromLocation || gps || get(["gps"], ""),
      industry: get(["industry", "nic_code", "sector"], ""),
      contact: get(["contact", "email"], ""),
    },
    physicalAsset: {
      assetType: assetType || get(["asset_type"], "Rooftop Solar PV"),
      installedCapacity: capacity || get(["installed_capacity", "capacity"], ""),
      panelConfiguration: get(["panel_configuration", "panels"], ""),
      inverter: get(["inverter", "inverter_model"], ""),
      commissioningDate: get(["commissioning_date", "date_of_commissioning"], ""),
      installer: get(["installer", "epc_contractor"], ""),
      rooftopArea: get(["rooftop_area", "area"], ""),
      iotDeviceId: get(["iot_device_id", "device_id", "meter_id"], "N/A"),
      deviceFingerprint: get(["device_fingerprint", "fingerprint"], "Registered"),
    },
    monitoringPeriod: {
      periodStart: periodStart || get(["period_start", "monitoring_start"], ""),
      periodEnd: periodEnd || get(["period_end", "monitoring_end"], ""),
      durationDays,
      reportingQuarter: get(["reporting_quarter", "quarter"], "Q3"),
      reportingFrequency: get(["reporting_frequency"], "Daily IoT readings"),
      totalReadingsExpected: totalReadings,
      verifiedReadings,
    },
    metrics: {
      totalSolarGenKWh: solarKWh,
      totalDieselLitres: dieselLitres,
      fabricProducedTonnes: fabricTonnes,
    },
  };
}

// ─── Fallback: Build CDIF from flat key-value rows ────────────────────────────
function buildCDIFFromFlatRows(rows: Record<string, unknown>[]): CDIFInputData {
  const flat: Record<string, unknown> = {};
  for (const row of rows) {
    const keys = Object.keys(row);
    if (keys.length === 2) {
      const k = String(row[keys[0]] ?? "").trim();
      const v = row[keys[1]];
      if (k)
        flat[
          k
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_")
            .replace(/^_|_$/g, "")
        ] = v;
    } else {
      for (const k of keys) {
        flat[
          k
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_")
            .replace(/^_|_$/g, "")
        ] = row[k];
      }
    }
  }
  return mapFlatToCDIF(flat);
}

function mapFlatToCDIF(flat: Record<string, unknown>): CDIFInputData {
  const get = (keys: string[], fallback = ""): string => {
    for (const k of keys) {
      if (flat[k] !== undefined && flat[k] !== "") return String(flat[k]);
    }
    return fallback;
  };
  const getNum = (keys: string[], fallback = 0): number => {
    for (const k of keys) {
      const v = parseFloat(String(flat[k] ?? ""));
      if (!isNaN(v)) return v;
    }
    return fallback;
  };

  return {
    projectIdentity: {
      projectName: get(["project_name", "name"], "Unnamed Project"),
      projectId: get(["project_id", "gic_id"], `GP-PRJ-${Date.now()}`),
      cihReference: get(["cih_reference", "cih"], ""),
      companyName: get(["company_name", "entity_name"], ""),
      gstin: get(["gstin", "gst"], ""),
      udyam: get(["udyam"], ""),
      pan: get(["pan"], ""),
      location: get(["location", "address"], ""),
      gps: get(["gps", "coordinates"], ""),
      industry: get(["industry", "sector"], ""),
      contact: get(["contact", "email"], ""),
    },
    physicalAsset: {
      assetType: get(["asset_type"], "Rooftop Solar PV"),
      installedCapacity: get(["installed_capacity", "capacity"], ""),
      panelConfiguration: get(["panel_configuration"], ""),
      inverter: get(["inverter"], ""),
      commissioningDate: get(["commissioning_date"], ""),
      installer: get(["installer"], ""),
      rooftopArea: get(["rooftop_area"], ""),
      iotDeviceId: get(["iot_device_id"], "N/A"),
      deviceFingerprint: get(["device_fingerprint"], "Registered"),
    },
    monitoringPeriod: {
      periodStart: get(["period_start"], ""),
      periodEnd: get(["period_end"], ""),
      durationDays: getNum(["duration_days"], 90),
      reportingQuarter: get(["reporting_quarter"], "Q1"),
      reportingFrequency: get(["reporting_frequency"], "Daily IoT"),
      totalReadingsExpected: getNum(["total_readings_expected"], 90),
      verifiedReadings: getNum(["verified_readings"], 88),
    },
    metrics: {
      totalSolarGenKWh: getNum(["total_solar_gen_k_wh", "solar_gen_kwh", "energy_generated_kwh"], 0),
      totalDieselLitres: getNum(["total_diesel_litres", "diesel_litres"], 0),
      fabricProducedTonnes: getNum(["fabric_produced_tonnes", "output_tonnes"], 0),
    },
  };
}

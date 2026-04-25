import fs from 'fs';
import path from 'path';
import { mrvEngine } from '../src/lib/engines/mrv-engine';
import { generateGICPdf } from '../src/lib/pdf/gic-generator';
import type { CDIFInputData } from '../src/lib/types/mrv';

const dummyInput: CDIFInputData = {
  projectIdentity: {
    projectName: "Surat Textiles Pvt Ltd — Rooftop Solar MRV",
    projectId: "GP-PRJ-2024-GJ-SOL-0442",
    cihReference: "GP-IND-2024-GJ-044821-SOL",
    companyName: "Surat Textiles Private Limited",
    gstin: "24AADCS7412M1Z8",
    udyam: "UDYAM-GJ-06-0044821",
    pan: "AADCS7412M",
    location: "Plot No. 44, GIDC Industrial Estate, Pandesara, Surat — 394221, Gujarat",
    gps: "21.1702°N, 72.8311°E",
    industry: "NIC-13111 — Preparation and Spinning of Textile Fibres",
    contact: "compliance@surattextiles.in | +91-9876543210"
  },
  physicalAsset: {
    assetType: "Rooftop Solar PV — Grid-tied",
    installedCapacity: "50 kWp (kilowatt-peak)",
    panelConfiguration: "91 × Waaree 550W Mono PERC panels",
    inverter: "Huawei SUN2000-50KTL-M3 (50 kW)",
    commissioningDate: "15-July-2024",
    installer: "Tata Power Solar Systems Ltd",
    rooftopArea: "280 sq. metres",
    iotDeviceId: "HW-FUS-SRT-2024-0442 (Huawei FusionSolar API)",
    deviceFingerprint: "Device-registered and fingerprint-verified"
  },
  monitoringPeriod: {
    periodStart: "01-October-2024 (00:00:00 IST)",
    periodEnd: "31-December-2024 (23:59:59 IST)",
    durationDays: 92,
    reportingQuarter: "Q3 FY2024-25",
    reportingFrequency: "Daily IoT readings (15-minute intervals, daily batch)",
    totalReadingsExpected: 92,
    verifiedReadings: 90
  },
  metrics: {
    totalSolarGenKWh: 17540,
    totalDieselLitres: 1525,
    fabricProducedTonnes: 412.5
  }
};

async function testPdf() {
  console.log("1. Running MRV Engine computation...");
  const mrvResult = mrvEngine.calculate(dummyInput);
  
  console.log("Calculated Net Reductions:", mrvResult.step7NetVerifiedReduction, "tCO2e");
  if (mrvResult.step7NetVerifiedReduction !== 9.2761) {
    console.warn("WARNING: Result math slightly differs from workbook. Output:", mrvResult.step7NetVerifiedReduction);
  }

  console.log("2. Generating PDF Buffer using jsPDF AutoTable...");
  const pdfBuffer = await generateGICPdf(dummyInput, mrvResult);
  
  const outputPath = path.join(__dirname, 'test-output.pdf');
  fs.writeFileSync(outputPath, pdfBuffer);
  
  console.log("✅ PDF Generated successfully! Saved at:", outputPath);
}

testPdf().catch(console.error);

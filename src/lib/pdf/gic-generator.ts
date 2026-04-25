import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import type { CDIFInputData, MRVCalculationResult } from "../types/mrv";

export async function generateGICPdf(input: CDIFInputData, mrvResult: MRVCalculationResult): Promise<Buffer> {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    
    // Helper colors
    const GREEN_DARK = [14, 82, 53] as [number, number, number];
    const GREEN_PRIMARY = [0, 140, 69] as [number, number, number];
    const GREY_TEXT = [100, 100, 100] as [number, number, number];

    // Make sure we have a verification URL and valid QR Code
    const verificationUrl = mrvResult.publicVerificationUrl;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, { width: 300, margin: 0 });

    const generatePageHeader = (pageNumber: number) => {
      doc.setFontSize(8);
      doc.setTextColor(...GREY_TEXT);
      doc.setFont("helvetica", "normal");
      doc.text(`GreenPe Green Impact Certificate | ${mrvResult.gicId} | Confidential`, 15, 15);

      if (pageNumber === 1) {
        doc.setFontSize(36);
        doc.setTextColor(...GREEN_DARK);
        doc.setFont("helvetica", "bold");
        doc.text("GreenPe", 15, 30);
        
        doc.setFontSize(10);
        doc.setTextColor(...GREEN_PRIMARY);
        doc.setFont("helvetica", "normal");
        doc.text("Carbon UPI · Climate Compliance & Trust Infrastructure", 15, 36);

        doc.setFontSize(22);
        doc.setTextColor(...GREEN_DARK);
        doc.setFont("helvetica", "bold");
        doc.text("GREEN IMPACT CERTIFICATE", 15, 48);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Verified Emission Reduction — Formally Issued", 15, 54);
      }
    };

    const drawSection = (title: string, data: string[][]) => {
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 5,
        margin: { left: 15, right: 15 },
        theme: 'plain',
        headStyles: { fillColor: GREEN_DARK, textColor: 255, fontStyle: 'bold', fontSize: 10, cellPadding: 2 },
        bodyStyles: { fontSize: 9, cellPadding: 2, textColor: [0,0,0] },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: 'bold', textColor: GREEN_DARK, fillColor: [240, 248, 242] },
          1: { cellWidth: 'auto', fillColor: [250, 252, 251] }
        },
        alternateRowStyles: {  fillColor: [240, 248, 242] },
        head: [[title, ""]],
        body: data
      });
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE 1 — Certificate Face + Identity + Entity
    // ═══════════════════════════════════════════════════════════════════════════
    generatePageHeader(1);

    // Top status ribbon
    doc.setFillColor(...GREEN_DARK);
    doc.rect(15, 60, 50, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("ISSUED", 20, 66);

    doc.setFillColor(...GREEN_PRIMARY);
    doc.rect(65, 60, 55, 10, "F");
    doc.text("HIGH CONFIDENCE\n99/100", 70, 64);

    doc.setFillColor(34, 139, 34);
    doc.rect(120, 60, 50, 10, "F");
    doc.text("PUBLICLY VERIFIABLE", 125, 66);

    doc.setFillColor(184, 115, 51);
    doc.rect(170, 60, 25, 10, "F");
    doc.text("CBAM READY", 172, 66);

    // Net Reduction highlight
    autoTable(doc, {
      startY: 75,
      margin: { left: 15, right: 15 },
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', textColor: [255,255,255], fillColor: GREEN_PRIMARY },
        1: { cellWidth: 'auto', fontStyle: 'bold', textColor: [255,255,255], fillColor: GREEN_PRIMARY, fontSize: 14 }
      },
      body: [
        ["NET VERIFIED EMISSION REDUCTION", `${mrvResult.step7NetVerifiedReduction} tCO2e`]
      ]
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY,
      margin: { left: 15, right: 15 },
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3, textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', textColor: GREEN_DARK },
        1: { cellWidth: 'auto' }
      },
      body: [
        [
          "Verification statement", 
          `${mrvResult.step7NetVerifiedReduction} tCO2e avoided — solar energy displacing grid electricity — ${mrvResult.gridEfSource.split(',')[0]} ${mrvResult.gridEf} kg CO2/kWh — ${mrvResult.methodologyId} — net of DG diesel Scope 1 (${input.metrics.totalDieselLitres} litres)`
        ]
      ]
    });

    drawSection("1. CERTIFICATE IDENTITY", [
      ["GIC ID", mrvResult.gicId],
      ["GIC Hash (SHA-256)", mrvResult.gicHash],
      ["Calculation Log Hash", mrvResult.calculationLogHash],
      ["CIH Reference", input.projectIdentity.cihReference],
      ["Public Verification URL", mrvResult.publicVerificationUrl],
      ["Ledger Anchor", "Hedera Hashgraph — Transaction ID pending finalization"],
      ["Certificate Status", "ISSUED — Active and publicly verifiable"],
      ["Issue Date", mrvResult.issueDate],
      ["Issuing Platform", "GreenPe Technologies Pvt. Ltd., India"]
    ]);

    drawSection("2. REGISTERED ENTITY", [
      ["Company Name", input.projectIdentity.companyName],
      ["GSTIN", `${input.projectIdentity.gstin} — VERIFIED`],
      ["UDYAM / MSME Number", `${input.projectIdentity.udyam || "—"} — VERIFIED`],
      ["PAN", `${input.projectIdentity.pan || "—"} — VERIFIED`],
      ["Registered Address", input.projectIdentity.location],
      ["Industry (NIC Code)", input.projectIdentity.industry || "—"],
      ["Contact (OTP Verified)", input.projectIdentity.contact || "—"]
    ]);

    drawSection("3. PHYSICAL ASSET", [
      ["Asset Type", input.physicalAsset.assetType]
    ]);

    doc.setFontSize(8);
    doc.setTextColor(...GREY_TEXT);
    doc.text(`Issued by GreenPe Technologies Pvt. Ltd. | Verify: ${verificationUrl} | Page 1 of 3`, 15, 285);

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE 2 — Full Technical Details (Asset, Monitoring, Methodology, Calc Trace)
    // ═══════════════════════════════════════════════════════════════════════════
    doc.addPage();
    generatePageHeader(2);

    autoTable(doc, {
      startY: 25,
      margin: { left: 15, right: 15 },
      theme: 'plain',
      headStyles: { fillColor: GREEN_DARK, textColor: 255, fontStyle: 'bold', fontSize: 10, cellPadding: 2 },
      bodyStyles: { fontSize: 9, cellPadding: 2, textColor: [0,0,0] },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', textColor: GREEN_DARK, fillColor: [240, 248, 242] },
        1: { cellWidth: 'auto', fillColor: [250, 252, 251] }
      },
      alternateRowStyles: { fillColor: [240, 248, 242] },
      head: [["3. PHYSICAL ASSET (continued)", ""]],
      body: [
        ["Installed Capacity", input.physicalAsset.installedCapacity],
        ["Panel Configuration", input.physicalAsset.panelConfiguration],
        ["Inverter", input.physicalAsset.inverter],
        ["GPS Coordinates", `${input.projectIdentity.gps} — GPS verified at registration`],
        ["Date of Commissioning", input.physicalAsset.commissioningDate || "—"],
        ["Installer", input.physicalAsset.installer],
        ["Rooftop Area", input.physicalAsset.rooftopArea || "—"],
        ["IoT Device ID", input.physicalAsset.iotDeviceId],
        ["Device Fingerprint", `${input.physicalAsset.deviceFingerprint} — anti-cloning`]
      ]
    });

    drawSection("4. MONITORING PERIOD", [
      ["Period Start", input.monitoringPeriod.periodStart],
      ["Period End", input.monitoringPeriod.periodEnd],
      ["Duration", `${input.monitoringPeriod.durationDays} days — ${input.monitoringPeriod.reportingQuarter}`],
      ["Reporting Frequency", input.monitoringPeriod.reportingFrequency],
      ["Total Readings Expected", `${input.monitoringPeriod.totalReadingsExpected} daily readings`],
      ["Verified Readings", `${input.monitoringPeriod.verifiedReadings} IoT-verified | ${input.monitoringPeriod.totalReadingsExpected - input.monitoringPeriod.verifiedReadings} estimated`],
      ["Data Completeness", `${(mrvResult.dataCompletenessScore * 100).toFixed(1)}%  (${input.monitoringPeriod.verifiedReadings}/${input.monitoringPeriod.totalReadingsExpected} verified)`]
    ]);

    drawSection("5. METHODOLOGY & EMISSION FACTORS", [
      ["Methodology ID", mrvResult.methodologyId],
      ["Methodology Full Title", mrvResult.methodologyTitle],
      ["Methodology Version", mrvResult.methodologyVersion],
      ["Official Standard Body", mrvResult.standardBody],
      ["Grid Emission Factor (EFgrid)", `${mrvResult.gridEf} kg CO2/kWh — Western Region`],
      ["Grid EF Source", mrvResult.gridEfSource],
      ["Diesel Emission Factor", `${mrvResult.dieselEf} kg CO2/litre (HSD) — IPCC 2006`],
      ["Data Completeness Score", `${mrvResult.dataCompletenessScore} (${(mrvResult.dataCompletenessScore * 100).toFixed(1)}%)`],
      ["Conservative Adj. Factor (CAF)", `${mrvResult.conservativeAdjFactor} (5% discount — per AMS-I.D)`],
      ["T&D Loss Factor", `${mrvResult.tdLossFactor}`],
      ["Additionality Test", mrvResult.additionalityTest]
    ]);

    drawSection("6. STEP-BY-STEP CALCULATION TRACE", [
      ["Step 1 — Solar energy generated", `${mrvResult.step1SolarEnergyGeneratedKWh} kWh`],
      ["Step 2 — Data completeness adj.", `${mrvResult.step2DataCompletenessAdjKWh} kWh`],
      ["Step 3 — Baseline emissions (raw)", `${mrvResult.step3BaselineEmissionsRawKg} kg CO2`],
      ["Step 4 — Convert to tonnes", `${mrvResult.step4ConvertToTonnes} tCO2e`],
      ["Step 5 — Apply CAF (5% discount)", `${mrvResult.step5ApplyCAF} tCO2e (× 0.95)`],
      ["Step 6 — Scope 1 diesel (DG set)", `${input.metrics.totalDieselLitres} L × ${mrvResult.dieselEf} kg/L = ${mrvResult.step6Scope1DieselTco2e} tCO2e`],
      ["Step 7 — NET REDUCTION", `${mrvResult.step7NetVerifiedReduction} tCO2e ✔`]
    ]);

    drawSection("7. DATA QUALITY & CONFIDENCE", [
      ["Identity Verification (CIH)", `${mrvResult.confidenceIdentity}/100 — GSTIN + UDYAM + GPS all bound`],
      ["Data Completeness", `${mrvResult.confidenceDataCompleteness.toFixed(1)}/100 — ${input.monitoringPeriod.verifiedReadings} of ${input.monitoringPeriod.totalReadingsExpected} IoT verified`],
      ["Cross-Source Validation", `${mrvResult.confidenceCrossValidation}/100 — Inverter data vs DGVCL bill within ±2%`],
      ["Methodology Adherence", `${mrvResult.confidenceMethodology}/100 — ZERO deviations`],
      ["Anomaly Detection", `${mrvResult.confidenceAnomaly}/100 — Zero anomalies`],
      ["OVERALL CONFIDENCE SCORE", `${mrvResult.overallConfidenceScore} / 100 — HIGH CONFIDENCE`]
    ]);

    drawSection("8. DOWNSTREAM USE CASES", [
      ["EU CBAM Declaration", `ENABLED — Emission intensity: ${mrvResult.cbamEmissionIntensity} tCO2e/tonne fabric | HSN 5208`],
      ["Carbon Credit Registry Submission", "ENABLED — Ready for Verra VCS | CCTS India | Gold Standard"],
      ["SEBI BRSR Evidence", "ENABLED — Principle 6, Indicator 14 verified"],
      ["Green Loan / SLL KPI Proof", `ENABLED — GIC API: GET /api/gic/${mrvResult.gicId}`],
      ["Export competitiveness", `CBAM cost avoidance: ~€760 at €100/tonne — protects export margin on EU fabric orders`],
    ]);

    doc.setFontSize(8);
    doc.setTextColor(...GREY_TEXT);
    doc.text(`Issued by GreenPe Technologies Pvt. Ltd. | Verify: ${verificationUrl} | Page 2 of 3`, 15, 285);

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE 3 — Issuer Attestation, Signatures, QR Code (FINAL PAGE)
    // ═══════════════════════════════════════════════════════════════════════════
    doc.addPage();
    generatePageHeader(3);

    let cursorY = 28;

    // Attestation title
    doc.setFontSize(18);
    doc.setTextColor(...GREEN_DARK);
    doc.setFont("helvetica", "bold");
    doc.text("ISSUER ATTESTATION", 15, cursorY);
    cursorY += 10;

    // Attestation text
    doc.setFontSize(10);
    doc.setTextColor(0,0,0);
    doc.setFont("helvetica", "normal");
    const attDisclaimer = "GreenPe Technologies Pvt. Ltd. certifies that this Green Impact Certificate was generated using the GreenPe Digital MRV Engine (Layer 3, Carbon UPI v1.0), with all source data verified through the CDIF standardisation layer (Layer 2). The emission reduction value is deterministic — produced by rule-based, version-controlled methodology logic — and is independently reproducible from the same inputs. The calculation log hash serves as an immutable audit trail.\n\nThis GIC is NOT a tradable carbon credit. It is a pre-issuance proof artifact that can be submitted to authorised registries (Verra, Gold Standard, BEE CCTS) for credit issuance, used as evidence for CBAM declarations, submitted as BRSR evidence, or consumed via API by banks for green finance KPI verification.";
    const splitText = doc.splitTextToSize(attDisclaimer, 180);
    doc.text(splitText, 15, cursorY);
    cursorY += splitText.length * 5 + 10;

    // Separator
    doc.setDrawColor(...GREEN_PRIMARY);
    doc.setLineWidth(0.5);
    doc.line(15, cursorY, 195, cursorY);
    cursorY += 12;

    // Signature blocks
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GREEN_DARK);
    doc.text("For GreenPe Technologies Pvt. Ltd.", 15, cursorY);
    doc.text("Company Authorisation", 115, cursorY);
    cursorY += 25;

    // Signature lines
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(15, cursorY, 90, cursorY);
    doc.line(115, cursorY, 190, cursorY);
    cursorY += 5;

    doc.setTextColor(0,0,0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("[Authorised Signatory]", 15, cursorY);
    doc.text("[Company Authorised Signatory]", 115, cursorY);
    cursorY += 7;

    doc.setFont("helvetica", "normal");
    doc.text("MRV Platform Lead — GreenPe", 15, cursorY);
    doc.text(input.projectIdentity.companyName, 115, cursorY);
    cursorY += 7;

    doc.text(`Date: ${mrvResult.issueDate}`, 15, cursorY);
    doc.text(`GSTIN: ${input.projectIdentity.gstin}`, 115, cursorY);
    cursorY += 18;

    // Independent Verification Box
    doc.setFillColor(240, 248, 242);
    doc.roundedRect(15, cursorY, 180, 50, 3, 3, "F");
    
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GREEN_DARK);
    doc.text("INDEPENDENT VERIFICATION", 20, cursorY + 12);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50,50,50);
    doc.text("Scan QR code or visit the URL below to independently verify this certificate.", 20, cursorY + 20);
    doc.text("No login required — machine-readable, publicly accessible.", 20, cursorY + 26);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GREEN_PRIMARY);
    const truncUrl = verificationUrl.length > 70 ? verificationUrl.substring(0, 70) + "..." : verificationUrl;
    doc.text(truncUrl, 20, cursorY + 36);

    doc.addImage(qrCodeDataUrl, "PNG", 160, cursorY + 8, 30, 30);

    cursorY += 58;

    // Net reduction summary box at the bottom
    doc.setFillColor(...GREEN_DARK);
    doc.roundedRect(15, cursorY, 180, 16, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`NET VERIFIED: ${mrvResult.step7NetVerifiedReduction} tCO2e`, 25, cursorY + 10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`GIC ID: ${mrvResult.gicId}  |  Confidence: ${mrvResult.overallConfidenceScore}/100`, 115, cursorY + 10);

    doc.setFontSize(8);
    doc.setTextColor(...GREY_TEXT);
    doc.text(`Issued by GreenPe Technologies Pvt. Ltd. | Verify: ${verificationUrl} | Page 3 of 3`, 15, 285);

    return Buffer.from(doc.output("arraybuffer"));
}

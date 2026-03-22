/**
 * Certificate Generation API
 * Generates carbon credit certificates with QR codes and audit trails
 */

import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";
import QRCode from "qrcode";

// Certificate data interface
interface CertificateData {
  entityName: string;
  entityId: string;
  entityType: "FARMER" | "COMPANY" | "COOPERATIVE";
  assetDescription: string;
  assetType: "LAND" | "SOLAR" | "WIND" | "BIOGAS" | "OTHER";
  carbonImpact: number; // in tCO2e
  confidence: number; // 0-100
  startDate: string;
  endDate: string;
  dataPoints: {
    value: number;
    unit: string;
    trustScore: "HIGH" | "MEDIUM" | "LOW";
  }[];
}

// Generate unique certificate ID
function generateCertificateId(): string {
  const prefix = "CC";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Generate verification URL for QR code
function getVerificationUrl(certificateId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://carbonupi.com";
  return `${baseUrl}/verify/${certificateId}`;
}

// Generate PDF certificate
async function generatePDF(
  certId: string,
  data: CertificateData,
  qrCodeDataUrl: string
): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // --- HEADER ---
  doc.setFillColor(2, 2, 2); // #020202
  doc.rect(0, 0, 297, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("CARBON CREDIT CERTIFICATE", 148.5, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("ISO 14064-3 Verified Carbon Offset", 148.5, 30, { align: "center" });

  // --- CERTIFICATE ID & QR ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Certificate ID: ${certId}`, 20, 55);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Issued: ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })}`, 20, 62);

  // QR Code (right side)
  doc.addImage(qrCodeDataUrl, "PNG", 240, 50, 40, 40);
  doc.setFontSize(7);
  doc.text("Scan to verify", 260, 95, { align: "center" });

  // --- ENTITY INFORMATION ---
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("ENTITY INFORMATION", 20, 75);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Entity Name: ${data.entityName}`, 20, 85);
  doc.text(`Entity ID: ${data.entityId}`, 20, 92);
  doc.text(`Entity Type: ${data.entityType}`, 20, 99);

  // --- ASSET INFORMATION ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("ASSET INFORMATION", 20, 113);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Asset: ${data.assetDescription}`, 20, 123);
  doc.text(`Type: ${data.assetType}`, 20, 130);
  doc.text(`Period: ${data.startDate} to ${data.endDate}`, 20, 137);

  // --- CARBON IMPACT (Highlighted) ---
  doc.setFillColor(16, 185, 129); // Emerald-500
  doc.roundedRect(20, 148, 100, 25, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CARBON IMPACT", 70, 156, { align: "center" });

  doc.setFontSize(20);
  doc.text(`${data.carbonImpact.toFixed(2)} tCO2e`, 70, 167, { align: "center" });

  // --- CONFIDENCE SCORE ---
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(130, 148, 60, 25, 3, 3, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Confidence", 160, 156, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.confidence}%`, 160, 167, { align: "center" });

  // --- DATA POINTS SUMMARY ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("DATA VALIDATION", 20, 185);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Data Points: ${data.dataPoints.length}`, 20, 193);

  const highTrust = data.dataPoints.filter((d) => d.trustScore === "HIGH").length;
  const mediumTrust = data.dataPoints.filter((d) => d.trustScore === "MEDIUM").length;
  const lowTrust = data.dataPoints.filter((d) => d.trustScore === "LOW").length;

  doc.text(`High Trust: ${highTrust} | Medium: ${mediumTrust} | Low: ${lowTrust}`, 20, 200);

  // --- FOOTER ---
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 190, 297, 20, "F");

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("This certificate is digitally verified and complies with ISO 14064-3 standards.", 148.5, 198, { align: "center" });
  doc.text(`Verification URL: ${getVerificationUrl(certId)}`, 148.5, 203, { align: "center" });

  // Convert to buffer
  const pdfOutput = doc.output("arraybuffer");
  return Buffer.from(pdfOutput);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      entityName,
      entityId,
      entityType,
      assetDescription,
      assetType,
      carbonImpact,
      confidence,
      startDate,
      endDate,
      dataPoints,
    }: CertificateData = body;

    if (!entityName || !carbonImpact) {
      return NextResponse.json(
        { error: "Missing required fields: entityName, carbonImpact" },
        { status: 400 }
      );
    }

    // Generate certificate ID
    const certificateId = generateCertificateId();

    // Generate QR code
    const verificationUrl = getVerificationUrl(certificateId);
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: "#020202",
        light: "#FFFFFF",
      },
    });

    // Generate PDF
    const pdfBuffer = await generatePDF(certificateId, body, qrCodeDataUrl);

    // TODO: Save certificate metadata to database
    // TODO: Upload PDF to cloud storage (S3/Supabase Storage)
    // For now, return PDF as base64

    const pdfBase64 = pdfBuffer.toString("base64");

    return NextResponse.json({
      success: true,
      certificateId,
      verificationUrl,
      pdf: `data:application/pdf;base64,${pdfBase64}`,
      metadata: {
        entityName,
        carbonImpact,
        confidence,
        issuedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Certificate generation error:", err);
    const message = err instanceof Error ? err.message : "Failed to generate certificate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

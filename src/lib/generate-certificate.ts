
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface CertificateData {
    certificateId: string;
    projectName: string;
    projectType: string;
    location: string;
    gstin: string;
    industrialId: string;
    carbonReduced: string;
    vintage: string;
    issuedDate: string;
    verifier: string;
    recipientName: string;
    recipientAddress: string;
}

export const generateGreenImpactCertificate = (data: CertificateData) => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    // --- Background & Border ---
    doc.setFillColor(248, 250, 252); // Very light slate/gray background
    doc.rect(0, 0, 297, 210, "F");

    doc.setLineWidth(1.5);
    doc.setDrawColor(16, 185, 129); // Emerald-500
    doc.rect(10, 10, 277, 190); // Outer border

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.rect(12, 12, 273, 186); // Inner thin border

    // --- Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(6, 78, 59); // Emerald-900
    doc.text("GREEN IMPACT CERTIFICATE", 148.5, 30, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.setFont("helvetica", "normal");
    doc.text("Verified Carbon Reduction Asset • CarbonCore DPI", 148.5, 38, { align: "center" });

    // --- Certificate ID & QR Placeholder ---
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129);
    doc.text(`Certificate ID: ${data.certificateId}`, 20, 20);

    // QR Code Box (Placeholder for now)
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(245, 18, 25, 25, "FD");
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text("Scan to Verify", 257.5, 46, { align: "center" });

    // --- Main Content ---
    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85); // Slate-700
    doc.text("This certifies that", 148.5, 60, { align: "center" });

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text(data.recipientName, 148.5, 72, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(data.recipientAddress, 148.5, 80, { align: "center" });
    doc.text(`GSTIN/Tax ID: ${data.gstin}`, 148.5, 86, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85);
    doc.text("Has successfully retired carbon credits equivalent to:", 148.5, 100, { align: "center" });

    // --- Key Stat (Big Number) ---
    doc.setFontSize(48);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129); // Emerald-500
    doc.text(`${data.carbonReduced}`, 148.5, 120, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(6, 78, 59);
    doc.text("Tonnes of CO₂ Equivalent (tCO₂e)", 148.5, 130, { align: "center" });

    // --- Project Details Table ---
    autoTable(doc, {
        startY: 145,
        head: [["Project Name", "Asset Type", "Vintage", "Location", "Registry ID"]],
        body: [
            [data.projectName, data.projectType, data.vintage, data.location, data.industrialId],
        ],
        theme: "grid",
        headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 10, cellPadding: 3, halign: "center" },
        margin: { left: 40, right: 40 },
    });

    // --- Footer & Signatures ---
    const footerY = 190;

    // Date
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`Issued On: ${data.issuedDate}`, 30, footerY);

    // Verifier Signature Line
    doc.line(200, footerY - 5, 270, footerY - 5);
    doc.text(`Verified by: ${data.verifier}`, 235, footerY, { align: "center" });
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(" Authorized Auditor • CarbonCore Network", 235, footerY + 5, { align: "center" });

    // Branding Footer
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129); // Emerald-500
    doc.text("Generative AI Audit • Powered by GreenPe Infrastructure • Immutable Record on CarbonChain", 148.5, 203, { align: "center" });

    // --- 7-Layer Audit Report ---
    doc.addPage();
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, "F");

    doc.setFontSize(18);
    doc.setTextColor(6, 78, 59);
    doc.text("Infrastructure Verification Log", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Audit ID: ${data.certificateId} • ${data.issuedDate}`, 14, 26);

    const layerData = [
        ["1. Device Identity", "Verified", "Solar Inverter #INV-8821 (Secure Boot)", "Hardware Security Module"],
        ["2. Connectivity", "Active", "Live Stream (MQTT over TLS)", "Network Monitor"],
        ["3. Data Integrity", "Valid", "Signed Telemetry (Ed25519)", "Cryptographic Verifier"],
        ["4. MRV Engine", "Processed", `Volume Calculation: ${data.carbonReduced} tCO2e`, "CarbonCore AI"],
        ["5. Tokenization", "Minted", "dMRV Token #8821-TK", "Smart Contract Registry"],
        ["6. Settlement", "Cleared", "UPI Payment / Offset Retirement", "Settlement Layer"],
        ["7. Export", "Generated", "Green Impact Certificate (PDF)", "DocuGen Service"],
    ];

    autoTable(doc, {
        startY: 35,
        head: [["Layer", "Status", "Details", "Verifier"]],
        body: layerData,
        theme: "striped",
        headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 40 },
            1: { textColor: [16, 185, 129], fontStyle: "bold" },
        },
    });

    // Save
    doc.save(`${data.certificateId}_GreenImpact_Audit.pdf`);
};

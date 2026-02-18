/**
 * Document Ingest API
 * Accepts file uploads, parses content, and returns extracted text
 * for injection into AI agent context.
 *
 * Supported: PDF, CSV, XLSX/XLS, DOCX, TXT, JSON, MD
 */

import { NextRequest, NextResponse } from "next/server";

// Max file size: 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const SUPPORTED_EXTENSIONS = [
    "pdf", "csv", "xlsx", "xls", "docx", "txt", "json", "md",
];

const MAX_TEXT_LENGTH = 12000; // Characters — fits in Greeni AI context window

function getExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || "";
}

function truncateText(text: string, max: number): string {
    if (text.length <= max) return text;
    return text.slice(0, max) + "\n\n... [truncated — document too large, showing first " + max + " characters]";
}

async function parsePDF(buffer: Buffer): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    return data.text || "";
}

async function parseCSV(text: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Papa = require("papaparse");
    const result = Papa.parse(text, { header: true, skipEmptyLines: true });

    if (!result.data || result.data.length === 0) return "Empty CSV file";

    const headers = result.meta.fields || [];
    const rows = result.data as Record<string, string>[];
    const totalRows = rows.length;

    // Build a formatted summary
    let output = `CSV Data — ${totalRows} rows × ${headers.length} columns\n`;
    output += `Columns: ${headers.join(", ")}\n\n`;

    // Show first 100 rows as readable table
    const previewRows = rows.slice(0, 100);
    output += `| ${headers.join(" | ")} |\n`;
    output += `| ${headers.map(() => "---").join(" | ")} |\n`;
    for (const row of previewRows) {
        output += `| ${headers.map((h: string) => String(row[h] ?? "")).join(" | ")} |\n`;
    }

    if (totalRows > 100) {
        output += `\n... and ${totalRows - 100} more rows`;
    }

    return output;
}

async function parseExcel(buffer: Buffer): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const XLSX = require("xlsx");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    let output = "";

    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

        if (data.length === 0) continue;

        output += `\n## Sheet: ${sheetName} (${data.length - 1} rows)\n\n`;

        const headers = data[0].map((h: unknown) => String(h));
        const rows = data.slice(1, 101); // First 100 data rows

        output += `| ${headers.join(" | ")} |\n`;
        output += `| ${headers.map(() => "---").join(" | ")} |\n`;
        for (const row of rows) {
            output += `| ${row.map((c: unknown) => String(c ?? "")).join(" | ")} |\n`;
        }

        if (data.length > 101) {
            output += `\n... and ${data.length - 101} more rows\n`;
        }
    }

    return output || "Empty Excel file";
}

async function parseDOCX(buffer: Buffer): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
                { status: 400 }
            );
        }

        const ext = getExtension(file.name);
        if (!SUPPORTED_EXTENSIONS.includes(ext)) {
            return NextResponse.json(
                { error: `Unsupported file type: .${ext}. Supported: ${SUPPORTED_EXTENSIONS.join(", ")}` },
                { status: 400 }
            );
        }

        let textContent = "";
        const buffer = Buffer.from(await file.arrayBuffer());

        switch (ext) {
            case "pdf":
                textContent = await parsePDF(buffer);
                break;

            case "csv":
                textContent = await parseCSV(buffer.toString("utf-8"));
                break;

            case "xlsx":
            case "xls":
                textContent = await parseExcel(buffer);
                break;

            case "docx":
                textContent = await parseDOCX(buffer);
                break;

            case "txt":
            case "md":
                textContent = buffer.toString("utf-8");
                break;

            case "json":
                try {
                    const jsonData = JSON.parse(buffer.toString("utf-8"));
                    textContent = JSON.stringify(jsonData, null, 2);
                } catch {
                    textContent = buffer.toString("utf-8");
                }
                break;

            default:
                textContent = buffer.toString("utf-8");
        }

        // Clean up and truncate
        textContent = textContent.replace(/\r\n/g, "\n").trim();
        const fullLength = textContent.length;
        textContent = truncateText(textContent, MAX_TEXT_LENGTH);

        return NextResponse.json({
            success: true,
            fileName: file.name,
            fileType: ext,
            fileSize: file.size,
            textContent,
            charCount: fullLength,
            truncated: fullLength > MAX_TEXT_LENGTH,
            summary: `Parsed ${file.name} (${ext.toUpperCase()}, ${(file.size / 1024).toFixed(1)}KB) — ${fullLength} characters extracted`,
        });
    } catch (err) {
        console.error("Ingest error:", err);
        const message = err instanceof Error ? err.message : "Failed to process document";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

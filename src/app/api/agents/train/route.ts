
import { NextRequest } from "next/server";
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const { text, keywords = [] } = await request.json();

        if (!text) {
            return new Response(JSON.stringify({ error: "Text content is required" }), { status: 400 });
        }

        // Path to local memory store
        const memoryPath = path.join(process.cwd(), 'data', 'memory.json');

        let existingMemory = [];
        if (fs.existsSync(memoryPath)) {
            try {
                const fileData = fs.readFileSync(memoryPath, 'utf-8');
                existingMemory = JSON.parse(fileData);
            } catch (e) {
                console.warn("Failed to parse existing memory, starting fresh", e);
            }
        }

        // Create new memory entry
        const newEntry = {
            id: `mem-${Date.now()}`,
            content: text,
            keywords: keywords.length > 0 ? keywords : extractKeywords(text),
            timestamp: new Date().toISOString()
        };

        // Add to store
        existingMemory.push(newEntry);

        // Save back to file
        fs.writeFileSync(memoryPath, JSON.stringify(existingMemory, null, 2));

        return new Response(JSON.stringify({
            success: true,
            message: "Successfully trained memory",
            entryId: newEntry.id
        }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            error: err instanceof Error ? err.message : "Unknown error"
        }), { status: 500 });
    }
}

// Simple keyword extractor workaround
function extractKeywords(text: string): string[] {
    return text.split(/\s+/)
        .map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))
        .filter(w => w.length > 4)
        .slice(0, 5);
}

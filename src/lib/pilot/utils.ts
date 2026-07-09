import crypto from "node:crypto";

export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, nestedValue]) => `${JSON.stringify(key)}:${stableStringify(nestedValue)}`);

    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(value);
}

export function sha256(value: unknown): string {
  return crypto.createHash("sha256").update(stableStringify(value)).digest("hex");
}

export function createId(prefix: string, seed?: string): string {
  const raw = seed ? sha256(seed).slice(0, 12) : crypto.randomBytes(6).toString("hex");
  return `${prefix}-${raw}`;
}

export function toFixedNumber(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}

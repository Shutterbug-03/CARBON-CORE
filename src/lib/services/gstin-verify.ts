/**
 * GSTIN Format Verification Service
 *
 * For MVP: Format-only validation using official GSTIN structure.
 * Production upgrade: Wire to MasterGST API (₹0.50/lookup) or GST.gov.in
 *
 * GSTIN Structure (15 chars):
 *   Pos 1-2:  State code (01-37)
 *   Pos 3-12: PAN (AAAPL1234C format)
 *   Pos 13:   Entity number (1-Z)
 *   Pos 14:   'Z' (default)
 *   Pos 15:   Check digit (0-9 or A-Z)
 */

// Indian state codes (01 to 37, plus 97 for TDS/TCS)
const VALID_STATE_CODES = new Set([
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
  "31", "32", "33", "34", "35", "36", "37", "97",
]);

const STATE_NAMES: Record<string, string> = {
  "01": "Jammu & Kashmir", "02": "Himachal Pradesh", "03": "Punjab",
  "04": "Chandigarh", "05": "Uttarakhand", "06": "Haryana",
  "07": "Delhi", "08": "Rajasthan", "09": "Uttar Pradesh",
  "10": "Bihar", "11": "Sikkim", "12": "Arunachal Pradesh",
  "13": "Nagaland", "14": "Manipur", "15": "Mizoram",
  "16": "Tripura", "17": "Meghalaya", "18": "Assam",
  "19": "West Bengal", "20": "Jharkhand", "21": "Odisha",
  "22": "Chhattisgarh", "23": "Madhya Pradesh", "24": "Gujarat",
  "25": "Daman & Diu", "26": "Dadra & Nagar Haveli", "27": "Maharashtra",
  "28": "Andhra Pradesh", "29": "Karnataka", "30": "Goa",
  "31": "Lakshadweep", "32": "Kerala", "33": "Tamil Nadu",
  "34": "Puducherry", "35": "Andaman & Nicobar", "36": "Telangana",
  "37": "Andhra Pradesh (new)", "97": "TDS/TCS",
};

// GSTIN format: 2-digit state + 10-char PAN + entity + Z + check
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/;

// PAN format: AAAPL1234C
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export interface GSTINVerificationResult {
  valid: boolean;
  gstin: string;
  stateCode: string | null;
  stateName: string | null;
  pan: string | null;
  entityNumber: string | null;
  errors: string[];
  verifiedAt: string;
  verificationMethod: "FORMAT_VALIDATION"; // MVP — format only
}

/**
 * Verify GSTIN format validity.
 * Does NOT call any external API — pure format validation.
 * Production: upgrade to MasterGST or GST.gov.in lookup.
 */
export function verifyGSTIN(gstin: string): GSTINVerificationResult {
  const errors: string[] = [];
  const normalized = gstin.trim().toUpperCase();

  // Length check
  if (normalized.length !== 15) {
    errors.push(`GSTIN must be exactly 15 characters (got ${normalized.length})`);
  }

  // Regex format check
  if (!GSTIN_REGEX.test(normalized)) {
    errors.push("GSTIN format invalid. Expected: 2-digit state + 5-letter + 4-digit + letter + alphanumeric + Z + check");
  }

  // State code check
  const stateCode = normalized.slice(0, 2);
  if (!VALID_STATE_CODES.has(stateCode)) {
    errors.push(`Invalid state code: ${stateCode}. Must be 01-37 or 97.`);
  }

  // PAN extraction and validation
  const pan = normalized.slice(2, 12);
  if (!PAN_REGEX.test(pan)) {
    errors.push(`Embedded PAN "${pan}" is not a valid PAN format.`);
  }

  // Position 14 must be 'Z'
  if (normalized.length >= 14 && normalized[13] !== "Z") {
    errors.push(`Position 14 must be 'Z' (got '${normalized[13]}')`);
  }

  const entityNumber = normalized.length >= 13 ? normalized[12] : null;

  return {
    valid: errors.length === 0,
    gstin: normalized,
    stateCode: errors.length === 0 ? stateCode : null,
    stateName: errors.length === 0 ? (STATE_NAMES[stateCode] ?? null) : null,
    pan: errors.length === 0 ? pan : null,
    entityNumber,
    errors,
    verifiedAt: new Date().toISOString(),
    verificationMethod: "FORMAT_VALIDATION",
  };
}

/**
 * Quick boolean check — does this GSTIN pass format validation?
 */
export function isValidGSTIN(gstin: string): boolean {
  return verifyGSTIN(gstin).valid;
}

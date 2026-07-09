import { cdifInputSchema, type CDIFInputData, type GPSPoint } from "./types";

function parseGps(gps: string, location: string): GPSPoint {
  const [latRaw, lngRaw] = gps.split(",").map((segment) => segment.trim());
  const lat = Number(latRaw);
  const lng = Number(lngRaw);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error(`Invalid GPS coordinates: ${gps}`);
  }

  return {
    lat,
    lng,
    region: location,
  };
}

export function normalizeCDIFInput(input: unknown): CDIFInputData {
  const parsed = cdifInputSchema.parse(input);

  return {
    ...parsed,
    projectIdentity: {
      ...parsed.projectIdentity,
      projectName: parsed.projectIdentity.projectName.trim(),
      companyName: parsed.projectIdentity.companyName.trim(),
      location: parsed.projectIdentity.location.trim(),
      gps: `${parseGps(parsed.projectIdentity.gps, parsed.projectIdentity.location).lat},${parseGps(parsed.projectIdentity.gps, parsed.projectIdentity.location).lng}`,
    },
    physicalAsset: {
      ...parsed.physicalAsset,
      assetType: parsed.physicalAsset.assetType.trim().toUpperCase(),
    },
    monitoringPeriod: {
      ...parsed.monitoringPeriod,
      verifiedReadings: Math.min(
        parsed.monitoringPeriod.verifiedReadings,
        parsed.monitoringPeriod.totalReadingsExpected,
      ),
    },
  };
}

export function extractGpsPoint(input: CDIFInputData): GPSPoint {
  return parseGps(input.projectIdentity.gps, input.projectIdentity.location);
}

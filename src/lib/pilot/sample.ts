/**
 * GreenPe Pilot — Sample Datasets
 *
 * One realistic Indian MSME dataset per supported asset type.
 * All values are based on typical Indian installations.
 */

import type { CDIFInputData } from "./types";

// ─── 1. ROOFTOP SOLAR ──────────────────────────────────────────
export const rooftopSolarSample: CDIFInputData = {
  projectIdentity: {
    projectName: "Surya Textiles Rooftop Solar",
    projectId: "SURYA-GJ-001",
    cihReference: "",
    companyName: "Surya Textiles Pvt Ltd",
    gstin: "24ABCDE1234F1Z5",
    udyam: "UDYAM-GJ-01-0001234",
    pan: "ABCDE1234F",
    location: "Rajkot, Gujarat, India",
    gps: "22.3039,70.8022",
    industry: "Textiles",
    contact: "ops@suryatextiles.example",
  },
  physicalAsset: {
    assetType: "ROOFTOP_SOLAR",
    installedCapacity: "500 kWp",
    panelConfiguration: "Mono PERC 545Wp × 917 panels",
    inverter: "Sungrow SG110CX",
    commissioningDate: "2025-06-01",
    installer: "Tata Power Solar",
    rooftopArea: "4000 sq ft",
    iotDeviceId: "INV-GJ-0001",
    deviceFingerprint: "fingerprint-001",
  },
  monitoringPeriod: {
    periodStart: "2026-01-01",
    periodEnd: "2026-03-31",
    durationDays: 90,
    reportingQuarter: "Q1",
    reportingFrequency: "DAILY",
    totalReadingsExpected: 90,
    verifiedReadings: 88,
  },
  metrics: {
    totalEnergyGeneratedKWh: 17540,
    totalSolarGenKWh: 17540,
    totalDieselLitres: 1525,
    biomassConsumedTonnes: 0,
    biomassMoisturePercent: 15,
    biogasProducedM3: 0,
    methaneContentPercent: 60,
    biogasFlaredM3: 0,
    thermalSavingsKWh: 0,
    baselineConsumptionKWh: 0,
    waterFlowM3PerSec: 0,
    headMetres: 0,
    fabricProducedTonnes: 412.5,
    productOutputTonnes: 412.5,
  },
};

// ─── 2. WIND ENERGY ────────────────────────────────────────────
export const windEnergySample: CDIFInputData = {
  projectIdentity: {
    projectName: "Pawan Wind Farm — Kutch",
    projectId: "PAWAN-GJ-002",
    cihReference: "",
    companyName: "Pawan Shakti Energy Pvt Ltd",
    gstin: "24FGHIJ5678K2Z3",
    udyam: "UDYAM-GJ-02-0005678",
    pan: "FGHIJ5678K",
    location: "Kutch, Gujarat, India",
    gps: "23.7337,69.8597",
    industry: "Power Generation",
    contact: "wind@pawanshakti.example",
  },
  physicalAsset: {
    assetType: "WIND",
    installedCapacity: "2.1 MW",
    panelConfiguration: "",
    inverter: "Suzlon S120 2.1MW",
    commissioningDate: "2024-09-15",
    installer: "Suzlon Energy",
    rooftopArea: "",
    iotDeviceId: "WTG-GJ-0023",
    deviceFingerprint: "fingerprint-wind-023",
  },
  monitoringPeriod: {
    periodStart: "2026-01-01",
    periodEnd: "2026-03-31",
    durationDays: 90,
    reportingQuarter: "Q1",
    reportingFrequency: "15-MIN",
    totalReadingsExpected: 8640,
    verifiedReadings: 8512,
  },
  metrics: {
    totalEnergyGeneratedKWh: 996480, // 2.1MW × 0.22 CF × 90 days × 24h
    totalSolarGenKWh: 0,
    totalDieselLitres: 85, // Minimal DG for site operations
    biomassConsumedTonnes: 0,
    biomassMoisturePercent: 15,
    biogasProducedM3: 0,
    methaneContentPercent: 60,
    biogasFlaredM3: 0,
    thermalSavingsKWh: 0,
    baselineConsumptionKWh: 0,
    waterFlowM3PerSec: 0,
    headMetres: 0,
    fabricProducedTonnes: 0,
    productOutputTonnes: 0,
  },
};

// ─── 3. SMALL HYDRO ───────────────────────────────────────────
export const smallHydroSample: CDIFInputData = {
  projectIdentity: {
    projectName: "Tirthan Valley Small Hydro",
    projectId: "HYDRO-HP-001",
    cihReference: "",
    companyName: "Himalayan Green Power Ltd",
    gstin: "02KLMNO9012P3Z4",
    udyam: "",
    pan: "KLMNO9012P",
    location: "Tirthan Valley, Himachal Pradesh, India",
    gps: "31.6380,77.4500",
    industry: "Hydroelectric",
    contact: "ops@himalayangreenpower.example",
  },
  physicalAsset: {
    assetType: "SMALL_HYDRO",
    installedCapacity: "5 MW",
    panelConfiguration: "",
    inverter: "",
    commissioningDate: "2023-04-10",
    installer: "NHPC Subsidiary",
    rooftopArea: "",
    iotDeviceId: "HYD-HP-0001",
    deviceFingerprint: "fingerprint-hydro-001",
  },
  monitoringPeriod: {
    periodStart: "2026-01-01",
    periodEnd: "2026-03-31",
    durationDays: 90,
    reportingQuarter: "Q1",
    reportingFrequency: "HOURLY",
    totalReadingsExpected: 2160,
    verifiedReadings: 2140,
  },
  metrics: {
    totalEnergyGeneratedKWh: 3780000, // 5MW × 0.35 CF × 90 × 24
    totalSolarGenKWh: 0,
    totalDieselLitres: 220,
    biomassConsumedTonnes: 0,
    biomassMoisturePercent: 15,
    biogasProducedM3: 0,
    methaneContentPercent: 60,
    biogasFlaredM3: 0,
    thermalSavingsKWh: 0,
    baselineConsumptionKWh: 0,
    waterFlowM3PerSec: 3.2, // m³/s avg flow
    headMetres: 185,        // metres of head
    fabricProducedTonnes: 0,
    productOutputTonnes: 0,
  },
};

// ─── 4. BIOMASS POWER ──────────────────────────────────────────
export const biomassPowerSample: CDIFInputData = {
  projectIdentity: {
    projectName: "Agri Waste Biomass Power — Sangli",
    projectId: "BIO-MH-001",
    cihReference: "",
    companyName: "Maharashtra Agri Power Co-op",
    gstin: "27QRSTU3456V4Z5",
    udyam: "UDYAM-MH-03-0009012",
    pan: "QRSTU3456V",
    location: "Sangli, Maharashtra, India",
    gps: "16.8524,74.5815",
    industry: "Biomass Power",
    contact: "ops@mhagripower.example",
  },
  physicalAsset: {
    assetType: "BIOMASS",
    installedCapacity: "10 MW",
    panelConfiguration: "",
    inverter: "",
    commissioningDate: "2024-01-20",
    installer: "Thermax Ltd",
    rooftopArea: "",
    iotDeviceId: "BIO-MH-0001",
    deviceFingerprint: "fingerprint-bio-001",
  },
  monitoringPeriod: {
    periodStart: "2026-01-01",
    periodEnd: "2026-03-31",
    durationDays: 90,
    reportingQuarter: "Q1",
    reportingFrequency: "DAILY",
    totalReadingsExpected: 90,
    verifiedReadings: 87,
  },
  metrics: {
    totalEnergyGeneratedKWh: 12960000, // 10MW × 0.60 PLF × 90 × 24
    totalSolarGenKWh: 0,
    totalDieselLitres: 450, // DG backup
    biomassConsumedTonnes: 16200, // ~180 tonnes/day bagasse+rice husk
    biomassMoisturePercent: 18,
    biogasProducedM3: 0,
    methaneContentPercent: 60,
    biogasFlaredM3: 0,
    thermalSavingsKWh: 0,
    baselineConsumptionKWh: 0,
    waterFlowM3PerSec: 0,
    headMetres: 0,
    fabricProducedTonnes: 0,
    productOutputTonnes: 0,
  },
};

// ─── 5. BIOGAS / METHANE CAPTURE ───────────────────────────────
export const biogasCaptureSample: CDIFInputData = {
  projectIdentity: {
    projectName: "Dairy Biogas Recovery — Anand",
    projectId: "GAS-GJ-001",
    cihReference: "",
    companyName: "Amul Dairy Cooperative",
    gstin: "24WXYZ67890A5Z6",
    udyam: "",
    pan: "WXYZ67890A",
    location: "Anand, Gujarat, India",
    gps: "22.5645,72.9289",
    industry: "Dairy & Waste Management",
    contact: "biogas@amuldairy.example",
  },
  physicalAsset: {
    assetType: "BIOGAS",
    installedCapacity: "500 m³/day",
    panelConfiguration: "",
    inverter: "",
    commissioningDate: "2025-03-01",
    installer: "Mailhem Engineers",
    rooftopArea: "",
    iotDeviceId: "BGS-GJ-0001",
    deviceFingerprint: "fingerprint-biogas-001",
  },
  monitoringPeriod: {
    periodStart: "2026-01-01",
    periodEnd: "2026-03-31",
    durationDays: 90,
    reportingQuarter: "Q1",
    reportingFrequency: "DAILY",
    totalReadingsExpected: 90,
    verifiedReadings: 89,
  },
  metrics: {
    totalEnergyGeneratedKWh: 0,
    totalSolarGenKWh: 0,
    totalDieselLitres: 30, // Minimal
    biomassConsumedTonnes: 0,
    biomassMoisturePercent: 15,
    biogasProducedM3: 45000, // 500 m³/day × 90 days
    methaneContentPercent: 62,
    biogasFlaredM3: 2000, // Safety flaring
    thermalSavingsKWh: 0,
    baselineConsumptionKWh: 0,
    waterFlowM3PerSec: 0,
    headMetres: 0,
    fabricProducedTonnes: 0,
    productOutputTonnes: 0,
  },
};

// ─── 6. THERMAL / INDUSTRIAL EFFICIENCY ────────────────────────
export const thermalEfficiencySample: CDIFInputData = {
  projectIdentity: {
    projectName: "Ceramic Kiln Efficiency Upgrade — Morbi",
    projectId: "THERM-GJ-001",
    cihReference: "",
    companyName: "Morbi Ceramics Industries Assoc.",
    gstin: "24BCDEF1234G6Z7",
    udyam: "UDYAM-GJ-04-0002345",
    pan: "BCDEF1234G",
    location: "Morbi, Gujarat, India",
    gps: "22.8120,70.8370",
    industry: "Ceramics Manufacturing",
    contact: "energy@morbiceramics.example",
  },
  physicalAsset: {
    assetType: "THERMAL_EFFICIENCY",
    installedCapacity: "800 kW thermal",
    panelConfiguration: "",
    inverter: "",
    commissioningDate: "2025-08-15",
    installer: "Forbes Marshall",
    rooftopArea: "",
    iotDeviceId: "KILN-GJ-0001",
    deviceFingerprint: "fingerprint-kiln-001",
  },
  monitoringPeriod: {
    periodStart: "2026-01-01",
    periodEnd: "2026-03-31",
    durationDays: 90,
    reportingQuarter: "Q1",
    reportingFrequency: "DAILY",
    totalReadingsExpected: 90,
    verifiedReadings: 90,
  },
  metrics: {
    totalEnergyGeneratedKWh: 0,
    totalSolarGenKWh: 0,
    totalDieselLitres: 0,
    biomassConsumedTonnes: 0,
    biomassMoisturePercent: 15,
    biogasProducedM3: 0,
    methaneContentPercent: 60,
    biogasFlaredM3: 0,
    thermalSavingsKWh: 432000, // 800kW × 0.6 util × 90 × 10 hrs/day
    baselineConsumptionKWh: 1080000, // Before upgrade: 40% higher
    waterFlowM3PerSec: 0,
    headMetres: 0,
    fabricProducedTonnes: 0,
    productOutputTonnes: 5400, // 60 tonnes/day ceramics
  },
};

// ─── Lookup Map ────────────────────────────────────────────────
export const sampleDatasets: Record<string, CDIFInputData> = {
  "ROOFTOP_SOLAR": rooftopSolarSample,
  "WIND": windEnergySample,
  "SMALL_HYDRO": smallHydroSample,
  "BIOMASS": biomassPowerSample,
  "BIOGAS": biogasCaptureSample,
  "THERMAL_EFFICIENCY": thermalEfficiencySample,
};

/**
 * GreenPe Pilot — Methodology Registry
 *
 * 6 approved methodologies with real emission factors.
 *
 * SOURCE AUTHORITIES:
 *   Grid EF         — CEA CO2 Baseline Database v19.0, FY2023-24
 *   Diesel EF       — IPCC AR6 (2.68 kgCO2/litre)
 *   CH4 GWP         — IPCC AR6 (27.9 over 100yr, including climate-carbon feedbacks)
 *   CAF             — UNFCCC CDM EB55 Annex II (5% discount)
 *   Biomass EF      — IPCC Guidelines for National GHG Inventories (2006, Vol 2, Ch 2)
 *   Hydro capacity  — CEA India (All-India avg small hydro capacity factor 0.35)
 *   Thermal EF      — BEE India (Bureau of Energy Efficiency PAT scheme)
 */

import type { AssetType, MethodologyDefinition } from "./types";

const methodologies: Record<string, MethodologyDefinition> = {

  // ─── 1. ROOFTOP SOLAR ────────────────────────────────────────
  "IN-ROOFTOP-SOLAR-V1": {
    id: "IN-ROOFTOP-SOLAR-V1",
    version: "2026.1",
    authority: "GreenPe India Pilot Methodology Registry | AMS-I.D UNFCCC CDM v18",
    title: "India Rooftop Solar Verification for Climate Proofing",
    assetType: "ROOFTOP_SOLAR",
    sector: "Energy",
    geography: "INDIA",
    impactType: "AVOIDED",
    formula: "tCO2e = (kWh × dataCompleteness × gridEF / 1000 × CAF) − scope1Diesel",
    gridEmissionFactor: 0.8925767,  // Western India grid weighted avg
    dieselEmissionFactor: 2.68,
    conservativeAdjustmentFactor: 0.95,
    transmissionLossFactor: 0.038,
  },

  // ─── 2. WIND ENERGY ──────────────────────────────────────────
  "IN-WIND-V1": {
    id: "IN-WIND-V1",
    version: "2026.1",
    authority: "GreenPe India Pilot Methodology Registry | ACM0002 Verra VCS v19",
    title: "India Grid-Connected Wind Energy Generation",
    assetType: "WIND",
    sector: "Energy",
    geography: "INDIA",
    impactType: "AVOIDED",
    formula: "tCO2e = (kWh × dataCompleteness × gridEF / 1000 × CAF) − scope1Diesel",
    gridEmissionFactor: 0.716,  // CEA India National avg
    dieselEmissionFactor: 2.68,
    conservativeAdjustmentFactor: 0.95,
    transmissionLossFactor: 0.038,
    capacityFactor: 0.22,  // India avg wind capacity factor (CEA)
  },

  // ─── 3. SMALL HYDRO ──────────────────────────────────────────
  "IN-SMALL-HYDRO-V1": {
    id: "IN-SMALL-HYDRO-V1",
    version: "2026.1",
    authority: "GreenPe India Pilot Methodology Registry | AMS-I.D UNFCCC CDM v18",
    title: "India Small Hydro (<25 MW) Grid-Connected Generation",
    assetType: "SMALL_HYDRO",
    sector: "Energy",
    geography: "INDIA",
    impactType: "AVOIDED",
    formula: "tCO2e = (kWh × dataCompleteness × gridEF / 1000 × CAF) − scope1Diesel",
    gridEmissionFactor: 0.821,  // Eastern India grid (where most small hydro)
    dieselEmissionFactor: 2.68,
    conservativeAdjustmentFactor: 0.95,
    transmissionLossFactor: 0.042,  // Higher T&D for rural hydro
    capacityFactor: 0.35,   // CEA India avg small hydro
    turbineEfficiency: 0.85, // Typical Kaplan/Francis turbine
  },

  // ─── 4. BIOMASS POWER ────────────────────────────────────────
  "IN-BIOMASS-V1": {
    id: "IN-BIOMASS-V1",
    version: "2026.1",
    authority: "GreenPe India Pilot Methodology Registry | AMS-I.C UNFCCC CDM v21",
    title: "India Biomass Power Generation — Grid Displacement",
    assetType: "BIOMASS",
    sector: "Energy",
    geography: "INDIA",
    impactType: "AVOIDED",
    formula: "tCO2e = (kWh_generated × gridEF / 1000 × CAF) − (biomass_tonnes × biomassEF × (1 − renewableFraction) / 1000)",
    gridEmissionFactor: 0.716,  // India National avg
    dieselEmissionFactor: 2.68,
    conservativeAdjustmentFactor: 0.95,
    transmissionLossFactor: 0.038,
    biomassEmissionFactor: 1460,  // kgCO2/tonne biomass (IPCC 2006 rice husk/bagasse avg)
    biomassRenewableFraction: 0.85, // 85% is biogenic (carbon-neutral), 15% fossil auxiliary
  },

  // ─── 5. BIOGAS / METHANE CAPTURE ─────────────────────────────
  "IN-BIOGAS-V1": {
    id: "IN-BIOGAS-V1",
    version: "2026.1",
    authority: "GreenPe India Pilot Methodology Registry | AMS-III.D UNFCCC CDM v19",
    title: "India Biogas Recovery and Methane Avoidance",
    assetType: "BIOGAS",
    sector: "Waste",
    geography: "INDIA",
    impactType: "AVOIDED",
    formula: "tCO2e = (biogasM3 × CH4fraction × CH4density × GWP100yr × oxidationFactor / 1000) × CAF",
    gridEmissionFactor: 0.716,
    dieselEmissionFactor: 2.68,
    conservativeAdjustmentFactor: 0.95,
    transmissionLossFactor: 0,
    ch4GWP100yr: 27.9,  // IPCC AR6 (including climate-carbon feedbacks)
    methaneOxidationFactor: 0.99, // 99% methane oxidation in flare/engine
  },

  // ─── 6. THERMAL / INDUSTRIAL EFFICIENCY ──────────────────────
  "IN-THERMAL-EFFICIENCY-V1": {
    id: "IN-THERMAL-EFFICIENCY-V1",
    version: "2026.1",
    authority: "GreenPe India Pilot Methodology Registry | AMS-II.D UNFCCC CDM v14",
    title: "India Industrial Thermal Energy Efficiency Improvement",
    assetType: "THERMAL_EFFICIENCY",
    sector: "Industry",
    geography: "INDIA",
    impactType: "AVOIDED",
    formula: "tCO2e = (thermalSavingsKWh × thermalBaselineEF / 1000) × CAF",
    gridEmissionFactor: 0.716,
    dieselEmissionFactor: 2.68,
    conservativeAdjustmentFactor: 0.90, // Higher discount for efficiency (10%)
    transmissionLossFactor: 0,
    thermalBaselineEF: 0.267,  // kgCO2/kWh — Natural gas boiler baseline (BEE India PAT)
  },
};

// ============================================
// Lookup Functions
// ============================================

export function getMethodologyDefinition(id: string): MethodologyDefinition {
  const methodology = methodologies[id];
  if (!methodology) {
    throw new Error(`Unknown methodology: ${id}. Available: ${Object.keys(methodologies).join(", ")}`);
  }
  return methodology;
}

/**
 * Auto-detect the best methodology for a given asset type.
 * Used by pilot service to avoid hardcoding methodology IDs.
 */
export function getMethodologyForAsset(assetType: string): MethodologyDefinition {
  const normalized = assetType.trim().toUpperCase();

  const assetToMethodology: Record<string, string> = {
    "ROOFTOP_SOLAR": "IN-ROOFTOP-SOLAR-V1",
    "SOLAR": "IN-ROOFTOP-SOLAR-V1",
    "WIND": "IN-WIND-V1",
    "WIND_FARM": "IN-WIND-V1",
    "SMALL_HYDRO": "IN-SMALL-HYDRO-V1",
    "HYDRO": "IN-SMALL-HYDRO-V1",
    "MINI_HYDRO": "IN-SMALL-HYDRO-V1",
    "BIOMASS": "IN-BIOMASS-V1",
    "BIOMASS_POWER": "IN-BIOMASS-V1",
    "BIOGAS": "IN-BIOGAS-V1",
    "METHANE_CAPTURE": "IN-BIOGAS-V1",
    "THERMAL_EFFICIENCY": "IN-THERMAL-EFFICIENCY-V1",
    "INDUSTRIAL_EFFICIENCY": "IN-THERMAL-EFFICIENCY-V1",
    "BOILER": "IN-THERMAL-EFFICIENCY-V1",
  };

  const methodologyId = assetToMethodology[normalized];
  if (!methodologyId) {
    throw new Error(
      `No methodology found for asset type "${assetType}". Supported: ${Object.keys(assetToMethodology).join(", ")}`
    );
  }

  return getMethodologyDefinition(methodologyId);
}

export function listMethodologies(): MethodologyDefinition[] {
  return Object.values(methodologies);
}

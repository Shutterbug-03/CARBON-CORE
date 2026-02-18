/**
 * Carbon Credit Calculator Engine
 * Based on Verra VCS and CDM methodologies
 * Formula: Credits = Energy_MWh × Grid_Emission_Factor
 */

// Grid Emission Factors (tCO2e/MWh) - Source: CEA India 2023
const GRID_EMISSION_FACTORS: Record<string, number> = {
    'India-North': 0.716,
    'India-South': 0.682,
    'India-East': 0.821,
    'India-West': 0.698,
    'India-Northeast': 0.642,
    'India-National': 0.716, // Average
};

export interface CarbonCalculationInput {
    energyKWh: number;
    gridRegion: string;
    assetType: 'Solar' | 'Wind' | 'Biogas' | 'Efficiency' | 'Other';
    projectStartDate: string;
    verified?: boolean;
}

export interface CarbonCalculationResult {
    baselineEmissions: number; // tCO2e
    projectEmissions: number; // tCO2e (usually 0 for renewables)
    netReduction: number; // tCO2e
    credits: number; // Verified Carbon Units (VCUs)
    methodology: string;
    gridEmissionFactor: number;
    energyMWh: number;
    calculatedAt: string;
}

export class CarbonCalculator {
    /**
     * Calculate carbon credits using Verra/CDM methodology
     * @param input - Calculation parameters
     * @returns Detailed carbon credit calculation
     */
    calculate(input: CarbonCalculationInput): CarbonCalculationResult {
        const { energyKWh, gridRegion, assetType } = input;

        // Convert kWh to MWh
        const energyMWh = energyKWh / 1000;

        // Get grid emission factor
        const gridEmissionFactor = GRID_EMISSION_FACTORS[gridRegion] ||
            GRID_EMISSION_FACTORS['India-National'];

        // Calculate baseline emissions (what would have been emitted from grid)
        const baselineEmissions = energyMWh * gridEmissionFactor;

        // Project emissions (renewable = 0, efficiency projects may have some)
        const projectEmissions = assetType === 'Efficiency' ? baselineEmissions * 0.15 : 0;

        // Net reduction
        const netReduction = baselineEmissions - projectEmissions;

        // 1 VCU = 1 tCO2e
        const credits = netReduction;

        return {
            baselineEmissions: this.round(baselineEmissions, 3),
            projectEmissions: this.round(projectEmissions, 3),
            netReduction: this.round(netReduction, 3),
            credits: this.round(credits, 3),
            methodology: this.getMethodology(assetType),
            gridEmissionFactor,
            energyMWh: this.round(energyMWh, 3),
            calculatedAt: new Date().toISOString()
        };
    }

    /**
     * Get applicable Verra/CDM methodology
     */
    private getMethodology(assetType: string): string {
        const methodologies: Record<string, string> = {
            'Solar': 'ACM0002 v19 - Grid-connected renewable electricity generation',
            'Wind': 'ACM0002 v19 - Grid-connected renewable electricity generation',
            'Biogas': 'AMS-I.D v18 - Grid connected renewable electricity generation',
            'Efficiency': 'AMS-II.J v6 - Demand-side energy efficiency',
            'Other': 'ACM0002 v19 - Grid-connected renewable electricity generation'
        };
        return methodologies[assetType] || methodologies['Other'];
    }

    /**
     * Validate if project is eligible for carbon credits
     */
    validateEligibility(input: CarbonCalculationInput): {
        eligible: boolean;
        reasons: string[];
    } {
        const reasons: string[] = [];

        // Minimum threshold: 1 tCO2e
        const result = this.calculate(input);
        if (result.netReduction < 1) {
            reasons.push('Project must reduce at least 1 tCO2e to be eligible');
        }

        // Additionality check (simplified)
        const projectAge = this.getProjectAgeYears(input.projectStartDate);
        if (projectAge > 10) {
            reasons.push('Project must be less than 10 years old for retroactive crediting');
        }

        return {
            eligible: reasons.length === 0,
            reasons
        };
    }

    /**
     * Calculate project age in years
     */
    private getProjectAgeYears(startDate: string): number {
        const start = new Date(startDate);
        const now = new Date();
        return (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    }

    /**
     * Round to specified decimal places
     */
    private round(value: number, decimals: number): number {
        return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    /**
     * Get available grid regions
     */
    static getAvailableRegions(): string[] {
        return Object.keys(GRID_EMISSION_FACTORS);
    }
}

export const carbonCalculator = new CarbonCalculator();

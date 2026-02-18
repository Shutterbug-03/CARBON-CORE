
export interface SolarData {
    latitude: number;
    longitude: number;
    current: {
        ghi: number; // Global Horizontal Irradiance (W/m²)
        dni: number; // Direct Normal Irradiance (W/m²)
    };
    daily: {
        energy_kWh_per_m2: number; // Daily Sum
    };
}

// Fixed Grid Emission Factor for India (approx 0.71 kgCO2/kWh)
const GRID_EMISSION_FACTOR = 0.71;

export const fetchSolarData = async (lat: number, lon: number): Promise<SolarData | null> => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=shortwave_radiation,direct_normal_irradiance&daily=shortwave_radiation_sum&timezone=auto&forecast_days=1`
        );
        const data = await response.json();

        return {
            latitude: lat,
            longitude: lon,
            current: {
                ghi: data.current.shortwave_radiation,
                dni: data.current.direct_normal_irradiance,
            },
            daily: {
                energy_kWh_per_m2: data.daily.shortwave_radiation_sum[0] / 3.6, // MJ/m² to kWh/m²
            },
        };
    } catch (error) {
        console.warn("Failed to fetch solar data:", error);
        return null;
    }
};

export const calculateCarbonOffset = (
    solarData: SolarData,
    capacityMW: number, // Plant Capacity
    areaM2: number, // Effective Panel Area
    efficiency: number = 0.20 // Panel Efficiency (20%)
) => {
    if (!solarData) return { dailyGenerationkWh: 0, carbonOffsetTons: 0 };

    // Daily Energy Generation (kWh) = Irradiance (kWh/m²) * Area * Efficiency
    // Note: MJ/m2 to kWh conversion is roughly / 3.6
    // Open-Meteo daily sum is in MJ/m².

    const dailyGenerationkWh = solarData.daily.energy_kWh_per_m2 * areaM2 * efficiency;
    const carbonOffsetTons = (dailyGenerationkWh * GRID_EMISSION_FACTOR) / 1000;

    return {
        dailyGenerationkWh: Math.round(dailyGenerationkWh),
        carbonOffsetTons: parseFloat(carbonOffsetTons.toFixed(4))
    };
};

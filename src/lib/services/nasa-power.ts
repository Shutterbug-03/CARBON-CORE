/**
 * NASA POWER API Service
 * Free tier: Unlimited requests (rate limited to reasonable use)
 * Provides solar irradiance data for verification
 */

interface NASAPowerResponse {
    properties: {
        parameter: {
            ALLSKY_SFC_SW_DWN: Record<string, number>;
        };
    };
}

interface SolarData {
    date: string;
    irradiance: number; // kWh/m²/day
    source: 'NASA POWER';
}

export class NASAPowerService {
    private baseUrl = 'https://power.larc.nasa.gov/api/temporal/daily/point';

    /**
     * Fetch solar irradiance data for a location
     * @param latitude - Latitude (-90 to 90)
     * @param longitude - Longitude (-180 to 180)
     * @param startDate - YYYYMMDD format
     * @param endDate - YYYYMMDD format
     * @returns Array of daily solar irradiance values
     */
    async getSolarIrradiance(
        latitude: number,
        longitude: number,
        startDate: string,
        endDate: string
    ): Promise<SolarData[]> {
        const params = new URLSearchParams({
            parameters: 'ALLSKY_SFC_SW_DWN',
            community: 'RE',
            longitude: longitude.toString(),
            latitude: latitude.toString(),
            start: startDate,
            end: endDate,
            format: 'JSON'
        });

        try {
            const response = await fetch(`${this.baseUrl}?${params}`);

            if (!response.ok) {
                throw new Error(`NASA POWER API error: ${response.statusText}`);
            }

            const data: NASAPowerResponse = await response.json();
            const irradianceData = data.properties.parameter.ALLSKY_SFC_SW_DWN;

            return Object.entries(irradianceData).map(([date, value]) => ({
                date,
                irradiance: value,
                source: 'NASA POWER'
            }));
        } catch (error) {
            console.error('NASA POWER API Error:', error);
            throw new Error('Failed to fetch satellite data');
        }
    }

    /**
     * Calculate maximum possible energy generation
     * @param irradiance - Daily irradiance (kWh/m²/day)
     * @param panelArea - Solar panel area in m²
     * @param efficiency - Panel efficiency (0-1, typically 0.15-0.22)
     * @returns Maximum energy in kWh
     */
    calculateMaxGeneration(
        irradiance: number,
        panelArea: number,
        efficiency: number = 0.18
    ): number {
        return irradiance * panelArea * efficiency;
    }

    /**
     * Verify if claimed generation is physically possible
     * @param claimedKWh - User's claimed generation
     * @param latitude - Location latitude
     * @param longitude - Location longitude
     * @param date - Generation date (YYYYMMDD)
     * @param panelArea - Panel area in m²
     * @param efficiency - Panel efficiency
     * @returns Verification result
     */
    async verifyGeneration(
        claimedKWh: number,
        latitude: number,
        longitude: number,
        date: string,
        panelArea: number,
        efficiency: number = 0.18
    ): Promise<{
        verified: boolean;
        maxPossible: number;
        claimed: number;
        confidence: number;
        source: string;
    }> {
        const solarData = await this.getSolarIrradiance(
            latitude,
            longitude,
            date,
            date
        );

        if (solarData.length === 0) {
            throw new Error('No satellite data available for this date');
        }

        const maxPossible = this.calculateMaxGeneration(
            solarData[0].irradiance,
            panelArea,
            efficiency
        );

        // Allow 10% margin for measurement variance
        const threshold = maxPossible * 1.1;
        const verified = claimedKWh <= threshold;
        const confidence = verified ? Math.min((maxPossible / claimedKWh) * 100, 100) : 0;

        return {
            verified,
            maxPossible,
            claimed: claimedKWh,
            confidence: Math.round(confidence),
            source: 'NASA POWER Satellite'
        };
    }
}

export const nasaPowerService = new NASAPowerService();

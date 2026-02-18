/**
 * KYC Sandbox Service
 * High-fidelity simulation of Aadhaar verification APIs
 * Mimics structure of real providers (Perfios/SurePass) for easy production migration
 */

interface AadhaarVerificationRequest {
    aadhaarNumber: string; // 12-digit number (will be masked)
    name: string;
    otp?: string; // For OTP-based verification
}

interface AadhaarVerificationResponse {
    success: boolean;
    verified: boolean;
    verificationId: string;
    timestamp: string;
    data?: {
        name: string;
        ageRange: string; // e.g., "25-30"
        gender: 'M' | 'F' | 'O';
        state: string;
        maskedAadhaar: string; // XXXX-XXXX-1234
    };
    error?: string;
}

export class KYCSandboxService {
    /**
     * Simulate Aadhaar OTP generation
     * In production, this would call UIDAI/AUA
     */
    async generateOTP(aadhaarNumber: string): Promise<{
        success: boolean;
        transactionId: string;
        message: string;
    }> {
        // Validate Aadhaar format
        if (!this.validateAadhaarFormat(aadhaarNumber)) {
            return {
                success: false,
                transactionId: '',
                message: 'Invalid Aadhaar number format'
            };
        }

        // Simulate API delay
        await this.delay(500);

        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

        return {
            success: true,
            transactionId,
            message: 'OTP sent successfully to registered mobile'
        };
    }

    /**
     * Simulate Aadhaar verification with OTP
     * In production, this would call licensed AUA/KUA
     */
    async verifyWithOTP(
        request: AadhaarVerificationRequest,
        transactionId: string
    ): Promise<AadhaarVerificationResponse> {
        // Simulate API delay
        await this.delay(800);

        // Validate inputs
        if (!this.validateAadhaarFormat(request.aadhaarNumber)) {
            return {
                success: false,
                verified: false,
                verificationId: '',
                timestamp: new Date().toISOString(),
                error: 'Invalid Aadhaar format'
            };
        }

        // Simulate OTP validation (in sandbox, any 6-digit OTP works)
        if (!request.otp || request.otp.length !== 6) {
            return {
                success: false,
                verified: false,
                verificationId: '',
                timestamp: new Date().toISOString(),
                error: 'Invalid OTP'
            };
        }

        // Generate mock verified data
        const verificationId = `VER${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
        const maskedAadhaar = this.maskAadhaar(request.aadhaarNumber);

        return {
            success: true,
            verified: true,
            verificationId,
            timestamp: new Date().toISOString(),
            data: {
                name: request.name,
                ageRange: this.generateAgeRange(),
                gender: this.generateGender(),
                state: this.generateState(),
                maskedAadhaar
            }
        };
    }

    /**
     * Demographic authentication (name + Aadhaar)
     * Lower security than OTP, but faster
     */
    async verifyDemographic(
        request: AadhaarVerificationRequest
    ): Promise<AadhaarVerificationResponse> {
        await this.delay(600);

        if (!this.validateAadhaarFormat(request.aadhaarNumber)) {
            return {
                success: false,
                verified: false,
                verificationId: '',
                timestamp: new Date().toISOString(),
                error: 'Invalid Aadhaar format'
            };
        }

        // Simulate name matching (in sandbox, always succeeds if name is provided)
        if (!request.name || request.name.length < 3) {
            return {
                success: false,
                verified: false,
                verificationId: '',
                timestamp: new Date().toISOString(),
                error: 'Name is required for demographic verification'
            };
        }

        const verificationId = `DEM${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
        const maskedAadhaar = this.maskAadhaar(request.aadhaarNumber);

        return {
            success: true,
            verified: true,
            verificationId,
            timestamp: new Date().toISOString(),
            data: {
                name: request.name,
                ageRange: this.generateAgeRange(),
                gender: this.generateGender(),
                state: this.generateState(),
                maskedAadhaar
            }
        };
    }

    // Helper methods

    private validateAadhaarFormat(aadhaar: string): boolean {
        // Remove spaces and hyphens
        const cleaned = aadhaar.replace(/[\s-]/g, '');
        // Must be exactly 12 digits
        return /^\d{12}$/.test(cleaned);
    }

    private maskAadhaar(aadhaar: string): string {
        const cleaned = aadhaar.replace(/[\s-]/g, '');
        return `XXXX-XXXX-${cleaned.slice(-4)}`;
    }

    private generateAgeRange(): string {
        const ranges = ['18-25', '25-30', '30-35', '35-40', '40-50', '50-60', '60+'];
        return ranges[Math.floor(Math.random() * ranges.length)];
    }

    private generateGender(): 'M' | 'F' | 'O' {
        const genders: ('M' | 'F' | 'O')[] = ['M', 'F'];
        return genders[Math.floor(Math.random() * genders.length)];
    }

    private generateState(): string {
        const states = [
            'Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu',
            'Delhi', 'Rajasthan', 'Punjab', 'Kerala'
        ];
        return states[Math.floor(Math.random() * states.length)];
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const kycSandbox = new KYCSandboxService();

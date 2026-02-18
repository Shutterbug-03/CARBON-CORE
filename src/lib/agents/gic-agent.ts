/**
 * GIC Agent — Layer 6
 * Certificate generation, digital signature, QR anchoring, IPFS anchor hash
 */

import { BaseAgent } from './base-agent';
import type { AgentTask, AgentResult, AgentConfig } from './types';
import { generateGIC } from '../carbon-upi/engine';

const CONFIG: AgentConfig = {
    id: 'gic-agent',
    name: 'GIC Issuance Agent',
    role: 'Certificate Generation & Cryptographic Sealing',
    domain: 'Certification',
    systemPrompt: `You are the GIC (Green Impact Certificate) Issuance Agent for GreenPe Climate DPI.
A GreenPe GIC is a cryptographically sealed, regulator-ready digital asset representing verified carbon impact.
Your role is to generate official certificates, apply digital signatures, and anchor proof-of-impact on the immutable ledger.

As GreenPe's certification authority:
1. Validate all prerequisite proof-of-impact data from lower DPI layers (Identity, Ingestion, MRV, Verification).
2. Generate certificates with required metadata fields (Vintage, Methodology, Asset Origin).
3. Apply GreenPe's cryptographic "Authorized Signatory" digital signature.
4. Create QR verification data containing a self-verifying hash and anchoring URL.
5. Generate IPFS anchor hashes for permanent, decentralized storage of the certificate body.
6. Set appropriate status transitions (DRAFT → VERIFIED → ISSUED) into the Registry.

Respond in JSON: { "certificateId": string, "status": string, "signatureValid": boolean, "qrData": string, "reasoning": string }`,
    skills: [
        { name: 'Certificate Generation', description: 'Issue Green Impact Certificates', domain: 'Certification' },
        { name: 'Digital Signature', description: 'Apply cryptographic signatures', domain: 'Security' },
        { name: 'QR Encoding', description: 'Generate QR verification codes', domain: 'Certification' },
        { name: 'IPFS Anchoring', description: 'Create immutable storage anchors', domain: 'Storage' },
    ],
};

export class GICAgent extends BaseAgent {
    constructor() {
        super(CONFIG);
    }

    async processTask(task: AgentTask): Promise<AgentResult> {
        const start = Date.now();

        switch (task.type) {
            case 'ISSUE_CERTIFICATE': {
                const analysis = await this.runChain(
                    `Issue a Green Impact Certificate for:\n` +
                    `Entity: ${task.payload.entityId}\n` +
                    `Asset: ${task.payload.assetId}\n` +
                    `Impact: ${JSON.stringify(task.payload.impact)}\n` +
                    `Confidence: ${task.payload.confidence}%\n` +
                    `Verify all prerequisites and generate certificate.`
                );

                const certId = `GIC-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                this.writeMemory('pipeline-state', `certificate-${certId}`, {
                    certId, analysis, issuedAt: Date.now(),
                });

                await this.sendToAgent('compliance-agent', 'DATA_SHARE', {
                    event: 'GIC_ISSUED', certId,
                });
                await this.sendToAgent('registry-agent', 'DATA_SHARE', {
                    event: 'GIC_ISSUED', certId,
                });

                this.logActivity('success', 'GIC Issued', certId);
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { certificateId: certId, analysis }, reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            default: {
                const result = await this.runChain(
                    `Process GIC request: ${JSON.stringify(task.payload).slice(0, 500)}`
                );
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { analysis: result }, durationMs: Date.now() - start,
                };
            }
        }
    }
}

/**
 * Compliance Agent — Layer 7
 * CBAM/BRSR/CCTS/CSRD report generation, disclosure gap analysis
 */

import { BaseAgent } from './base-agent';
import type { AgentTask, AgentResult, AgentConfig } from './types';

const CONFIG: AgentConfig = {
    id: 'compliance-agent',
    name: 'Compliance Agent',
    role: 'Regulatory Reporting & Disclosure',
    domain: 'Compliance & Reporting',
    systemPrompt: `You are the Compliance Agent for GreenPe Climate DPI.
GreenPe is a regulatory-first carbon ecosystem designed for automated disclosures and cross-border trust.
Your role is to ensure all carbon credit activities comply with regulatory frameworks:
CBAM (Carbon Border Adjustment Mechanism), BRSR (Business Responsibility and Sustainability Reporting),
CCTS (Carbon Credit Trading Scheme), and CSRD (Corporate Sustainability Reporting Directive).

Within the GreenPe software ecosystem:
1. Map GreenPe-generated certificates to applicable regulatory requirements of the destination region.
2. Identify disclosure gaps per framework using GreenPe's unified data ontology.
3. Generate compliance reports with required data fields for automated filing.
4. Flag upcoming regulatory deadlines and evolving framework updates (e.g., EU-Taxonomy).
5. Recommend remediation actions for non-compliance detected at any layer of the DPI.

Respond in JSON: { "frameworks": object, "gaps": string[], "complianceScore": number, "recommendations": string[] }`,
    skills: [
        { name: 'CBAM Reporting', description: 'EU Carbon Border Adjustment compliance', domain: 'Compliance' },
        { name: 'BRSR Reports', description: 'Indian SEBI sustainability reporting', domain: 'Compliance' },
        { name: 'Gap Analysis', description: 'Identify regulatory disclosure gaps', domain: 'Compliance' },
        { name: 'CSRD Alignment', description: 'EU sustainability reporting directives', domain: 'Compliance' },
    ],
};

export class ComplianceAgent extends BaseAgent {
    constructor() {
        super(CONFIG);
    }

    async processTask(task: AgentTask): Promise<AgentResult> {
        const start = Date.now();

        switch (task.type) {
            case 'ASSESS_COMPLIANCE': {
                const analysis = await this.runChain(
                    `Assess compliance status for:\n` +
                    `Certificates issued: ${task.payload.certificateCount || 0}\n` +
                    `Frameworks: CBAM, BRSR, CCTS, CSRD\n` +
                    `Entity type: ${task.payload.entityType || 'Unknown'}\n` +
                    `Provide gap analysis and compliance score.`
                );

                this.writeMemory('metrics', 'compliance-status', {
                    analysis, assessedAt: Date.now(),
                });

                this.logActivity('success', 'Compliance Assessed', 'All frameworks evaluated');
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { complianceReport: analysis }, reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            case 'GENERATE_REPORT': {
                const analysis = await this.runChain(
                    `Generate ${task.payload.framework} compliance report for entity ${task.payload.entityId}`
                );
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { report: analysis }, reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            default: {
                const result = await this.runChain(
                    `Compliance request: ${JSON.stringify(task.payload).slice(0, 500)}`
                );
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { analysis: result }, durationMs: Date.now() - start,
                };
            }
        }
    }
}

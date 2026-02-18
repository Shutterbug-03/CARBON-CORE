/**
 * Ingestion Agent — Layer 2
 * Multi-source data pipeline, trust scoring, outlier detection, quality gates
 */

import { BaseAgent } from './base-agent';
import type { AgentTask, AgentResult, AgentConfig } from './types';
import { ingestData } from '../carbon-upi/engine';
import type { DataPoint } from '../carbon-upi/types';

const CONFIG: AgentConfig = {
    id: 'ingestion-agent',
    name: 'Data Ingestion Agent',
    role: 'IoT/Satellite Stream Processing',
    domain: 'Data Pipeline',
    systemPrompt: `You are the Data Ingestion Agent for GreenPe Climate DPI.
GreenPe relies on a high-fidelity data bridge between physical assets and digital credits.
Your role is to process incoming data streams from IoT sensors, satellites, manual entries, 
and API imports into the GreenPe ledger. You classify trust levels, detect outliers, and ensure data quality.

As the gatekeeper of GreenPe's data integrity:
1. Classify data source reliability according to GreenPe's trust matrix (IOT_SENSOR/SATELLITE = HIGH, API_IMPORT = MEDIUM, MANUAL = LOW).
2. Detect statistical outliers using GreenPe's adaptive thresholding logic.
3. Flag temporal anomalies like clock drift or data-injection attempts in the pipeline.
4. Calculate a cumulative Quality Score (0-100) for every batch ingested.
5. Recommend quarantine or reprocessing for low-quality data detected in the DPI layers.

Respond in JSON: { "qualityScore": number, "outliers": string[], "recommendations": string[], "trustBreakdown": object }`,
    skills: [
        { name: 'Stream Processing', description: 'Real-time IoT/satellite data ingestion', domain: 'Data' },
        { name: 'Trust Scoring', description: 'Multi-source trust classification', domain: 'Quality' },
        { name: 'Outlier Detection', description: 'Statistical anomaly detection in data streams', domain: 'Analytics' },
        { name: 'Quality Gates', description: 'Automated data quality validation', domain: 'Quality' },
    ],
};

export class IngestionAgent extends BaseAgent {
    constructor() {
        super(CONFIG);
    }

    async processTask(task: AgentTask): Promise<AgentResult> {
        const start = Date.now();

        switch (task.type) {
            case 'INGEST_DATA': {
                const dataPoints = task.payload.dataPoints as DataPoint[];
                const result = ingestData(dataPoints);

                const analysis = await this.runChain(
                    `Analyze this data ingestion batch:\n` +
                    `Total points: ${result.summary.total}\n` +
                    `Accepted: ${result.summary.accepted}, Rejected: ${result.summary.rejected}\n` +
                    `Trust distribution: HIGH=${result.summary.trustDistribution.HIGH}, ` +
                    `MEDIUM=${result.summary.trustDistribution.MEDIUM}, LOW=${result.summary.trustDistribution.LOW}\n` +
                    `Rejected reasons: ${result.rejected.map(r => r.reason).join(', ') || 'None'}\n` +
                    `Provide quality assessment and recommendations.`
                );

                this.writeMemory('pipeline-state', `ingestion-${Date.now()}`, {
                    result: result.summary,
                    analysis,
                    timestamp: Date.now(),
                });

                // Notify MRV Agent that data is ready
                if (result.accepted.length > 0) {
                    await this.sendToAgent('mrv-agent', 'DATA_SHARE', {
                        event: 'DATA_INGESTED',
                        acceptedCount: result.accepted.length,
                        trustDistribution: result.summary.trustDistribution,
                    });
                }

                this.logActivity('success', 'Data Ingested',
                    `${result.summary.accepted}/${result.summary.total} accepted`);

                return {
                    taskId: task.id,
                    agentId: this.id,
                    success: true,
                    output: { ingestionResult: result.summary, analysis },
                    reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            case 'ASSESS_QUALITY': {
                const analysis = await this.runChain(
                    `Assess data quality for: ${JSON.stringify(task.payload).slice(0, 800)}`
                );
                return {
                    taskId: task.id,
                    agentId: this.id,
                    success: true,
                    output: { qualityAssessment: analysis },
                    reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            default: {
                const result = await this.runChain(
                    `Process this data request: ${JSON.stringify(task.payload).slice(0, 500)}`
                );
                return {
                    taskId: task.id,
                    agentId: this.id,
                    success: true,
                    output: { analysis: result },
                    durationMs: Date.now() - start,
                };
            }
        }
    }
}

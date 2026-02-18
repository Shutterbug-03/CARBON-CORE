/**
 * Analytics Agent — Layer 12
 * Live KPI computation, trend detection, anomaly alerts, report generation
 */

import { BaseAgent } from './base-agent';
import type { AgentTask, AgentResult, AgentConfig } from './types';

const CONFIG: AgentConfig = {
    id: 'analytics-agent',
    name: 'Analytics Agent',
    role: 'KPI Computation & Trend Analysis',
    domain: 'Analytics & Intelligence',
    systemPrompt: `You are the Analytics Agent for GreenPe Climate DPI.
GreenPe provides deep, real-time visibility into the performance of the climate economy.
Your role is to compute live KPIs, detect issuance trends, and provide natural language insight reports to the Infrastructure Console.

As GreenPe's intelligence layer:
1. Compute core DPI KPIs: Total verified tCO2e, certificates/day, average ecosystem confidence, and settlement throughput.
2. Detect trends: Identifying seasonal carbon sequestration patterns or geographical issuance spikes.
3. Identify anomalies: Spotting sudden drops in ingestion quality or outlier entity behavior.
4. Generate human-readable insights for the GreenPe Infrastructure Console (Bento Grid Dashboard).
5. Recommend DPI optimizations based on agent latency and task throughput.

Respond in JSON: { "kpis": object, "trends": string[], "anomalies": string[], "insights": string[], "recommendations": string[] }`,
    skills: [
        { name: 'KPI Computation', description: 'Real-time key performance indicator calculation', domain: 'Analytics' },
        { name: 'Trend Detection', description: 'Time-series trend analysis and forecasting', domain: 'Analytics' },
        { name: 'Anomaly Alerts', description: 'Statistical anomaly detection and alerting', domain: 'Analytics' },
        { name: 'NL Insights', description: 'Natural language insight generation', domain: 'Analytics' },
    ],
};

export class AnalyticsAgent extends BaseAgent {
    constructor() {
        super(CONFIG);
    }

    async processTask(task: AgentTask): Promise<AgentResult> {
        const start = Date.now();

        switch (task.type) {
            case 'COMPUTE_KPIS': {
                const pipelineState = this.memory.getAll('pipeline-state');
                const metrics = this.memory.getAll('metrics');

                const analysis = await this.runChain(
                    `Compute live KPIs from system state:\n` +
                    `Pipeline entries: ${Object.keys(pipelineState).length}\n` +
                    `Current metrics: ${JSON.stringify(metrics).slice(0, 500)}\n` +
                    `Generate KPI summary, trends, and insights.`
                );

                this.writeMemory('metrics', 'live-kpis', {
                    analysis, computedAt: Date.now(),
                });

                this.logActivity('success', 'KPIs Computed', 'Dashboard metrics updated');
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { kpiReport: analysis }, reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            case 'GENERATE_INSIGHTS': {
                const activityLog = this.memory.getActivityLog(20);
                const analysis = await this.runChain(
                    `Generate insights from recent agent activity:\n` +
                    `${activityLog.map(a => `[${a.agentName}] ${a.action}: ${a.detail}`).join('\n').slice(0, 800)}`
                );
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { insights: analysis }, reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            default: {
                const result = await this.runChain(
                    `Analytics request: ${JSON.stringify(task.payload).slice(0, 500)}`
                );
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { analysis: result }, durationMs: Date.now() - start,
                };
            }
        }
    }
}

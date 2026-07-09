import { PilotConsole } from "@/components/pilot/pilot-console";

export default function DashboardOverview() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
          Beckn-ready Carbon UPI pilot
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          GreenPe verification rail for India rooftop solar
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          This dashboard is intentionally narrow: one clean vertical flow from CDIF ingestion to deterministic MRV,
          GIC issuance, public verification, and Beckn provider status.
        </p>
      </div>
      <PilotConsole />
    </div>
  );
}

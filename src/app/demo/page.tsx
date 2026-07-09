import { PilotConsole } from "@/components/pilot/pilot-console";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-3xl font-semibold text-slate-950">GreenPe pilot demo</h1>
          <p className="mt-1 text-slate-600">
            Use the same pilot console outside the dashboard shell for fast file ingestion and Beckn-provider demos.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <PilotConsole />
      </div>
    </div>
  );
}

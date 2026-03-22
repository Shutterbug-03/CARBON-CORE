import { CarbonCalculatorWizard } from "@/components/carbon-calculator-wizard";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-black text-slate-900">
            Carbon Certificate Generator
          </h1>
          <p className="text-slate-600 mt-1">
            Upload data → AI calculates carbon impact → Generate verified certificate
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <CarbonCalculatorWizard />
      </div>
    </div>
  );
}

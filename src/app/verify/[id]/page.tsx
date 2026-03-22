import { Shield, CheckCircle2, Calendar, Building2 } from "lucide-react";

// This would come from database in production
function getCertificateData(id: string) {
  // Simulated data - replace with database query
  return {
    id,
    valid: true,
    entityName: "Sample Entity",
    carbonImpact: 12.5,
    issuedAt: new Date().toISOString(),
    status: "VERIFIED",
    verificationHash: "0x" + id.split("").reverse().join(""),
  };
}

export default function VerifyPage({ params }: { params: { id: string } }) {
  const cert = getCertificateData(params.id);

  if (!cert.valid) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mt-4 text-slate-900">
            Certificate Not Found
          </h1>
          <p className="text-slate-600 mt-2">
            The certificate ID <code className="bg-slate-100 px-2 py-1 rounded">{params.id}</code> could not be verified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm">
            <CheckCircle2 size={20} />
            VERIFIED CERTIFICATE
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-8 text-white">
            <h1 className="text-3xl font-black tracking-tight">
              Carbon Credit Certificate
            </h1>
            <p className="text-emerald-100 mt-2 text-sm">
              ISO 14064-3 Verified Carbon Offset
            </p>
          </div>

          {/* Certificate Details */}
          <div className="p-8 space-y-6">
            {/* Certificate ID */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Certificate ID
              </label>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900">
                {cert.id}
              </div>
            </div>

            {/* Entity */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Issued To
              </label>
              <div className="mt-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    {cert.entityName}
                  </div>
                  <div className="text-sm text-slate-500">Verified Entity</div>
                </div>
              </div>
            </div>

            {/* Carbon Impact */}
            <div className="bg-emerald-50 rounded-xl p-6">
              <label className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Carbon Impact
              </label>
              <div className="mt-2 text-4xl font-black text-emerald-600">
                {cert.carbonImpact} <span className="text-2xl">tCO2e</span>
              </div>
              <div className="text-sm text-emerald-600 mt-1">
                Tonnes of CO2 Equivalent
              </div>
            </div>

            {/* Issued Date */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Issued On
              </label>
              <div className="mt-2 flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">
                  {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Verification Hash */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Verification Hash
              </label>
              <div className="mt-1 font-mono text-xs bg-slate-100 p-3 rounded break-all text-slate-700">
                {cert.verificationHash}
              </div>
            </div>

            {/* Status Badge */}
            <div className="pt-4 border-t border-slate-200">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
                <CheckCircle2 size={16} />
                {cert.status}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-6 text-center border-t border-slate-200">
            <p className="text-xs text-slate-600">
              This certificate is digitally verified and complies with ISO 14064-3 standards.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              For inquiries, contact{" "}
              <a href="mailto:verify@carbonupi.com" className="text-emerald-600 hover:underline">
                verify@carbonupi.com
              </a>
            </p>
          </div>
        </div>

        {/* Powered By */}
        <div className="text-center mt-8 text-sm text-slate-600">
          Powered by <span className="font-bold">CARBON UPI</span> Platform
        </div>
      </div>
    </div>
  );
}

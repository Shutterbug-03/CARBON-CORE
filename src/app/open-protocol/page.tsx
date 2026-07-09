import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carbon UPI — Open Protocol Specification',
  description:
    'Carbon UPI is India\'s open Digital Public Infrastructure for climate action verification. ' +
    'A 7-layer protocol stack: CIH identity binding, CDIF data ingestion, deterministic MRV, ' +
    'GIC issuance, registry interoperability, and public transparency.',
  openGraph: {
    title: 'Carbon UPI — Open Protocol Specification',
    description: 'The verification rail underneath India\'s climate commerce.',
    type: 'website',
  },
};

export default function OpenProtocolPage() {
  const methodologies = [
    {
      id: 'METH-SOLAR-001',
      name: 'Grid-Connected Solar Energy Generation',
      sector: 'Energy',
      formula: 'tCO2e = (kWh × 0.698 kgCO2/kWh ÷ 1000) × 0.95 CAF',
      authority: 'CEA India CO₂ Baseline Database v19.0 | AMS-I.D UNFCCC CDM v18',
      ef: '0.698',
      efUnit: 'kgCO₂/kWh',
      impactType: 'AVOIDED',
      emoji: '☀️',
    },
    {
      id: 'METH-WIND-001',
      name: 'Grid-Connected Wind Energy Generation',
      sector: 'Energy',
      formula: 'tCO2e = (kWh × 0.716 kgCO2/kWh ÷ 1000) × 0.95 CAF',
      authority: 'CEA India v19.0 | ACM0002 Verra VCS v19',
      ef: '0.716',
      efUnit: 'kgCO₂/kWh',
      impactType: 'AVOIDED',
      emoji: '🌬️',
    },
    {
      id: 'METH-SOIL-001',
      name: 'Soil Carbon Sequestration',
      sector: 'Agriculture',
      formula: 'tCO2e = Δsoc (tC/ha) × 3.67 × 0.90 CAF',
      authority: 'IPCC AR6 | India GHG Program | VM0042 Verra',
      ef: '3.67',
      efUnit: 'tCO₂ per tC',
      impactType: 'REMOVED',
      emoji: '🌱',
    },
    {
      id: 'METH-BIOGAS-001',
      name: 'Biogas / Methane Capture',
      sector: 'Waste',
      formula: 'tCO2e = tCH₄ × 27.9 (GWP-100) × 0.99 oxidation × 0.95 CAF',
      authority: 'IPCC AR6 GWP-100 | AMS-III.D UNFCCC CDM',
      ef: '27.9',
      efUnit: 'CO₂e per tCH₄ (GWP-100)',
      impactType: 'AVOIDED',
      emoji: '♻️',
    },
    {
      id: 'METH-EV-001',
      name: 'EV Fleet — Avoided Tailpipe Emissions',
      sector: 'Transportation',
      formula: 'tCO2e = km × (0.192 − 0.18 kWh/km × 0.716) ÷ 1000 × 0.95',
      authority: 'MoRTH India | CEA India | IPCC AR6',
      ef: '0.192',
      efUnit: 'kgCO₂/km (petrol baseline)',
      impactType: 'AVOIDED',
      emoji: '⚡',
    },
  ];

  const layers = [
    {
      num: 1,
      name: 'CIH — Composite Identity Hash',
      status: 'ACTIVE',
      description: 'SHA-256 binding of verified identity + device + GPS + timestamp. Privacy-preserving — PII never stored.',
      endpoint: 'POST /api/v1/cih/create',
      color: '#00f5d4',
    },
    {
      num: 2,
      name: 'CDIF — Climate Data Ingestion',
      status: 'ACTIVE',
      description: '8-field schema for standardized climate activity data. Trust levels: HIGH (IoT/satellite), MEDIUM (SCADA), LOW (manual).',
      endpoint: 'POST /api/v1/cdif/submit',
      color: '#00bbf9',
    },
    {
      num: 3,
      name: 'MRV — Deterministic Verification',
      status: 'ACTIVE',
      description: 'Methodology-specific emission calculation. AI assists anomaly detection — AI does NOT determine emissions.',
      endpoint: 'POST /api/v1/mrv/verify',
      color: '#fee440',
    },
    {
      num: 4,
      name: 'GIC — Green Impact Certificate',
      status: 'ACTIVE',
      description: 'Programmable climate proof artifact. NOT a carbon credit. Consumable by banks, governments, registries, insurers.',
      endpoint: 'POST /api/v1/gic/issue',
      color: '#f15bb5',
    },
    {
      num: 5,
      name: 'Registry Interoperability',
      status: 'PLANNED',
      description: 'Adapters for BEE CCTS, Verra VCS, Gold Standard, CBAM, POSOCO.',
      endpoint: '/api/v1/gic/:id/registry',
      color: '#9b5de5',
    },
    {
      num: 6,
      name: 'Public Transparency Ledger',
      status: 'ACTIVE',
      description: 'Any party can verify any GIC by ID. No authentication required. This is the public trust layer.',
      endpoint: 'GET /api/v1/gic/:id',
      color: '#0ead69',
    },
    {
      num: 7,
      name: 'Governance & Open Protocol',
      status: 'PLANNED',
      description: 'Open protocol committee, methodology approval process, community governance.',
      endpoint: 'carbonupi.org (planned)',
      color: '#e63946',
    },
  ];

  const examples = [
    {
      label: 'Step 1 — Create CIH',
      method: 'POST',
      path: '/api/v1/cih/create',
      body: JSON.stringify({
        identityCredential: '29ABCDE1234F1Z5',
        credentialType: 'GSTIN',
        assetId: 'SOLAR-PANEL-GJ-4421',
        deviceId: 'INV-SOFAR-AA:BB:CC:DD',
        lat: 23.0225,
        lng: 72.5714,
      }, null, 2),
    },
    {
      label: 'Step 2 — Submit CDIF Data',
      method: 'POST',
      path: '/api/v1/cdif/submit',
      body: JSON.stringify({
        cihReference: '<CIH from step 1>',
        packets: [{
          sourceType: 'IOT_SENSOR',
          sourceId: 'INV-SOFAR-AA:BB:CC:DD',
          timestamp: '2026-03-01T12:00:00Z',
          geolocation: { lat: 23.0225, lng: 72.5714 },
          value: 83500,
          unit: 'kWh',
          deviceSignature: '<device-crypto-sig>',
          reportingPeriod: { start: '2026-01-01T00:00:00Z', end: '2026-04-01T00:00:00Z' },
        }],
      }, null, 2),
    },
    {
      label: 'Step 3 — Run MRV',
      method: 'POST',
      path: '/api/v1/mrv/verify',
      body: JSON.stringify({
        cihReference: '<CIH from step 1>',
        methodologyId: 'METH-SOLAR-001',
        dataPoints: ['<accepted packets from step 2>'],
        timeWindow: { start: '2026-01-01T00:00:00Z', end: '2026-04-01T00:00:00Z' },
        gridRegion: 'India-West',
      }, null, 2),
    },
    {
      label: 'Step 4 — Issue GIC',
      method: 'POST',
      path: '/api/v1/gic/issue',
      body: JSON.stringify({
        cihReference: '<CIH>',
        mrvHash: '<mrvHash from step 3>',
        entityId: 'MSME-GJ-001',
        assetId: 'SOLAR-PANEL-GJ-4421',
        methodologyId: 'METH-SOLAR-001',
        impactValue: { amount: 55.37, unit: 'tCO2e', type: 'AVOIDED' },
        confidenceScore: 100,
        timeWindow: { start: '2026-01-01T00:00:00Z', end: '2026-04-01T00:00:00Z' },
      }, null, 2),
    },
  ];

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #0a1628 100%)',
      minHeight: '100vh',
      color: '#e6edf3',
    }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,245,212,0.06) 0%, rgba(0,187,249,0.04) 50%, rgba(15,52,96,0.3) 100%)',
        borderBottom: '1px solid rgba(0,245,212,0.15)',
        padding: '80px 32px 60px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(0,245,212,0.1)',
          border: '1px solid rgba(0,245,212,0.3)',
          borderRadius: '100px',
          padding: '6px 18px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#00f5d4',
          letterSpacing: '0.08em',
          marginBottom: '24px',
        }}>
          OPEN PROTOCOL SPECIFICATION v1.0
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.1,
          margin: '0 0 24px',
          background: 'linear-gradient(135deg, #e6edf3 0%, #00f5d4 60%, #00bbf9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Carbon UPI
        </h1>

        <p style={{
          fontSize: '20px',
          color: '#8b949e',
          maxWidth: '640px',
          margin: '0 auto 16px',
          lineHeight: 1.6,
        }}>
          India&apos;s open Digital Public Infrastructure for climate action verification.
        </p>
        <p style={{
          fontSize: '16px',
          color: '#6e7681',
          maxWidth: '560px',
          margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          The trust + verification rail underneath climate commerce — not another app.
          Modelled on UPI / ONDC / DigiLocker. Built for regulators, banks, and registries.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/api/v1"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #00f5d4, #00bbf9)',
              color: '#0a0a0f',
              padding: '14px 28px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
            }}
          >
            GET /api/v1 — Protocol Root →
          </a>
          <a
            href="https://github.com/greenpe-in/carbon-upi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#e6edf3',
              padding: '14px 28px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '15px',
              textDecoration: 'none',
            }}
          >
            GitHub Spec →
          </a>
        </div>

        {/* Positioning Statement */}
        <div style={{
          marginTop: '60px',
          display: 'flex',
          gap: '40px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {[
            ['Carbon UPI', 'Open verification protocol', 'UPI / ONDC'],
            ['GIC', 'Climate proof object', 'UPI transaction receipt'],
            ['GreenPe', 'Commercial infra layer', 'Razorpay on UPI'],
          ].map(([layer, does, analogy]) => (
            <div key={layer} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px 24px',
              textAlign: 'left',
              minWidth: '200px',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#00f5d4', marginBottom: '6px' }}>{layer}</div>
              <div style={{ fontSize: '13px', color: '#8b949e', marginBottom: '4px' }}>{does}</div>
              <div style={{ fontSize: '11px', color: '#6e7681' }}>Analogy: {analogy}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 32px' }}>

        {/* 7 Layer Architecture */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '8px',
            color: '#e6edf3',
          }}>
            7-Layer DPI Stack
          </h2>
          <p style={{ color: '#8b949e', marginBottom: '40px', fontSize: '15px' }}>
            Modelled on UPI architecture. Each layer is independently operable and composable.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {layers.map(layer => (
              <div
                key={layer.num}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${layer.status === 'ACTIVE' ? 'rgba(0,245,212,0.15)' : 'rgba(255,255,255,0.06)'}`,
                  borderLeft: `3px solid ${layer.color}`,
                  borderRadius: '12px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: `${layer.color}20`,
                  border: `1.5px solid ${layer.color}60`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: layer.color,
                  flexShrink: 0,
                }}>
                  {layer.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#e6edf3' }}>{layer.name}</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 10px',
                      borderRadius: '100px',
                      background: layer.status === 'ACTIVE' ? 'rgba(0,245,212,0.12)' : 'rgba(255,255,255,0.06)',
                      color: layer.status === 'ACTIVE' ? '#00f5d4' : '#6e7681',
                      border: `1px solid ${layer.status === 'ACTIVE' ? 'rgba(0,245,212,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      letterSpacing: '0.06em',
                    }}>
                      {layer.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#8b949e', margin: '0 0 8px' }}>{layer.description}</p>
                  <code style={{
                    fontSize: '12px',
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    background: 'rgba(0,0,0,0.3)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    color: layer.color,
                  }}>
                    {layer.endpoint}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology Registry */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '8px',
            color: '#e6edf3',
          }}>
            Approved Methodology Registry
          </h2>
          <p style={{ color: '#8b949e', marginBottom: '40px', fontSize: '15px' }}>
            All emission calculations are deterministic and formula-based.
            AI assists anomaly detection — AI does <strong style={{ color: '#fee440' }}>NOT</strong> determine emissions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {methodologies.map(m => (
              <div
                key={m.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{m.emoji}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#e6edf3' }}>{m.name}</div>
                    <div style={{ fontSize: '11px', color: '#6e7681', marginTop: '2px' }}>{m.id}</div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginBottom: '12px',
                }}>
                  <code style={{
                    fontSize: '11px',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#fee440',
                    wordBreak: 'break-word',
                  }}>
                    {m.formula}
                  </code>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'rgba(0,245,212,0.08)',
                    border: '1px solid rgba(0,245,212,0.2)',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    color: '#00f5d4',
                  }}>
                    EF: {m.ef} {m.efUnit}
                  </span>
                  <span style={{
                    background: m.impactType === 'AVOIDED'
                      ? 'rgba(0,187,249,0.08)' : 'rgba(0,234,97,0.08)',
                    border: `1px solid ${m.impactType === 'AVOIDED' ? 'rgba(0,187,249,0.2)' : 'rgba(0,234,97,0.2)'}`,
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    color: m.impactType === 'AVOIDED' ? '#00bbf9' : '#00ea61',
                  }}>
                    {m.impactType}
                  </span>
                </div>

                <div style={{ marginTop: '10px', fontSize: '10px', color: '#484f58', lineHeight: 1.4 }}>
                  {m.authority}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* API Flow Examples */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '8px',
            color: '#e6edf3',
          }}>
            Protocol Flow — curl Examples
          </h2>
          <p style={{ color: '#8b949e', marginBottom: '40px', fontSize: '15px' }}>
            Four API calls. No vendor lock-in. Any system can integrate.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {examples.map((ex, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  padding: '14px 20px',
                  background: 'rgba(255,255,255,0.04)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <span style={{
                    background: 'rgba(0,245,212,0.15)',
                    border: '1px solid rgba(0,245,212,0.3)',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#00f5d4',
                    fontFamily: 'monospace',
                  }}>
                    {ex.method}
                  </span>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: '#e6edf3',
                  }}>
                    {ex.path}
                  </span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#6e7681',
                  }}>
                    {ex.label}
                  </span>
                </div>
                <pre style={{
                  margin: 0,
                  padding: '20px',
                  fontSize: '12px',
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  color: '#8b949e',
                  overflow: 'auto',
                  lineHeight: 1.6,
                }}>
                  <code style={{ color: '#00f5d4' }}>
                    {`curl -X ${ex.method} https://verify.greenpe.in${ex.path} \\\n  -H "Content-Type: application/json" \\\n  -d '${ex.body.replace(/\n/g, '\n  ')}'`}
                  </code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* Beckn Integration */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', color: '#e6edf3' }}>
            Beckn Network Integration
          </h2>
          <p style={{ color: '#8b949e', marginBottom: '32px', fontSize: '15px' }}>
            GreenPe is a Beckn Network Provider (BNP) in the climate verification domain.
            Carbon UPI APIs are wrapped with a Beckn adapter — not rebuilt.
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            padding: '28px',
            marginBottom: '20px',
          }}>
            <div style={{ fontWeight: 600, color: '#e6edf3', marginBottom: '20px', fontSize: '14px' }}>
              Beckn Order Lifecycle → Carbon UPI Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['search', 'BAP searches for climate verification services', 'Returns 5-methodology Beckn catalog'],
                ['select', 'BAP selects a methodology item', 'Returns order scaffold with quote'],
                ['init', 'BAP initiates verification order', 'Creates order ID, returns INITIATED status'],
                ['confirm', 'BAP confirms with CDIF data payload', 'Runs CIH → MRV → GIC pipeline, returns GIC document'],
                ['status', 'BAP polls order status', 'Returns GIC verification URL + fulfillment state'],
              ].map(([action, bap, bpp]) => (
                <div key={action} style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr 1fr',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '8px',
                }}>
                  <code style={{
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#fee440',
                  }}>
                    {action}
                  </code>
                  <span style={{ fontSize: '12px', color: '#8b949e' }}>{bap}</span>
                  <span style={{ fontSize: '12px', color: '#00f5d4' }}>{bpp}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '12px',
          }}>
            {[
              { network: 'ONDC', status: 'Compatible', note: 'Wrap ready' },
              { network: 'Energy Beckn', status: 'Compatible', note: 'DEG domain' },
              { network: 'Climate Network', status: 'Planned', note: 'Q3 2026' },
              { network: 'AgriStack', status: 'Planned', note: 'Soil carbon' },
            ].map(n => (
              <div key={n.network} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '16px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#e6edf3' }}>{n.network}</div>
                  <div style={{ fontSize: '11px', color: '#6e7681', marginTop: '2px' }}>{n.note}</div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '100px',
                  background: n.status === 'Compatible' ? 'rgba(0,245,212,0.1)' : 'rgba(255,255,255,0.05)',
                  color: n.status === 'Compatible' ? '#00f5d4' : '#6e7681',
                  border: `1px solid ${n.status === 'Compatible' ? 'rgba(0,245,212,0.2)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                  {n.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Who Can Consume GICs */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', color: '#e6edf3' }}>
            Who Consumes a GIC?
          </h2>
          <p style={{ color: '#8b949e', marginBottom: '32px', fontSize: '15px' }}>
            A GIC is a programmable, machine-readable climate proof artifact.
            It is NOT a carbon credit.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            {[
              { who: '🏦 Banks', for: 'Green lending decisions' },
              { who: '🏛️ Government', for: 'Subsidy disbursement triggers' },
              { who: '📋 Registries', for: 'Verra / BEE CCTS / Gold Standard' },
              { who: '🛡️ Insurers', for: 'Climate underwriting' },
              { who: '📊 ESG Platforms', for: 'BRSR / CBAM reporting' },
              { who: '🔗 ONDC / Beckn', for: 'Climate commerce networks' },
            ].map(c => (
              <div key={c.who} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '18px',
              }}>
                <div style={{ fontSize: '18px', marginBottom: '8px' }}>{c.who}</div>
                <div style={{ fontSize: '12px', color: '#8b949e' }}>{c.for}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '12px', color: '#484f58', lineHeight: 1.8 }}>
            Carbon UPI — Open Protocol Specification v1.0<br />
            Patent: Provisional Specification IN/PA 3385, 19 December 2025<br />
            Governance: Brown Swan Private Limited / GreenPe<br />
            Hash Algorithm: SHA-256 (Node.js crypto) | Schema: CDIF-1.0 / GIC-1.0
          </div>
        </div>
      </div>
    </div>
  );
}

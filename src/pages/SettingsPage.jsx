import { RefreshCw, CheckCircle2, XCircle, Server, Cpu, SlidersHorizontal } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useBackendStatus } from '../hooks/useBackendStatus'
import { API_BASE_URL, ENDPOINTS } from '../services/api'
import { DemoBanner, ErrorBox, PageHeader, Pill, Spinner } from '../components/ui'

const Row = ({ k, v }) => <div className="flex justify-between gap-4 border-b border-ink-600 py-2 text-sm last:border-0"><span className="text-slate-500">{k}</span><span className="break-all text-right font-mono text-xs text-slate-200">{v}</span></div>
const Section = ({ icon: Icon, title, children }) => <section className="card p-5"><h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-100"><Icon className="h-4 w-4 text-slate-500" />{title}</h2>{children}</section>
// Model name key is not guaranteed by the contract – look at a few likely keys, otherwise show the raw payload.
const modelName = (d) => d?.model ?? d?.model_name ?? d?.name

export default function SettingsPage() {
  const { mode } = useApp()
  const live = mode === 'live'
  const { loading, health, model, refresh } = useBackendStatus(live)
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader title="Settings" subtitle="Backend connection and model status">
        {live && <button className="btn-ghost" onClick={refresh} disabled={loading}>{loading ? <Spinner /> : <RefreshCw className="h-4 w-4" />}Re-check</button>}
      </PageHeader>
      {!live && <DemoBanner>Demo Mode is active: no backend or model is being contacted. Switch to Live in the top bar to check real status.</DemoBanner>}
      <Section icon={Server} title="Backend connection">
        {live ? (loading && !health ? <Spinner /> : health?.ok
          ? <div className="flex items-center gap-2 text-sm text-emerald-400"><CheckCircle2 className="h-4 w-4" />Connected <Pill tone="green">{ENDPOINTS.health}</Pill></div>
          : <><div className="mb-3 flex items-center gap-2 text-sm text-red-400"><XCircle className="h-4 w-4" />Not reachable</div><ErrorBox error={health?.error} title="Health check failed" /></>)
          : <Pill tone="amber">Not checked (Demo Mode)</Pill>}
      </Section>
      <Section icon={Cpu} title="AI model">
        {live ? (loading && !model ? <Spinner /> : model?.ok ? (
          <div>
            <Row k="Model name" v={modelName(model.data) ?? 'Not reported by backend'} />
            <p className="mb-1 mt-3 text-xs uppercase tracking-wide text-slate-500">Raw response from {ENDPOINTS.modelStatus}</p>
            <pre className="overflow-x-auto rounded-md border border-ink-600 bg-ink-900 p-3 font-mono text-xs text-slate-300">{JSON.stringify(model.data, null, 2)}</pre>
          </div>) : <ErrorBox error={model?.error} title="Model status unavailable" />)
          : <Pill tone="amber">Not checked (Demo Mode)</Pill>}
      </Section>
      <Section icon={SlidersHorizontal} title="API configuration">
        <Row k="API base URL" v={API_BASE_URL} />
        <Row k="Health" v={`GET ${ENDPOINTS.health}`} />
        <Row k="Model status" v={`GET ${ENDPOINTS.modelStatus}`} />
        <Row k="Analyze" v={`POST ${ENDPOINTS.analyze}`} />
        <p className="mt-3 text-xs text-slate-500">Set <code className="font-mono">VITE_API_BASE_URL</code> in <code className="font-mono">frontend/.env</code> and restart the dev server to change the backend URL.</p>
      </Section>
    </div>
  )
}

import { AlertTriangle, Loader2, FlaskConical, Inbox } from 'lucide-react'

const SEV = {
  high: 'bg-red-500/10 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  low: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  unknown: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
}
export const SeverityBadge = ({ severity }) => (
  <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${SEV[severity] || SEV.unknown}`}>{severity}</span>
)
export const Pill = ({ children, tone = 'neutral' }) => {
  const t = { neutral: 'border-ink-500 text-slate-300 bg-ink-700', green: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10', amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10', red: 'border-red-500/30 text-red-400 bg-red-500/10', violet: 'border-accent/30 text-accent bg-accent/10' }[tone]
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${t}`}>{children}</span>
}
export const Spinner = ({ className = 'h-4 w-4' }) => <Loader2 className={`animate-spin ${className}`} />

export function ErrorBox({ error, onRetry, title = 'Request failed' }) {
  if (!error) return null
  return (
    <div role="alert" className="fade-in flex gap-3 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-red-300">{title}</p>
        <p className="mt-1 break-words text-sm text-slate-300">{error.message}</p>
        {error.status && <p className="mt-1 text-xs text-slate-500">HTTP {error.status}</p>}
        {onRetry && <button onClick={onRetry} className="btn-ghost mt-3 !py-1 text-xs">Retry</button>}
      </div>
    </div>
  )
}
export const DemoBanner = ({ children = 'Sample data – not a real backend analysis.' }) => (
  <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">
    <FlaskConical className="h-4 w-4 shrink-0" />{children}
  </div>
)
export const Empty = ({ title, children, action }) => (
  <div className="card flex flex-col items-center px-6 py-12 text-center">
    <Inbox className="mb-3 h-8 w-8 text-slate-600" />
    <p className="text-sm font-medium text-slate-200">{title}</p>
    <p className="mt-1 max-w-md text-sm text-slate-500">{children}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
)
export const PageHeader = ({ title, subtitle, children }) => (
  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
    <div><h1 className="text-xl font-semibold text-slate-100">{title}</h1>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>
    {children}
  </div>
)
export const StatCard = ({ icon: Icon, label, value, hint, tone = 'text-accent' }) => (
  <div className="card p-4">
    <div className="flex items-center justify-between"><span className="text-xs text-slate-400">{label}</span><Icon className={`h-4 w-4 ${tone}`} /></div>
    <div className="mt-2 text-2xl font-semibold text-slate-100">{value}</div>
    {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
  </div>
)

import { useMemo, useState } from 'react'
import { ChevronsDownUp, ChevronsUpDown, ShieldCheck } from 'lucide-react'
import FindingCard from './FindingCard'
import { Empty } from '../ui'
import { humanize, SEVERITIES } from '../../utils/format'

const Chip = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`rounded-md border px-2.5 py-1 text-xs capitalize transition-colors ${active ? 'border-accent bg-accent/15 text-slate-100' : 'border-ink-600 text-slate-400 hover:bg-ink-700'}`}>{children}</button>
)

export default function FindingsList({ findings }) {
  const [sev, setSev] = useState('all')
  const [cat, setCat] = useState('all')
  const [expandAll, setExpandAll] = useState(false)
  const cats = useMemo(() => [...new Set(findings.map((f) => f.type))], [findings])
  const counts = useMemo(() => Object.fromEntries(SEVERITIES.map((s) => [s, findings.filter((f) => f.severity === s).length])), [findings])
  const shown = findings.filter((f) => (sev === 'all' || f.severity === sev) && (cat === 'all' || f.type === cat))

  if (!findings.length) return <Empty title="No documentation drift found"><ShieldCheck className="mx-auto mb-2 h-5 w-5 text-emerald-400" />Everything checked in this analysis matches the implementation.</Empty>

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-3 sm:max-w-md">
        {SEVERITIES.map((s) => (
          <div key={s} className="card px-3 py-2"><div className="text-lg font-semibold text-slate-100">{counts[s]}</div><div className="text-xs capitalize text-slate-500">{s} severity</div></div>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-1.5"><span className="mr-1 text-xs text-slate-500">Severity</span>
          {['all', ...SEVERITIES].map((s) => <Chip key={s} active={sev === s} onClick={() => setSev(s)}>{s}</Chip>)}</div>
        <div className="flex flex-wrap items-center gap-1.5"><span className="mr-1 text-xs text-slate-500">Category</span>
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>all</Chip>
          {cats.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{humanize(c)}</Chip>)}</div>
        <button onClick={() => setExpandAll(!expandAll)} className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
          {expandAll ? <ChevronsDownUp className="h-4 w-4" /> : <ChevronsUpDown className="h-4 w-4" />}{expandAll ? 'Collapse all' : 'Expand all'}</button>
      </div>
      <p className="mb-3 text-xs text-slate-500">Showing {shown.length} of {findings.length} findings</p>
      <div className="space-y-3">
        {shown.map((f, i) => <FindingCard key={`${f.id}-${expandAll}`} finding={f} defaultOpen={expandAll || (shown.length === 1) || (i === 0 && findings.length <= 3)} />)}
        {!shown.length && <Empty title="No findings match these filters">Try clearing the severity or category filter.</Empty>}
      </div>
    </div>
  )
}

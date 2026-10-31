import { Link } from 'react-router-dom'
import { GitPullRequest, ChevronRight } from 'lucide-react'
import { Pill } from '../ui'
import { repoName, timeAgo } from '../../utils/format'
import { useApp } from '../../context/AppContext'

export default function AnalysisRow({ a, to = '/app/findings' }) {
  const { setActiveId } = useApp()
  const d = a.summary.drift_detected
  return (
    <Link to={to} onClick={() => setActiveId(a.id)} className="flex items-center gap-3 px-4 py-3 hover:bg-ink-700/50">
      <GitPullRequest className="h-4 w-4 shrink-0 text-slate-500" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-slate-200">{repoName(a.repo_url)} <span className="text-slate-500">#{a.pr_number}</span></p>
        <p className="text-xs text-slate-500">{timeAgo(a.created_at)}{a.summary.files_analyzed !== undefined && ` · ${a.summary.files_analyzed} files`}</p>
      </div>
      {a.status !== 'completed' ? <Pill tone="amber">{a.status}</Pill> : d > 0 ? <Pill tone="red">{d} drift</Pill> : <Pill tone="green">Clean</Pill>}
      <ChevronRight className="h-4 w-4 text-slate-600" />
    </Link>
  )
}

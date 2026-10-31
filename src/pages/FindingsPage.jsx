import { Link } from 'react-router-dom'
import { GitPullRequest, Files, FileWarning, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { DemoBanner, Empty, PageHeader, Pill } from '../components/ui'
import FindingsList from '../components/findings/FindingsList'
import { repoName, timeAgo } from '../utils/format'

export default function FindingsPage() {
  const { active: a, mode, analyses, setActiveId } = useApp()
  if (!a) return <><PageHeader title="Documentation Findings" /><Empty title="No analysis to show" action={<Link to="/app/analyze" className="btn-primary">Analyze Repository</Link>}>Run an analysis to see a documentation drift report here.</Empty></>
  return (
    <div>
      <PageHeader title="Documentation Drift Report" subtitle={`${repoName(a.repo_url)} · PR #${a.pr_number}`}>
        {analyses.length > 1 && (
          <select aria-label="Select analysis" className="input !w-auto" value={a.id} onChange={(e) => setActiveId(e.target.value)}>
            {analyses.map((x) => <option key={x.id} value={x.id}>{repoName(x.repo_url)} #{x.pr_number} · {timeAgo(x.created_at)}</option>)}
          </select>)}
      </PageHeader>
      {mode === 'demo' && <div className="mb-4"><DemoBanner>These findings are sample data, not real backend analysis.</DemoBanner></div>}
      <div className="card mb-6 flex flex-wrap gap-x-8 gap-y-3 p-4 text-sm">
        <span className="flex items-center gap-2"><GitPullRequest className="h-4 w-4 text-slate-500" />PR #{a.pr_number}</span>
        {a.summary.files_analyzed !== undefined && <span className="flex items-center gap-2"><Files className="h-4 w-4 text-slate-500" />{a.summary.files_analyzed} files analyzed</span>}
        <span className="flex items-center gap-2"><FileWarning className="h-4 w-4 text-slate-500" />{a.summary.drift_detected} drift finding{a.summary.drift_detected === 1 ? '' : 's'}</span>
        <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-500" />{timeAgo(a.created_at)}</span>
        <Pill tone={a.status === 'completed' ? 'green' : 'amber'}>{a.status}</Pill>
      </div>
      <FindingsList findings={a.findings} />
    </div>
  )
}

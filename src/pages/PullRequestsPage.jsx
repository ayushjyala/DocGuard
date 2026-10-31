import { Link } from 'react-router-dom'
import { FileCode2, FileText } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { DemoBanner, Empty, PageHeader, Pill } from '../components/ui'
import FindingCard from '../components/findings/FindingCard'
import AnalysisRow from '../components/dashboard/AnalysisRow'
import { repoName, timeAgo } from '../utils/format'

const FileList = ({ title, icon: Icon, files, fallback }) => (
  <div className="card p-4">
    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-100"><Icon className="h-4 w-4 text-slate-500" />{title}{files && <span className="text-slate-500">({files.length})</span>}</h3>
    {files?.length ? <ul className="space-y-1 font-mono text-xs text-slate-400">{files.map((f) => <li key={f}>{f}</li>)}</ul> : <p className="text-xs text-slate-500">{fallback}</p>}
  </div>
)

export default function PullRequestsPage() {
  const { active: a, analyses, mode } = useApp()
  if (!a) return <><PageHeader title="Pull Requests" /><Empty title="No pull requests analyzed" action={<Link to="/app/analyze" className="btn-primary">Analyze Repository</Link>}>Analyzed pull requests will appear here.</Empty></>
  // Doc files: backend-supplied list, otherwise derived from findings (labelled as such)
  const derivedDocs = [...new Set(a.findings.map((f) => f.documentation_file).filter(Boolean))]
  return (
    <div className="space-y-6">
      <PageHeader title="Pull Request Analysis" subtitle="Most recent selection – pick another below" />
      {mode === 'demo' && <DemoBanner />}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-lg font-semibold text-slate-100">{repoName(a.repo_url)} <span className="text-slate-500">#{a.pr_number}</span></p>
            <a className="text-xs text-accent hover:underline" href={`${a.repo_url}/pull/${a.pr_number}`} target="_blank" rel="noreferrer">Open on GitHub ↗</a></div>
          <div className="flex items-center gap-2"><Pill tone={a.status === 'completed' ? 'green' : 'amber'}>{a.status}</Pill><Pill tone={a.summary.drift_detected ? 'red' : 'green'}>{a.summary.drift_detected} drift findings</Pill><span className="text-xs text-slate-500">{timeAgo(a.created_at)}</span></div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FileList title="Changed files" icon={FileCode2} files={a.changed_files} fallback={a.findings.length ? `Not provided by the backend. Source files referenced by findings: ${[...new Set(a.findings.map((f) => f.code_file).filter(Boolean))].join(', ') || 'none'}` : 'Not provided by the backend.'} />
        <FileList title={a.documentation_files ? 'Documentation files affected' : 'Documentation files affected (from findings)'} icon={FileText} files={a.documentation_files || (derivedDocs.length ? derivedDocs : undefined)} fallback="No documentation files affected." />
      </div>
      <section className="space-y-3"><h2 className="text-sm font-medium text-slate-100">Finding details</h2>
        {a.findings.length ? a.findings.map((f) => <FindingCard key={f.id} finding={f} />) : <Empty title="No drift detected">This pull request did not introduce documentation drift.</Empty>}</section>
      {analyses.length > 1 && <section className="card"><h2 className="border-b border-ink-600 px-4 py-3 text-sm font-medium text-slate-100">All analyzed pull requests</h2>
        <div className="divide-y divide-ink-600">{analyses.map((x) => <AnalysisRow key={x.id} a={x} to="/app/pull-requests" />)}</div></section>}
    </div>
  )
}

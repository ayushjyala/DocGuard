import { Link } from 'react-router-dom'
import { FolderGit2, FileWarning, Files, HeartPulse, ScanSearch } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useApp } from '../context/AppContext'
import { DemoBanner, Empty, PageHeader, StatCard } from '../components/ui'
import FindingCard from '../components/findings/FindingCard'
import AnalysisRow from '../components/dashboard/AnalysisRow'
import { healthScore, repoName } from '../utils/format'

export default function DashboardPage() {
  const { mode, analyses } = useApp()
  const repos = new Set(analyses.map((a) => repoName(a.repo_url))).size
  const drift = analyses.reduce((s, a) => s + (a.summary.drift_detected || 0), 0)
  const files = analyses.reduce((s, a) => s + (a.summary.files_analyzed || 0), 0)
  const health = healthScore(analyses)
  const latest = analyses.flatMap((a) => a.findings.map((f) => ({ ...f, _a: a }))).slice(0, 3)
  const hTone = health === null ? 'text-slate-500' : health >= 85 ? 'text-emerald-400' : health >= 60 ? 'text-amber-400' : 'text-red-400'
  const hColor = health >= 85 ? '#34d399' : health >= 60 ? '#fbbf24' : '#f87171'

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" subtitle={mode === 'demo' ? 'Sample data for demonstration' : 'Analyses run from this browser against your backend'}>
        <Link to="/app/analyze" className="btn-primary"><ScanSearch className="h-4 w-4" />Analyze a repository</Link>
      </PageHeader>
      {mode === 'demo' && <DemoBanner>Demo Mode: every number below is sample data, not a real analysis.</DemoBanner>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FolderGit2} label="Repositories analyzed" value={repos} />
        <StatCard icon={FileWarning} label="Drift detected" value={drift} tone="text-red-400" />
        <StatCard icon={Files} label="Files analyzed" value={files} tone="text-sky-400" />
        <div className="card flex items-center justify-between p-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">Documentation health <HeartPulse className={`h-4 w-4 ${hTone}`} /></div>
            <div className={`mt-2 text-2xl font-semibold ${health === null ? 'text-slate-500' : 'text-slate-100'}`}>{health === null ? '—' : `${health}%`}</div>
            <div className="mt-1 text-xs text-slate-500">Files without drift</div>
          </div>
          {health !== null && (
            <div className="h-14 w-14"><ResponsiveContainer><PieChart><Pie data={[{ v: health }, { v: 100 - health }]} dataKey="v" innerRadius={18} outerRadius={26} startAngle={90} endAngle={-270} stroke="none"><Cell fill={hColor} /><Cell fill="#252932" /></Pie></PieChart></ResponsiveContainer></div>
          )}
        </div>
      </div>

      {!analyses.length ? (
        <Empty title="No analyses yet" action={<Link to="/app/analyze" className="btn-primary">Analyze Repository</Link>}>
          Run your first analysis against the live backend, or switch to Demo Mode in the top bar to explore with sample data.
        </Empty>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <section className="card lg:col-span-2">
            <h2 className="border-b border-ink-600 px-4 py-3 text-sm font-medium text-slate-100">Recent analysis activity</h2>
            <div className="divide-y divide-ink-600">{analyses.slice(0, 5).map((a) => <AnalysisRow key={a.id} a={a} />)}</div>
          </section>
          <section className="space-y-3 lg:col-span-3">
            <h2 className="text-sm font-medium text-slate-100">Latest findings</h2>
            {latest.length ? latest.map((f) => <FindingCard key={f._a.id + f.id} finding={f} />) : <Empty title="No drift in recent analyses">Documentation matches the code in the analyses so far.</Empty>}
          </section>
        </div>
      )}
    </div>
  )
}

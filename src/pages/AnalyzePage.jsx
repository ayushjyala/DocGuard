import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanSearch, GitBranch, Hash, Timer } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { DemoBanner, ErrorBox, PageHeader, Spinner } from '../components/ui'
import { validateRepoUrl } from '../utils/format'
import { useElapsed } from '../hooks/useElapsed'
import { API_BASE_URL } from '../services/api'

export default function AnalyzePage() {
  const { mode, runAnalysis } = useApp()
  const nav = useNavigate()
  const [repo, setRepo] = useState('')
  const [pr, setPr] = useState('')
  const [errs, setErrs] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const elapsed = useElapsed(loading)

  const submit = async (e) => {
    e.preventDefault()
    const v = {}
    if (!validateRepoUrl(repo)) v.repo = 'Enter a valid GitHub URL, e.g. https://github.com/owner/repository'
    if (!/^\d+$/.test(pr.trim()) || Number(pr) < 1) v.pr = 'Enter a positive pull request number, e.g. 42'
    setErrs(v); setApiError(null)
    if (Object.keys(v).length) return
    setLoading(true)
    try {
      await runAnalysis({ repo_url: repo.trim().replace(/\/$/, ''), pr_number: Number(pr) })
      nav('/app/findings')
    } catch (err) { setApiError(err) } finally { setLoading(false) }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Analyze Repository" subtitle="Check a pull request for documentation that no longer matches the code." />
      <div className="mb-4">{mode === 'demo'
        ? <DemoBanner>Demo Mode: submitting returns sample findings; no backend request is made.</DemoBanner>
        : <p className="text-xs text-slate-500">Live Mode: requests go to <code className="font-mono text-slate-400">{API_BASE_URL}/api/analyze</code></p>}</div>
      <form onSubmit={submit} noValidate className="card space-y-5 p-5">
        <div>
          <label htmlFor="repo" className="label">GitHub repository URL</label>
          <div className="relative"><GitBranch className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input id="repo" className="input pl-9" placeholder="https://github.com/owner/repository" value={repo} onChange={(e) => setRepo(e.target.value)} disabled={loading} aria-invalid={!!errs.repo} /></div>
          {errs.repo && <p className="mt-1.5 text-xs text-red-400">{errs.repo}</p>}
        </div>
        <div>
          <label htmlFor="pr" className="label">Pull request number</label>
          <div className="relative"><Hash className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input id="pr" inputMode="numeric" className="input pl-9" placeholder="42" value={pr} onChange={(e) => setPr(e.target.value)} disabled={loading} aria-invalid={!!errs.pr} /></div>
          {errs.pr && <p className="mt-1.5 text-xs text-red-400">{errs.pr}</p>}
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? <Spinner /> : <ScanSearch className="h-4 w-4" />}{loading ? 'Analyzing…' : 'Analyze Documentation'}</button>
        {loading && (
          <div className="fade-in flex items-center gap-2 rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-xs text-slate-400">
            <Timer className="h-4 w-4" />Waiting for backend response · {elapsed}s. Local model inference can take a minute or more. The backend does not report step-by-step progress.
          </div>
        )}
        <ErrorBox error={apiError} title={mode === 'live' ? 'Analysis failed' : 'Error'} />
      </form>
    </div>
  )
}

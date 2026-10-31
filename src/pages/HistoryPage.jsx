import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'
import { DemoBanner, Empty, PageHeader, Spinner } from '../components/ui'
import AnalysisRow from '../components/dashboard/AnalysisRow'

export default function HistoryPage() {
  const { mode, analyses, clearLive } = useApp()
  const [remote, setRemote] = useState({ loading: mode === 'live', items: null })
  useEffect(() => {
    if (mode !== 'live') return
    let off = false
    setRemote({ loading: true, items: null })
    api.history().then((items) => !off && setRemote({ loading: false, items }))
    return () => { off = true }
  }, [mode])

  const fromBackend = mode === 'live' && remote.items
  const list = fromBackend ? remote.items : analyses
  return (
    <div>
      <PageHeader title="Analysis History" subtitle={mode === 'demo' ? 'Sample data' : fromBackend ? 'Loaded from the backend' : 'Backend has no history endpoint – showing analyses run in this browser'}>
        {mode === 'live' && !fromBackend && analyses.length > 0 && <button className="btn-ghost" onClick={clearLive}><Trash2 className="h-4 w-4" />Clear local history</button>}
      </PageHeader>
      {mode === 'demo' && <div className="mb-4"><DemoBanner /></div>}
      {remote.loading ? <div className="flex items-center gap-2 text-sm text-slate-400"><Spinner />Checking backend for history…</div>
        : list.length ? <div className="card divide-y divide-ink-600">{list.map((a) => <AnalysisRow key={a.id} a={a} />)}</div>
        : <Empty title="No history yet" action={<Link to="/app/analyze" className="btn-primary">Analyze Repository</Link>}>Completed analyses will be listed here.</Empty>}
    </div>
  )
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import { demoAnalyses } from '../data/demoData'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)
const LS = { mode: 'docguard_mode', live: 'docguard_live_history' }
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }

export function AppProvider({ children }) {
  const [mode, setModeState] = useState(() => localStorage.getItem(LS.mode) || 'live')
  const [liveRuns, setLiveRuns] = useState(() => read(LS.live, []))
  const [activeId, setActiveId] = useState(null)

  useEffect(() => { try { localStorage.setItem(LS.live, JSON.stringify(liveRuns.slice(0, 50))) } catch { /* ignore */ } }, [liveRuns])
  const setMode = (m) => { localStorage.setItem(LS.mode, m); setModeState(m); setActiveId(null) }

  const analyses = mode === 'demo' ? demoAnalyses : liveRuns
  const active = analyses.find((a) => a.id === activeId) || analyses[0] || null

  const runAnalysis = useCallback(async (req) => {
    if (mode === 'demo') {
      await new Promise((r) => setTimeout(r, 900))
      return { ...demoAnalyses[0], id: 'demo-1', repo_url: req.repo_url, pr_number: req.pr_number }
    }
    const result = await api.analyze(req) // throws on failure – never falls back to sample data
    setLiveRuns((r) => [result, ...r])
    setActiveId(result.id)
    return result
  }, [mode])

  const value = useMemo(() => ({ mode, setMode, analyses, active, setActiveId, runAnalysis, clearLive: () => { setLiveRuns([]); setActiveId(null) } }), [mode, analyses, active, runAnalysis])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

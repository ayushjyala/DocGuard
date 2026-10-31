import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, ScanSearch, GitPullRequest, FileWarning, History, Settings, ShieldCheck, Menu, X, FlaskConical, Radio } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const NAV = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/analyze', label: 'Analyze Repository', icon: ScanSearch },
  { to: '/app/pull-requests', label: 'Pull Requests', icon: GitPullRequest },
  { to: '/app/findings', label: 'Documentation Findings', icon: FileWarning },
  { to: '/app/history', label: 'Analysis History', icon: History },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]
export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 font-semibold text-slate-100"><span className="grid h-7 w-7 place-items-center rounded-md bg-accent-strong"><ShieldCheck className="h-4 w-4 text-white" /></span>DocGuard</Link>
)
export function ModeToggle() {
  const { mode, setMode } = useApp()
  const Opt = ({ id, icon: Icon, label }) => (
    <button onClick={() => setMode(id)} aria-pressed={mode === id} className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${mode === id ? (id === 'demo' ? 'bg-amber-500/20 text-amber-300' : 'bg-accent-strong text-white') : 'text-slate-400 hover:text-slate-200'}`}><Icon className="h-3.5 w-3.5" />{label}</button>
  )
  return <div className="flex rounded-md border border-ink-600 bg-ink-900 p-0.5"><Opt id="live" icon={Radio} label="Live" /><Opt id="demo" icon={FlaskConical} label="Demo" /></div>
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)
  const { mode } = useApp()
  const nav = (
    <nav className="space-y-0.5 p-3">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
          className={({ isActive }) => `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-ink-700 text-slate-100' : 'text-slate-400 hover:bg-ink-800 hover:text-slate-200'}`}>
          <Icon className="h-4 w-4" />{label}
        </NavLink>
      ))}
    </nav>
  )
  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-60 shrink-0 border-r border-ink-600 bg-ink-900 lg:block">
        <div className="flex h-14 items-center border-b border-ink-600 px-5"><Logo /></div>{nav}
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64 border-r border-ink-600 bg-ink-900">
            <div className="flex h-14 items-center justify-between border-b border-ink-600 px-5"><Logo /><button onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button></div>{nav}
          </aside>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-ink-600 bg-ink-950/90 px-4 backdrop-blur lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <div className="ml-auto flex items-center gap-3">
            {mode === 'demo' && <span className="hidden text-xs text-amber-300 sm:inline">Demo Mode · sample data</span>}
            <ModeToggle />
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  )
}

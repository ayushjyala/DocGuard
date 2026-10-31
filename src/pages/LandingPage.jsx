import { Link, useNavigate } from 'react-router-dom'
import { ScanSearch, FileDiff, Sparkles, ShieldCheck, GitPullRequest, Cpu, Code2, GitBranch, Search, Brain, FileText } from 'lucide-react'
import { Logo } from '../components/layout/DashboardLayout'
import { useApp } from '../context/AppContext'

const steps = [
  { icon: GitPullRequest, t: 'Submit a pull request', d: 'Provide a GitHub repository and PR number.' },
  { icon: Search, t: 'Static analysis', d: 'Python analysis extracts signatures, defaults and flags from changed code.' },
  { icon: Brain, t: 'AI reasoning', d: 'A local Qwen3 4B model explains each mismatch and drafts a fix.' },
  { icon: FileText, t: 'Review the report', d: 'See docs next to code, with severity and evidence.' },
]
const features = [
  { icon: FileDiff, t: 'Side-by-side evidence', d: 'Documented value vs. actual implementation, with file and line references.' },
  { icon: Sparkles, t: 'Suggested corrections', d: 'AI-generated rewrites you can copy straight into your docs.' },
  { icon: ShieldCheck, t: 'Deterministic first', d: 'Static analysis finds facts; the model only explains and suggests.' },
  { icon: Cpu, t: 'Runs locally', d: 'Open-weight model via Ollama. Your code stays on your machine.' },
]
const arch = [['React + Vite frontend', 'This app'], ['FastAPI backend', 'REST API'], ['Python static analysis', 'Deterministic findings'], ['Qwen3 4B via Ollama', 'Explanations & fixes']]

export default function LandingPage() {
  const { setMode } = useApp()
  const nav = useNavigate()
  const demo = () => { setMode('demo'); nav('/app') }
  const analyze = () => { setMode('live'); nav('/app/analyze') }
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-ink-600 bg-ink-950/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden gap-6 text-sm text-slate-400 sm:flex">
            <a href="#how" className="hover:text-slate-100">How it works</a><a href="#features" className="hover:text-slate-100">Features</a><a href="#architecture" className="hover:text-slate-100">Architecture</a>
          </nav>
          <Link to="/app" className="btn-ghost !py-1.5">Open Dashboard</Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800 px-3 py-1 text-xs text-slate-400"><Code2 className="h-3.5 w-3.5 text-accent" />Hacktoberfest 2026 · Team OdeX</span>
        <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-6xl">Your Code Changes.<br /><span className="text-accent">Your Docs Should Too.</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">DocGuard detects documentation drift in pull requests, pinpointing which docs are outdated, why, and how to fix them, using static analysis backed by a local AI model.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={analyze} className="btn-primary !px-5 !py-2.5"><ScanSearch className="h-4 w-4" />Analyze Repository</button>
          <button onClick={demo} className="btn-ghost !px-5 !py-2.5">View Demo</button>
        </div>
        <p className="mt-3 text-xs text-slate-500">“View Demo” opens the dashboard with clearly labelled sample data.</p>
        <div className="card mx-auto mt-14 max-w-2xl overflow-hidden text-left font-mono text-[13px]">
          <div className="border-b border-ink-600 px-4 py-2 text-xs text-slate-500">README.md:42 ⟷ config.py:18 · illustrative example</div>
          <div className="border-l-2 border-red-500/70 bg-red-500/5 px-4 py-2 text-slate-300">- timeout = 30  # seconds</div>
          <div className="border-l-2 border-emerald-500/70 bg-emerald-500/5 px-4 py-2 text-slate-300">+ timeout = 10  # seconds</div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-semibold text-slate-100">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map(({ icon: I, t, d }, i) => (
          <div key={t} className="card p-5"><div className="mb-3 flex items-center gap-2 text-xs text-slate-500"><I className="h-4 w-4 text-accent" />Step {i + 1}</div><h3 className="text-sm font-medium text-slate-100">{t}</h3><p className="mt-1 text-sm text-slate-500">{d}</p></div>))}</div>
      </section>
      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-semibold text-slate-100">Key features</h2>
        <div className="grid gap-4 sm:grid-cols-2">{features.map(({ icon: I, t, d }) => (
          <div key={t} className="card flex gap-4 p-5"><I className="mt-0.5 h-5 w-5 shrink-0 text-accent" /><div><h3 className="text-sm font-medium text-slate-100">{t}</h3><p className="mt-1 text-sm text-slate-500">{d}</p></div></div>))}</div>
      </section>
      <section id="architecture" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-semibold text-slate-100">Technical architecture</h2>
        <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">{arch.map(([t, d], i) => (
          <div key={t} className="flex flex-1 items-center gap-3 lg:contents"><div className="card flex-1 p-4 text-center"><p className="text-sm font-medium text-slate-100">{t}</p><p className="text-xs text-slate-500">{d}</p></div>{i < arch.length - 1 && <span className="hidden text-slate-600 lg:block">→</span>}</div>))}</div>
      </section>
      <footer className="border-t border-ink-600 py-8 text-center text-xs text-slate-500">
        <div className="mb-2 flex items-center justify-center gap-2"><GitBranch className="h-4 w-4" />DocGuard · Team OdeX · Hacktoberfest 2026 Hack Day Sonipat</div>
        Neev Kumar · Chhavi · Aditya Harsh · Ayush Jyala
      </footer>
    </div>
  )
}

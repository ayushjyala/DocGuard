import { useState } from 'react'
import { ChevronDown, FileText, FileCode2, Lightbulb, Sparkles, Copy, Check } from 'lucide-react'
import { SeverityBadge, Pill } from '../ui'
import CodeBlock from './CodeBlock'
import { humanize } from '../../utils/format'

const Loc = ({ icon: Icon, file, line }) => file ? (
  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400"><Icon className="h-3.5 w-3.5" />{file}{line !== undefined && <span className="text-slate-500">:{line}</span>}</span>
) : null

export default function FindingCard({ finding: f, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(f.suggestion || ''); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* clipboard unavailable */ }
  }
  return (
    <article className="card fade-in overflow-hidden">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-start gap-3 p-4 text-left hover:bg-ink-700/40">
        <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? '' : '-rotate-90'}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={f.severity} />
            <span className="text-sm font-medium text-slate-100">{humanize(f.type)}</span>
            {f.confidence !== undefined && <Pill tone="violet"><Sparkles className="h-3 w-3" />{Math.round(f.confidence * 100)}% confidence</Pill>}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            <Loc icon={FileText} file={f.documentation_file} line={f.line} />
            <Loc icon={FileCode2} file={f.code_file} line={f.code_line} />
          </div>
          {!open && f.explanation && <p className="mt-2 line-clamp-1 text-sm text-slate-400">{f.explanation}</p>}
        </div>
      </button>

      {open && (
        <div className="space-y-4 border-t border-ink-600 p-4">
          {f.explanation && (
            <div><p className="label">Why this is outdated</p><p className="text-sm leading-relaxed text-slate-200">{f.explanation}</p></div>
          )}
          {(f.documented_value || f.actual_value) && (
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="overflow-hidden rounded-md border border-ink-600 bg-ink-900">
                <div className="flex items-center justify-between border-b border-ink-600 px-3 py-1.5 text-xs text-slate-400"><span>Documentation</span><Loc icon={FileText} file={f.documentation_file} line={f.line} /></div>
                <CodeBlock code={f.documented_value ?? '—'} startLine={f.line} tone="old" />
              </div>
              <div className="overflow-hidden rounded-md border border-ink-600 bg-ink-900">
                <div className="flex items-center justify-between border-b border-ink-600 px-3 py-1.5 text-xs text-slate-400"><span>Implementation</span><Loc icon={FileCode2} file={f.code_file} line={f.code_line} /></div>
                <CodeBlock code={f.actual_value ?? '—'} startLine={f.code_line} tone="new" />
              </div>
            </div>
          )}
          {f.suggestion && (
            <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-accent"><Lightbulb className="h-3.5 w-3.5" />Suggested correction (AI-generated)</p>
                <button onClick={copy} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">{copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}</button>
              </div>
              <p className="text-sm text-slate-200">{f.suggestion}</p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

// Tiny dependency-free highlighter (keywords, strings, numbers, comments) for Python/JS/Markdown-ish snippets.
const KW = /^(def|class|return|import|from|if|else|elif|for|while|in|not|and|or|None|True|False|self|const|let|var|function|async|await|null|true|false)$/
const TOKEN = /(#.*$|\/\/.*$)|("[^"]*"|'[^']*'|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w]*)(?=\()|([A-Za-z_]\w*)|(--?[\w-]+)/g

function highlight(line) {
  const out = []; let last = 0, m, k = 0
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index))
    const [t, comment, string, number, fn, word, flag] = m
    let cls = ''
    if (comment) cls = 'text-slate-500 italic'
    else if (string) cls = 'text-emerald-300'
    else if (number) cls = 'text-amber-300'
    else if (fn) cls = 'text-sky-300'
    else if (flag) cls = 'text-violet-300'
    else if (word && KW.test(word)) cls = 'text-fuchsia-400'
    out.push(cls ? <span key={k++} className={cls}>{t}</span> : t)
    last = m.index + t.length
  }
  if (last < line.length) out.push(line.slice(last))
  return out
}

export default function CodeBlock({ code, startLine, tone }) {
  const lines = String(code ?? '').split('\n')
  const bar = tone === 'old' ? 'border-l-red-500/70 bg-red-500/5' : tone === 'new' ? 'border-l-emerald-500/70 bg-emerald-500/5' : 'border-l-transparent'
  return (
    <pre className={`overflow-x-auto border-l-2 py-2 font-mono text-[13px] leading-6 ${bar}`}>
      {lines.map((l, i) => (
        <div key={i} className="flex px-3">
          {startLine !== undefined && <span className="mr-4 w-8 shrink-0 select-none text-right text-slate-600">{startLine + i}</span>}
          <code className="whitespace-pre text-slate-200">{highlight(l)}</code>
        </div>
      ))}
    </pre>
  )
}

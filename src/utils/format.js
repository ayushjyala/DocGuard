export const SEVERITIES = ['high', 'medium', 'low']
export const humanize = (s = '') => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
export function timeAgo(iso) {
  if (!iso) return 'unknown time'
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (Number.isNaN(m)) return 'unknown time'
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (m < 1440) return `${Math.round(m / 60)}h ago`
  return `${Math.round(m / 1440)}d ago`
}
export const repoName = (url = '') => url.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '') || 'unknown repo'
export const validateRepoUrl = (v) => /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(v.trim())
// Docs health = share of analyzed files without drift (simple, transparent metric).
export function healthScore(analyses) {
  const files = analyses.reduce((a, x) => a + (x.summary.files_analyzed || 0), 0)
  const drift = analyses.reduce((a, x) => a + (x.summary.drift_detected || 0), 0)
  if (!files) return null
  return Math.max(0, Math.round(100 - (drift / files) * 100))
}

// Centralized API service. If the backend schema changes, update ONLY this file
// (endpoints below + the normalize* functions).
import axios from 'axios'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

export const ENDPOINTS = {
  health: '/health',
  modelStatus: '/api/model-status',
  analyze: '/api/analyze',
  history: '/api/history', // optional – not in the agreed contract; handled gracefully if absent
}

const client = axios.create({ baseURL: API_BASE_URL, timeout: 10 * 60 * 1000 }) // local LLM can be slow

// Turn any axios failure into a consistent, user-readable error.
export function toApiError(err) {
  if (err?.response) {
    const d = err.response.data
    const detail = typeof d?.detail === 'string' ? d.detail : d?.message || d?.error
    return { kind: 'http', status: err.response.status, message: detail || `Backend responded with HTTP ${err.response.status}.` }
  }
  if (err?.code === 'ECONNABORTED') return { kind: 'timeout', message: 'The backend took too long to respond.' }
  if (err?.request || err?.code === 'ERR_NETWORK')
    return { kind: 'network', message: `Cannot reach the backend at ${API_BASE_URL}. Make sure the FastAPI server is running (and CORS allows this origin).` }
  return { kind: 'unknown', message: err?.message || 'Unexpected error.' }
}

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined)
const str = (v) => (v === undefined || v === null ? undefined : String(v))
const pick = (o, ...keys) => { for (const k of keys) if (o?.[k] !== undefined && o?.[k] !== null) return o[k] }

// Only maps fields that are actually present – never invents values.
export function normalizeFinding(f, i = 0) {
  return {
    id: str(pick(f, 'id')) || `finding-${i}`,
    type: str(pick(f, 'type', 'category')) || 'unknown',
    severity: (str(pick(f, 'severity')) || 'unknown').toLowerCase(),
    documentation_file: str(pick(f, 'documentation_file', 'doc_file')),
    line: num(pick(f, 'line', 'doc_line', 'documentation_line')),
    documented_value: str(pick(f, 'documented_value', 'documented')),
    actual_value: str(pick(f, 'actual_value', 'actual')),
    code_file: str(pick(f, 'code_file', 'source_file')),
    code_line: num(pick(f, 'code_line', 'source_line')),
    explanation: str(pick(f, 'explanation', 'reason')),
    suggestion: str(pick(f, 'suggestion', 'suggested_fix')),
    confidence: num(pick(f, 'confidence')), // shown only when the backend supplies it
  }
}

export function normalizeAnalysis(raw, request = {}) {
  const findings = (Array.isArray(raw?.findings) ? raw.findings : []).map(normalizeFinding)
  const s = raw?.summary || {}
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    repo_url: request.repo_url,
    pr_number: request.pr_number,
    status: str(raw?.status) || 'completed',
    created_at: new Date().toISOString(),
    summary: {
      files_analyzed: num(s.files_analyzed),
      drift_detected: num(s.drift_detected) ?? findings.length,
    },
    // Optional PR metadata – only displayed when the backend sends it.
    changed_files: Array.isArray(raw?.changed_files) ? raw.changed_files : undefined,
    documentation_files: Array.isArray(raw?.documentation_files) ? raw.documentation_files : undefined,
    findings,
    source: 'live',
  }
}

export const api = {
  async health() {
    try { const { data } = await client.get(ENDPOINTS.health, { timeout: 5000 }); return { ok: true, data } }
    catch (e) { return { ok: false, error: toApiError(e) } }
  },
  async modelStatus() {
    try { const { data } = await client.get(ENDPOINTS.modelStatus, { timeout: 8000 }); return { ok: true, data } }
    catch (e) { return { ok: false, error: toApiError(e) } }
  },
  // Throws a normalized error object on failure.
  async analyze({ repo_url, pr_number }) {
    try {
      const { data } = await client.post(ENDPOINTS.analyze, { repo_url, pr_number })
      return normalizeAnalysis(data, { repo_url, pr_number })
    } catch (e) { throw toApiError(e) }
  },
  // Returns null when the backend has no history endpoint (callers fall back to this browser's session list).
  async history() {
    try {
      const { data } = await client.get(ENDPOINTS.history, { timeout: 8000 })
      const list = Array.isArray(data) ? data : data?.items
      if (!Array.isArray(list)) return null
      return list.map((h) => ({
        ...normalizeAnalysis(h, { repo_url: h.repo_url, pr_number: h.pr_number }),
        id: str(h.id) || `h-${Math.random().toString(36).slice(2)}`,
        created_at: h.created_at || h.timestamp || undefined,
      }))
    } catch { return null }
  },
}

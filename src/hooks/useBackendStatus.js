import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
export function useBackendStatus(enabled = true) {
  const [state, setState] = useState({ loading: enabled, health: null, model: null })
  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))
    const [health, model] = await Promise.all([api.health(), api.modelStatus()])
    setState({ loading: false, health, model })
  }, [])
  useEffect(() => { if (enabled) refresh() }, [enabled, refresh])
  return { ...state, refresh }
}

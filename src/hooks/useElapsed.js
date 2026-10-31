import { useEffect, useState } from 'react'
export function useElapsed(running) {
  const [s, setS] = useState(0)
  useEffect(() => {
    if (!running) { setS(0); return }
    const t = setInterval(() => setS((x) => x + 1), 1000)
    return () => clearInterval(t)
  }, [running])
  return s
}

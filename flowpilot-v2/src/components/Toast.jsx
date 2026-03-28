import { useState, useEffect, useCallback, useRef } from 'react'

const css = `
.fp-toast {
  position: fixed;
  bottom: calc(28px + var(--safe-bottom));
  left: 50%;
  transform: translateX(-50%) translateY(12px);
  background: var(--night-3);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 10px 20px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  letter-spacing: 0.2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
  z-index: 999;
  white-space: nowrap;
  font-family: 'DM Sans', sans-serif;
}
.fp-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
`

export function useToast() {
  const [state, setState] = useState({ msg: '', show: false })
  const timer = useRef(null)

  const show = useCallback((msg) => {
    clearTimeout(timer.current)
    setState({ msg, show: true })
    timer.current = setTimeout(() => setState(s => ({ ...s, show: false })), 2400)
  }, [])

  const Toast = (
    <>
      <style>{css}</style>
      <div className={`fp-toast ${state.show ? 'show' : ''}`}>{state.msg}</div>
    </>
  )

  return { show, Toast }
}

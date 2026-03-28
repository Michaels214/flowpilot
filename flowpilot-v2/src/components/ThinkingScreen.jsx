// ─── ThinkingScreen ───────────────────────────────────────────────────────────
// Shown while the AI is generating the flow map.
// Deliberately calm — no progress bars, no countdowns, no urgency.
// ─────────────────────────────────────────────────────────────────────────────

const css = `
.thinking {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 22px;
  text-align: center;
  min-height: 100vh;
  min-height: 100dvh;
}
.thinking-ring {
  width: 56px; height: 56px;
  border: 1.5px solid var(--gold);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  animation: breathe 2.4s ease-in-out infinite;
}
.thinking-ring svg {
  width: 22px; height: 22px;
  stroke: var(--gold);
  fill: none;
  stroke-width: 1.5;
}
@keyframes breathe {
  0%,100% { opacity: 0.5; transform: scale(0.97); }
  50%      { opacity: 1;   transform: scale(1.03); }
}
.thinking-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  color: var(--text);
}
.thinking-sub {
  font-size: 13px;
  color: var(--text-soft);
  line-height: 1.7;
  font-weight: 300;
  max-width: 260px;
}
.dots {
  display: flex; gap: 7px;
}
.dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--gold);
  animation: dotFade 1.5s ease-in-out infinite;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotFade {
  0%,80%,100% { opacity: 0.18; }
  40%         { opacity: 1; }
}
`

export function ThinkingScreen() {
  return (
    <>
      <style>{css}</style>
      <div className="thinking">
        <div className="thinking-ring">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l2 2" />
          </svg>
        </div>
        <div className="thinking-title">Reading what you wrote</div>
        <div className="thinking-sub">
          Finding the steps, the order, and where to start.<br />No rush.
        </div>
        <div className="dots">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
      </div>
    </>
  )
}

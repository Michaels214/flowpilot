// ─── MapScreen ────────────────────────────────────────────────────────────────
//
// Displays the AI-generated flow map.
// Each task node shows:
//   - What to do (name)
//   - Who does it (who)
//   - Why it comes here (why) — key for decision paralysis users
//   - A "Mark done →" action that moves the flow forward
//
// No timers. No urgency language. The user moves at their own pace.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { Icon } from './Icons.jsx'

const css = `
.map-screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

/* Header */
.map-header {
  padding: calc(28px + var(--safe-top)) 24px 16px;
  flex-shrink: 0;
}
.map-back {
  display: flex; align-items: center; gap: 6px;
  background: transparent; border: none;
  color: var(--text-dim); font-size: 12px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.3px;
  margin-bottom: 20px;
  transition: color 0.15s;
  padding: 0;
}
.map-back:hover { color: var(--gold); }
.map-title {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  color: var(--text);
  margin-bottom: 4px;
  line-height: 1.2;
}
.map-summary {
  font-size: 13px;
  color: var(--text-soft);
  font-weight: 300;
  line-height: 1.5;
}

/* Progress */
.map-progress {
  padding: 14px 24px 10px;
  flex-shrink: 0;
}
.map-prog-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.map-prog-label { font-size: 11px; color: var(--text-dim); letter-spacing: 0.3px; }
.map-prog-pct   { font-size: 11px; color: var(--text-dim); }
.prog-track {
  height: 2px;
  background: var(--night-3);
  border-radius: 2px;
  overflow: hidden;
}
.prog-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* Task list */
.task-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 24px calc(40px + var(--safe-bottom));
}

/* Task card */
.task-card {
  background: var(--night-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color 0.2s, opacity 0.3s;
}
.task-card.is-active {
  border-color: rgba(201,169,110,0.35);
  box-shadow: 0 0 0 1px rgba(201,169,110,0.1);
}
.task-card.is-done { opacity: 0.48; }

.task-head {
  padding: 14px 16px 10px;
  display: flex; align-items: flex-start; gap: 12px;
}
.step-circle {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
  background: var(--night-3);
  transition: all 0.25s;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 12px;
  color: var(--text-dim);
}
.step-circle.active {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--night);
  font-style: normal;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-family: 'DM Sans', sans-serif;
}
.step-circle.done {
  background: var(--teal);
  border-color: var(--teal);
  color: white;
}

.task-info { flex: 1; }
.task-name {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  font-weight: 400;
  color: var(--text);
  line-height: 1.3;
  margin-bottom: 4px;
}
.task-who { font-size: 11px; color: var(--text-dim); }

/* Why note */
.task-why {
  margin: 0 16px 12px;
  padding: 10px 12px;
  background: var(--night-3);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--text-soft);
  line-height: 1.6;
  border-left: 2px solid rgba(201,169,110,0.25);
}

/* Footer */
.task-foot {
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.foot-note { font-size: 11px; color: var(--text-dim); }
.done-btn {
  padding: 7px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--gold);
  background: transparent;
  color: var(--gold);
  font-size: 11px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.3px;
}
.done-btn:hover { background: var(--gold); color: var(--night); }
.done-btn.is-sent { border-color: var(--teal); color: var(--teal); }
.done-btn.is-sent:hover { background: var(--teal); color: white; }

/* Connector */
.connector {
  height: 20px;
  padding-left: 36px;
  display: flex; align-items: center;
}
.conn-line { width: 1.5px; height: 100%; background: var(--border); }

/* Complete state */
.all-done {
  margin: 24px 24px 0;
  padding: 20px;
  background: var(--teal-dim);
  border: 1px solid rgba(61,158,140,0.25);
  border-radius: var(--radius-md);
  text-align: center;
}
.all-done-title {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  color: var(--teal);
  margin-bottom: 6px;
}
.all-done-sub { font-size: 12px; color: var(--text-soft); line-height: 1.6; }

/* Reset btn */
.reset-btn {
  margin: 16px 24px 0;
  width: calc(100% - 48px);
  padding: 13px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-soft);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.reset-btn:hover { border-color: var(--border-hover); color: var(--text); }
`

export function MapScreen({ title, summary, initialTasks, onReset, showToast }) {
  const [tasks, setTasks] = useState(
    initialTasks.map((t, i) => ({
      ...t,
      id: i,
      status: i === 0 ? 'active' : 'pending',
      sent: false,
    }))
  )

  const done  = tasks.filter(t => t.status === 'done').length
  const total = tasks.length
  const pct   = total ? Math.round((done / total) * 100) : 0
  const allDone = done === total

  const markDone = (id) => {
    setTasks(prev => {
      const updated = prev.map(t =>
        t.id === id ? { ...t, status: 'done', sent: true } : t
      )
      // Activate the next pending task
      const nextIdx = updated.findIndex(t => t.status === 'pending')
      if (nextIdx !== -1) updated[nextIdx] = { ...updated[nextIdx], status: 'active' }
      return updated
    })
    const next = tasks.find(t => t.status === 'pending')
    showToast(next ? '✓ Done — next step is ready' : '✓ All steps complete')
  }

  return (
    <>
      <style>{css}</style>
      <div className="map-screen">

        <div className="map-header">
          <button className="map-back" onClick={onReset}>
            <Icon.Back width={13} height={13} strokeWidth={2} />
            Start over
          </button>
          <div className="map-title">{title}</div>
          <div className="map-summary">{summary}</div>
        </div>

        <div className="map-progress">
          <div className="map-prog-row">
            <span className="map-prog-label">{done} of {total} done</span>
            <span className="map-prog-pct">{pct}%</span>
          </div>
          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="task-list">

          {allDone && (
            <div className="all-done">
              <div className="all-done-title">Flow complete</div>
              <div className="all-done-sub">You worked through everything. That's the whole job done.</div>
            </div>
          )}

          {tasks.map((task, idx) => (
            <div key={task.id}>
              <div className={`task-card ${task.status === 'active' ? 'is-active' : ''} ${task.status === 'done' ? 'is-done' : ''}`}>

                <div className="task-head">
                  <div className={`step-circle ${task.status}`}>
                    {task.status === 'done'
                      ? <Icon.Check width={12} height={12} strokeWidth={2.5} />
                      : task.status === 'active' ? 'NOW' : idx + 1
                    }
                  </div>
                  <div className="task-info">
                    <div className="task-name">{task.name}</div>
                    <div className="task-who">→ {task.who}</div>
                  </div>
                </div>

                {task.why && (
                  <div className="task-why">{task.why}</div>
                )}

                {task.status !== 'done' && (
                  <div className="task-foot">
                    <span className="foot-note">
                      {task.sent ? '↗ Passed on' : 'When you\'re done here'}
                    </span>
                    <button
                      className={`done-btn ${task.sent ? 'is-sent' : ''}`}
                      onClick={() => markDone(task.id)}
                    >
                      {task.sent ? 'Resend →' : 'Mark done →'}
                    </button>
                  </div>
                )}
              </div>

              {idx < tasks.length - 1 && (
                <div className="connector"><div className="conn-line" /></div>
              )}
            </div>
          ))}

          <button className="reset-btn" onClick={onReset}>
            Start a new map
          </button>

        </div>
      </div>
    </>
  )
}

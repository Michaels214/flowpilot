// ─── IntakeScreen ─────────────────────────────────────────────────────────────
//
// The entry point of FlowPilot.
// Philosophy: No timer. No pressure. Just describe what's on your mind.
//
// Two modes:
//   1. Brain dump  — free text, messy is fine, AI reads it
//   2. My list     — structured items, paste or type, order doesn't matter
//
// Both feed into the AI map builder.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { Icon } from './Icons.jsx'

const css = `
.intake {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

/* Top */
.intake-top {
  padding: calc(32px + var(--safe-top)) 24px 20px;
  flex-shrink: 0;
}
.logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}
.logo-mark {
  width: 32px; height: 32px;
  background: var(--gold);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  color: var(--night);
  flex-shrink: 0;
}
.logo-name {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  color: var(--text);
  letter-spacing: -0.3px;
}
.intake-greeting {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  line-height: 1.25;
  color: var(--text);
  margin-bottom: 10px;
}
.intake-greeting em { color: var(--gold); font-style: italic; }
.intake-sub {
  font-size: 13px;
  color: var(--text-soft);
  line-height: 1.65;
  font-weight: 300;
  max-width: 320px;
}

/* Tabs */
.intake-tabs {
  display: flex;
  margin: 0 24px;
  background: var(--night-2);
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
  flex-shrink: 0;
}
.itab {
  flex: 1;
  padding: 9px;
  border: none;
  border-radius: 7px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: var(--text-soft);
  transition: all 0.2s;
  letter-spacing: 0.2px;
}
.itab.active {
  background: var(--night-3);
  color: var(--text);
  box-shadow: 0 1px 6px rgba(0,0,0,0.3);
}

/* Body */
.intake-body {
  flex: 1;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

/* Brain dump */
.brain-dump {
  width: 100%;
  min-height: 160px;
  background: var(--night-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--text);
  resize: none;
  outline: none;
  line-height: 1.7;
  transition: border-color 0.2s;
  -webkit-appearance: none;
}
.brain-dump::placeholder { color: var(--text-dim); font-style: italic; }
.brain-dump:focus { border-color: var(--gold-dim); }

/* List */
.list-wrap {
  background: var(--night-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 8px 14px;
}
.list-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}
.list-row:last-of-type { border-bottom: none; }
.list-num {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 12px;
  color: var(--text-dim);
  width: 14px;
  flex-shrink: 0;
}
.list-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: var(--text);
  padding: 2px 0;
  -webkit-appearance: none;
}
.list-input::placeholder { color: var(--text-dim); }
.list-del {
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 4px;
  transition: color 0.15s;
  font-size: 18px; line-height: 1;
}
.list-del:hover { color: var(--red); }
.list-add {
  display: flex; align-items: center; gap: 6px;
  margin-top: 10px;
  background: transparent;
  border: none;
  color: var(--text-dim);
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: color 0.15s;
  padding: 2px 0;
}
.list-add:hover { color: var(--gold); }

/* Context */
.context-label {
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 7px;
}
.context-input {
  width: 100%;
  background: var(--night-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
  -webkit-appearance: none;
}
.context-input::placeholder { color: var(--text-dim); font-style: italic; }
.context-input:focus { border-color: var(--gold-dim); }

.hint {
  font-size: 11px;
  color: var(--text-dim);
  line-height: 1.6;
}

/* CTA */
.intake-cta {
  padding: 16px 24px calc(28px + var(--safe-bottom));
  flex-shrink: 0;
}
.cta-btn {
  width: 100%;
  padding: 16px;
  background: var(--gold);
  color: var(--night);
  border: none;
  border-radius: var(--radius-md);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.2px;
}
.cta-btn:hover:not(:disabled) { background: var(--gold-light); transform: translateY(-1px); }
.cta-btn:active { transform: translateY(0); }
.cta-btn:disabled { opacity: 0.38; cursor: not-allowed; }
.cta-note {
  text-align: center;
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 10px;
  line-height: 1.5;
}
`

export function IntakeScreen({ onSubmit, loading }) {
  const [tab, setTab] = useState('brain')
  const [brainText, setBrainText] = useState('')
  const [items, setItems] = useState(['', ''])
  const [context, setContext] = useState('')

  const hasContent = tab === 'brain'
    ? brainText.trim().length > 5
    : items.some(i => i.trim().length > 0)

  const handleSubmit = () => {
    if (!hasContent || loading) return
    if (tab === 'brain') {
      onSubmit({ mode: 'brain', text: brainText, context })
    } else {
      onSubmit({ mode: 'list', items: items.filter(i => i.trim()), context })
    }
  }

  const addItem = () => setItems(prev => [...prev, ''])
  const removeItem = (idx) => {
    if (items.length <= 1) return
    setItems(prev => prev.filter((_, i) => i !== idx))
  }
  const updateItem = (idx, val) => setItems(prev => prev.map((v, i) => i === idx ? val : v))

  return (
    <>
      <style>{css}</style>
      <div className="intake">

        <div className="intake-top">
          <div className="logo-row">
            <div className="logo-mark">
              <Icon.Logo width={17} height={17} strokeWidth={2} />
            </div>
            <span className="logo-name">FlowPilot</span>
          </div>
          <div className="intake-greeting">
            What's on your<br /><em>mind right now?</em>
          </div>
          <div className="intake-sub">
            No timer. No pressure. Just tell FlowPilot what's in your head — it'll find where to start.
          </div>
        </div>

        <div className="intake-tabs">
          <button className={`itab ${tab === 'brain' ? 'active' : ''}`} onClick={() => setTab('brain')}>
            Brain dump
          </button>
          <button className={`itab ${tab === 'list' ? 'active' : ''}`} onClick={() => setTab('list')}>
            My list
          </button>
        </div>

        <div className="intake-body">

          {/* Brain dump */}
          {tab === 'brain' && (
            <>
              <textarea
                className="brain-dump"
                placeholder={"Just start writing. It doesn't need to make sense yet.\n\ne.g. I need to sort out that Amazon return, chase the finance approval, call the doctor, reply to that email I keep ignoring..."}
                value={brainText}
                onChange={e => setBrainText(e.target.value)}
                autoFocus
              />
              <div className="hint">Write as much or as little as you want. FlowPilot will read it and find the steps.</div>
            </>
          )}

          {/* List */}
          {tab === 'list' && (
            <>
              <div className="list-wrap">
                {items.map((item, idx) => (
                  <div key={idx} className="list-row">
                    <span className="list-num">{idx + 1}</span>
                    <input
                      className="list-input"
                      placeholder={idx === 0 ? 'First thing on your mind...' : 'And another...'}
                      value={item}
                      onChange={e => updateItem(idx, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem() } }}
                      autoFocus={idx === items.length - 1 && idx > 1}
                    />
                    <button className="list-del" onClick={() => removeItem(idx)} aria-label="Remove">×</button>
                  </div>
                ))}
              </div>
              <button className="list-add" onClick={addItem}>
                <Icon.Plus width={11} height={11} strokeWidth={2} />
                Add another
              </button>
              <div className="hint">Paste a list, type as you go, or mix both. Order doesn't matter — FlowPilot will sort it.</div>
            </>
          )}

          {/* Context */}
          <div>
            <div className="context-label">Context (optional)</div>
            <input
              className="context-input"
              placeholder="e.g. Work tasks only, most urgent first, today..."
              value={context}
              onChange={e => setContext(e.target.value)}
            />
          </div>

        </div>

        <div className="intake-cta">
          <button className="cta-btn" onClick={handleSubmit} disabled={!hasContent || loading}>
            <Icon.Map width={15} height={15} strokeWidth={2} />
            {loading ? 'Building your map...' : 'Build my map'}
          </button>
          <div className="cta-note">Takes about 10 seconds. You can edit anything it creates.</div>
        </div>

      </div>
    </>
  )
}

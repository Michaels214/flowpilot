# FlowPilot v2

> A lightweight map of actions. No timer. No pressure.

**What changed in v2:**
- No timer anywhere — the 3-minute countdown is gone entirely
- AI intake screen — describe what's on your mind (brain dump) or paste a list
- AI explains *why* each step comes where it does — removes doubt about where to start
- "Mark done" replaces "Hand off" for solo use

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Build & Deploy

```bash
npm run build
# Deploy the /dist folder to Vercel
```

**Vercel settings:**
| Setting | Value |
|---------|-------|
| Root Directory | `flowpilot-deploy` (or wherever this folder lives in your repo) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

---

## Project Structure

```
src/
├── App.jsx                    # ★ Screen routing + state
├── main.jsx                   # React root
├── index.css                  # Global styles + CSS variables
├── ai.js                      # ★ Anthropic API call + fallback
└── components/
    ├── IntakeScreen.jsx        # ★ Brain dump + list input — entry point
    ├── ThinkingScreen.jsx      # Calm loading state
    ├── MapScreen.jsx           # ★ Flow map with task nodes
    ├── Icons.jsx               # SVG icons
    └── Toast.jsx               # Notification toast
```

---

## Cursor TODO

- [ ] Move Anthropic API call in `ai.js` to a backend proxy (Vercel Edge Function) before public launch — the API key should not live in the browser bundle
- [ ] `useLocalStorage` hook — save last map, restore on page reload
- [ ] Web Push API — real notifications when handing off to another person
- [ ] PWA install prompt — nudge users to add to home screen
- [ ] Multiple saved flows — user can switch between them
- [ ] User profile — name appears in handoff messages

---

## Design Tokens (src/index.css)

| Token | Value | Use |
|-------|-------|-----|
| `--night` | `#0d0f14` | App background |
| `--gold` | `#c9a96e` | Active state, CTA |
| `--teal` | `#3d9e8c` | Done state |
| `--text` | `#e8e4dc` | Primary text |
| `--text-soft` | `#9a968e` | Secondary text |
| `--text-dim` | `#5a5650` | Muted / placeholders |

---

## Philosophy

FlowPilot is a **map**, not a remote control.

It shows users where to go next. It does not connect to or control external systems.
The user always acts themselves — FlowPilot just removes the friction of figuring out what to do first.

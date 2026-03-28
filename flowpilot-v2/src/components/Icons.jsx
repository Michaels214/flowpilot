// ─── FlowPilot Icons ──────────────────────────────────────────────────────────

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const Icon = {
  Logo: (p) => <svg {...base} {...p}><path d="M3 12h18M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4" /></svg>,
  Map:  (p) => <svg {...base} {...p}><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Plus: (p) => <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>,
  Check:(p) => <svg {...base} {...p}><polyline points="20,6 9,17 4,12" /></svg>,
  Back: (p) => <svg {...base} {...p}><path d="M19 12H5M12 5l-7 7 7 7" /></svg>,
  Clock:(p) => <svg {...base} {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" /></svg>,
  Trash:(p) => <svg {...base} {...p}><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Edit: (p) => <svg {...base} {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
}

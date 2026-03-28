// ─── FlowPilot v2 ────────────────────────────────────────────────────────────
//
// v2 changes:
//   ✓ No timer anywhere — replaced with calm, pressureless language
//   ✓ AI intake screen — brain dump + list upload, both feed into map
//   ✓ AI explains WHY each step comes where it does (key for decision paralysis)
//   ✓ "Mark done" not "Hand off" for solo-use clarity
//   ✓ Thinking screen is calm and unhurried
//
// Screen flow:
//   intake → thinking → map → (reset) → intake
//
// CURSOR TODO:
//   [ ] localStorage persistence — save last map, restore on reload
//   [ ] Web Push API — real notifications for handoff to others
//   [ ] PWA install prompt component
//   [ ] Move Anthropic API call to a backend proxy before public launch
//   [ ] User profile — name shown in handoff messages
//   [ ] Multiple saved flows
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { IntakeScreen }  from './components/IntakeScreen.jsx'
import { ThinkingScreen } from './components/ThinkingScreen.jsx'
import { MapScreen }     from './components/MapScreen.jsx'
import { useToast }      from './components/Toast.jsx'
import { generateFlowMap, getFallbackMap } from './ai.js'

const SCREENS = { INTAKE: 'intake', THINKING: 'thinking', MAP: 'map' }

export default function App() {
  const [screen, setScreen]   = useState(SCREENS.INTAKE)
  const [mapData, setMapData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { show: showToast, Toast } = useToast()

  const handleIntakeSubmit = useCallback(async (input) => {
    setLoading(true)
    setScreen(SCREENS.THINKING)

    try {
      const result = await generateFlowMap(input)
      setMapData(result)
    } catch (err) {
      console.warn('FlowPilot AI fallback:', err.message)
      setMapData(getFallbackMap())
    } finally {
      setLoading(false)
      setScreen(SCREENS.MAP)
    }
  }, [])

  const handleReset = useCallback(() => {
    setMapData(null)
    setScreen(SCREENS.INTAKE)
  }, [])

  return (
    <>
      {Toast}

      {screen === SCREENS.INTAKE && (
        <IntakeScreen onSubmit={handleIntakeSubmit} loading={loading} />
      )}

      {screen === SCREENS.THINKING && (
        <ThinkingScreen />
      )}

      {screen === SCREENS.MAP && mapData && (
        <MapScreen
          title={mapData.title}
          summary={mapData.summary}
          initialTasks={mapData.tasks}
          onReset={handleReset}
          showToast={showToast}
        />
      )}
    </>
  )
}

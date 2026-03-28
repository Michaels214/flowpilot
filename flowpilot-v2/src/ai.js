// ─── FlowPilot AI Service ─────────────────────────────────────────────────────
//
// Calls the Anthropic API to turn messy input into a structured flow map.
//
// CURSOR TODO:
//   [ ] Move API calls to a backend proxy (Node/Edge function) before public launch
//       so the API key is never exposed in the browser bundle.
//   [ ] Add retry logic for rate limit errors (429)
//   [ ] Stream the response for faster perceived performance
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are FlowPilot, a calm and practical task organiser designed specifically for people experiencing decision paralysis.

Your purpose: Turn messy thoughts or lists into a clear, ordered action map.

Rules you always follow:
- NEVER use timers, countdowns, urgency language, or pressure
- Tone is always calm, specific, and grounded
- Identify 3 to 6 clear steps maximum — never more
- Put the easiest or most logical FIRST step first
- For each step explain WHY it comes here in one plain sentence (not motivational, just logical)
- Assign a realistic owner: "You", or a named third party (e.g. "Finance Team", "Amazon", "Your GP")
- Step names should be verb + object (e.g. "Print return label", "Email finance team")

Respond ONLY with valid JSON in this exact structure, no preamble, no backticks:
{
  "title": "3-5 word name for this flow",
  "summary": "one calm sentence describing what this covers",
  "tasks": [
    {
      "name": "verb + object step name",
      "who": "who does this",
      "why": "why this step is here"
    }
  ]
}`

/**
 * Sends user input to Claude and returns a structured flow map.
 * @param {{ mode: 'brain'|'list', text?: string, items?: string[], context?: string }} input
 * @returns {Promise<{ title: string, summary: string, tasks: Array }>}
 */
export async function generateFlowMap(input) {
  let userContent = ''

  if (input.mode === 'brain') {
    userContent = `The user wrote this brain dump:\n\n"${input.text}"`
  } else {
    userContent = `The user has this list of things to do:\n\n${input.items.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
  }

  if (input.context) {
    userContent += `\n\nAdditional context from the user: "${input.context}"`
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }]
    })
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  const raw = data.content?.[0]?.text || ''
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

/**
 * Fallback map used when the API is unavailable.
 * Returns a generic but useful starting structure.
 */
export function getFallbackMap() {
  return {
    title: 'Your starting point',
    summary: 'A gentle place to begin — edit any step to fit your situation.',
    tasks: [
      {
        name: 'Pick the one thing with a deadline',
        who: 'You',
        why: 'A real deadline is the clearest signal of where to start.'
      },
      {
        name: 'Write down what "done" looks like for it',
        who: 'You',
        why: 'A concrete end point makes the steps between here and there much smaller.'
      },
      {
        name: 'Identify if anyone else needs to act first',
        who: 'You',
        why: 'Some things are blocked — knowing that early saves wasted effort.'
      },
      {
        name: 'Do the smallest possible first action',
        who: 'You',
        why: 'Starting anywhere, even tiny, breaks the paralysis loop.'
      }
    ]
  }
}

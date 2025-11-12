import { useState } from 'react'
import type { ConciergeAction } from '../types'

interface ConciergeAgentProps {
  interpretMessage: (message: string) => Promise<ConciergeAction>
  onAction: (action: ConciergeAction) => void
  busy?: boolean
  lastAction?: ConciergeAction
}

export function ConciergeAgent({ interpretMessage, onAction, busy = false, lastAction }: ConciergeAgentProps) {
  const [input, setInput] = useState('Hold me a trek spot next month')
  const [localBusy, setLocalBusy] = useState(false)
  const effectiveBusy = busy || localBusy

  const handleSend = async () => {
    if (!input.trim() || effectiveBusy) return
    try {
      setLocalBusy(true)
      const action = await interpretMessage(input)
      onAction(action)
      if (action.action !== 'none') {
        setInput('Thanks!')
      }
    } finally {
      setLocalBusy(false)
    }
  }

  return (
    <aside className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-xl shadow-teal-500/20 backdrop-blur">
      <div className="mb-3 flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-teal-500 to-amber-400 text-lg font-semibold text-white flex items-center justify-center shadow-lg shadow-teal-500/30">
          AI
        </div>
        <div>
          <p className="font-semibold text-slate-900">Concierge Agent</p>
          <p className="text-xs text-slate-500">
            Ask me to hold seats, join waitlists, or surface bundles without hunting through the UI.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="e.g. Hold a seat for the trek in December"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner shadow-slate-100 focus:border-teal-500 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={effectiveBusy}
          className="rounded-xl bg-teal-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {effectiveBusy ? '...' : 'Go'}
        </button>
      </div>
      {lastAction && lastAction.action !== 'none' && (
        <p className="mt-3 rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-700">
          {lastAction.rationale ?? lastAction.message ?? 'All set!'}
        </p>
      )}
      {lastAction && lastAction.action === 'none' && lastAction.message && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">{lastAction.message}</p>
      )}
    </aside>
  )
}

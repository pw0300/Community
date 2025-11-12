import { useMemo, useState } from 'react'
import type { Cohort, Provider, SKU } from '../types'
import { formatDateTime, isCohortLive } from '../utils'

interface CohortRoomViewProps {
  cohort: Cohort
  sku: SKU
  provider: Provider
  onBack: () => void
}

const defaultChecklist = [
  'Upload your health + travel form',
  'Confirm arrival window with concierge',
  'Join the WhatsApp micro-pod',
  'Review acclimatisation guide',
]

const announcementsSeed = [
  {
    id: 'announce-1',
    title: 'Packing list drop',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    body: 'We just refreshed the performance gear list with ultra-light options and a sunrise layers hack.',
  },
  {
    id: 'announce-2',
    title: 'Training pulses',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    body: 'Reminder: log your incline walk before Thursday so Maya can calibrate pacing pods.',
  },
]

const chatSeed = [
  {
    id: 'chat-1',
    author: 'Ava',
    message: 'Landing in Kathmandu Friday 10:00. Anyone else on the 9:30 shuttle?',
    timestamp: new Date(Date.now() - 1000 * 60 * 42),
  },
  {
    id: 'chat-2',
    author: 'Maya',
    message: 'Yes! I’ll meet you by the teal banner outside arrivals. Drop your flight number in the roster.',
    timestamp: new Date(Date.now() - 1000 * 60 * 38),
  },
]

export function CohortRoomView({ cohort, sku, provider, onBack }: CohortRoomViewProps) {
  const [activeTab, setActiveTab] = useState<'checklist' | 'announcements' | 'chat'>('checklist')
  const [completed, setCompleted] = useState<string[]>(['Join the WhatsApp micro-pod'])

  const liveNow = useMemo(() => isCohortLive(cohort), [cohort])

  return (
    <section className="space-y-8 py-10">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-teal-200 bg-white p-8 shadow-lg shadow-teal-500/10">
        <div>
          <button onClick={onBack} className="text-xs font-semibold text-teal-600 hover:text-teal-700">
            ← Back to activities
          </button>
          <h1 className="mt-3 font-display text-3xl text-slate-900">{sku.theme} · Cohort Room</h1>
          <p className="mt-2 text-sm text-slate-600">{cohort.location} · {formatDateTime(cohort.startDate, cohort.timeZone)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600">
              <span className="h-2 w-2 rounded-full bg-teal-500" /> Facilitated by {provider.name}
            </span>
            {liveNow && (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                <span className="h-2 w-2 animate-ping rounded-full bg-white" /> Live now
              </span>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-inner">
          <p className="font-semibold text-slate-900">Need something?</p>
          <p>Ping the concierge agent or drop a chat message—responses <span className="font-semibold">in under 5m</span>.</p>
        </div>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <nav className="flex flex-wrap gap-2">
          {[
            { id: 'checklist', label: 'Checklist' },
            { id: 'announcements', label: 'Announcements' },
            { id: 'chat', label: 'Chat' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/40'
                  : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-6">
          {activeTab === 'checklist' && (
            <ul className="space-y-3">
              {defaultChecklist.map((item) => {
                const done = completed.includes(item)
                return (
                  <li key={item}>
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                        done ? 'border-teal-400 bg-teal-50 shadow-inner shadow-teal-200/60' : 'border-slate-200 bg-white hover:border-teal-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() =>
                          setCompleted((prev) => (done ? prev.filter((value) => value !== item) : [...prev, item]))
                        }
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                      />
                      <span className="font-semibold text-slate-700">{item}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}

          {activeTab === 'announcements' && (
            <ul className="space-y-4">
              {announcementsSeed.map((announcement) => (
                <li key={announcement.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">{announcement.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{announcement.body}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDateTime(announcement.timestamp)}</p>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-4">
              {chatSeed.map((message) => (
                <article key={message.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{message.author}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(message.timestamp)}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{message.message}</p>
                </article>
              ))}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">Drop a note</p>
                <textarea
                  rows={3}
                  placeholder="Share an update, ask for gear help, or tag the concierge."
                  className="mt-3 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-teal-500/40">
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

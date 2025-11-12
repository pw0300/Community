import { useEffect, useMemo, useState } from 'react'
import type { Community } from '../types'
import { formatDateTime, formatRelativeTime } from '../utils'

interface CommunityHubProps {
  communities: Community[]
  activeCommunityId?: string
  onSelectCommunity: (communityId: string) => void
  onCreatePost: (communityId: string, content: string) => void
  onAiPulse: (communityId: string) => Promise<void>
}

const driveCopy = {
  epicMeaning: { label: 'Epic Meaning & Calling', emoji: '🌍', accent: 'from-teal-500 via-emerald-400 to-amber-300' },
  accomplishment: { label: 'Development & Accomplishment', emoji: '🏔️', accent: 'from-amber-500 via-amber-300 to-yellow-200' },
  empowerment: { label: 'Empowerment of Creativity & Feedback', emoji: '🛠️', accent: 'from-sky-500 via-teal-300 to-emerald-200' },
  ownership: { label: 'Ownership & Possession', emoji: '📊', accent: 'from-indigo-500 via-blue-400 to-sky-200' },
  socialInfluence: { label: 'Social Influence & Relatedness', emoji: '🤝', accent: 'from-pink-500 via-rose-300 to-amber-200' },
  scarcity: { label: 'Scarcity & Impatience', emoji: '⏳', accent: 'from-orange-500 via-amber-400 to-yellow-200' },
  unpredictability: { label: 'Unpredictability & Curiosity', emoji: '🎲', accent: 'from-purple-500 via-fuchsia-400 to-pink-200' },
  avoidance: { label: 'Loss & Avoidance', emoji: '🚨', accent: 'from-red-500 via-orange-400 to-amber-200' },
} as const

export function CommunityHub({ communities, activeCommunityId, onSelectCommunity, onCreatePost, onAiPulse }: CommunityHubProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'related' | 'members'>('feed')
  const activeCommunity = useMemo(() => {
    if (!communities.length) return undefined
    return communities.find((community) => community.id === activeCommunityId) ?? communities[0]
  }, [activeCommunityId, communities])

  const quest = activeCommunity?.gamification.questOfWeek
  const questDrive = quest ? driveCopy[quest.drive] : undefined
  const questProgress = quest && quest.target > 0 ? Math.min(100, Math.round((quest.progress / quest.target) * 100)) : 0

  useEffect(() => {
    if (!activeCommunity) return
    const cadenceMs = Math.max(activeCommunity.aiAgentConfig.cadenceMinutes * 60 * 1000, 15000)
    const timer = setInterval(() => {
      onAiPulse(activeCommunity.id)
    }, cadenceMs)

    const warmup = setTimeout(() => {
      onAiPulse(activeCommunity.id)
    }, 12000)

    return () => {
      clearInterval(timer)
      clearTimeout(warmup)
    }
  }, [activeCommunity, onAiPulse])

  useEffect(() => {
    if (activeCommunity && activeCommunityId !== activeCommunity.id) {
      onSelectCommunity(activeCommunity.id)
    }
  }, [activeCommunity, activeCommunityId, onSelectCommunity])

  if (!activeCommunity) {
    return (
      <section className="py-10">
        <p className="text-sm text-slate-500">No communities joined yet. Book a cohort to unlock your hub.</p>
      </section>
    )
  }

  return (
    <section className="grid gap-6 py-10 lg:grid-cols-[320px,1fr]">
      <aside className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <h2 className="font-display text-xl text-slate-900">Communities</h2>
          <p className="mt-1 text-xs text-slate-500">Every service unlocks an ongoing circle. Jump between them instantly.</p>
        </div>
        <div className="space-y-3">
          {communities.map((community) => (
            <button
              key={community.id}
              onClick={() => {
                onSelectCommunity(community.id)
                setActiveTab('feed')
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                activeCommunity.id === community.id
                  ? 'border-teal-400 bg-teal-50 shadow-inner shadow-teal-200/70'
                  : 'border-slate-200 bg-white hover:border-teal-200'
              }`}
            >
              <h3 className="text-sm font-semibold text-slate-900">{community.name}</h3>
              <p className="text-xs text-slate-500">{community.members.toLocaleString()} members · {community.activeNow} active now</p>
            </button>
          ))}
        </div>
      </aside>

      <div className="space-y-6">
        <header className="rounded-3xl border border-teal-200 bg-white p-8 shadow-lg shadow-teal-500/10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">Community Hub</p>
          <h1 className="mt-2 font-display text-3xl text-slate-900">{activeCommunity.name}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {activeCommunity.description} This circle is the go-to-market engine for every cohort we run—stay close to catch the
            next activation first.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-teal-50 px-3 py-1 font-semibold text-teal-600">Cadence: {activeCommunity.aiAgentConfig.cadenceMinutes * 60} sec pulses</span>
            <button
              onClick={() => onAiPulse(activeCommunity.id)}
              className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 font-semibold text-amber-600 shadow-sm hover:border-amber-300"
            >
              Spark a prompt now
            </button>
          </div>
        </header>

        {quest && questDrive && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
            <article className="relative overflow-hidden rounded-3xl border border-teal-100 bg-white p-6 shadow-lg shadow-teal-500/10">
              <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br opacity-40 ${questDrive.accent}`} />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">Community quest</p>
              <h2 className="mt-2 font-display text-2xl text-slate-900">
                {questDrive.emoji} {quest.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{quest.description}</p>
              <p className="mt-3 text-xs font-semibold text-slate-500">
                {questDrive.label} · Reward: {quest.reward}
              </p>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-200/70">
                <div
                  className="h-2 rounded-full bg-teal-500 shadow-lg shadow-teal-500/40"
                  style={{ width: `${questProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Progress {quest.progress} / {quest.target} contributions · {questProgress}%
              </p>
              <div className="mt-4 grid gap-2 text-xs text-slate-600 md:grid-cols-2">
                {activeCommunity.gamification.driveSpotlights.slice(0, 2).map((spotlight) => {
                  const spotlightMeta = driveCopy[spotlight.drive]
                  return (
                    <div key={spotlight.drive} className="rounded-2xl border border-white/50 bg-white/60 p-3 shadow-sm">
                      <p className="font-semibold text-slate-900">
                        {spotlightMeta.emoji} {spotlightMeta.label}
                      </p>
                      <p className="mt-1 text-slate-600">{spotlight.narrative}</p>
                    </div>
                  )
                })}
              </div>
            </article>

            <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Synergy score</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-teal-600">{activeCommunity.gamification.synergyScore}</span>
                  <span className="text-xs uppercase text-slate-400">out of 100</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Anchored in {questDrive.label.toLowerCase()} momentum.</p>
              </div>
              {activeCommunity.gamification.scarcityCountdown && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700">
                  <p className="font-semibold uppercase tracking-[0.2em] text-amber-600">Scarcity signal</p>
                  <p className="mt-1 text-amber-700">{activeCommunity.gamification.scarcityCountdown.label}</p>
                  <p className="mt-2 text-[0.7rem] text-amber-600">Closes {formatDateTime(activeCommunity.gamification.scarcityCountdown.endsAt)}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Drive focus</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span aria-hidden>{questDrive.emoji}</span> {questDrive.label}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Octalysis framing keeps this community as the GTM launchpad for new cohorts.
                </p>
              </div>
            </aside>
          </div>
        )}

        {quest && activeCommunity.gamification.leaderBoard.length > 0 && (
          <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-lg shadow-teal-500/10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-display text-xl text-slate-900">Guild leaderboard</h3>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">Gamified momentum</p>
            </div>
            <ul className="mt-4 space-y-3">
              {activeCommunity.gamification.leaderBoard.map((entry, index) => {
                const meta = driveCopy[entry.drive]
                return (
                  <li
                    key={`${entry.memberName}-${entry.drive}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/10 text-sm font-semibold text-teal-600">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{entry.memberName}</p>
                        <p className="text-xs text-slate-500">
                          {meta.emoji} {meta.label}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-teal-600">{entry.score}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {activeCommunity.upcomingEvents.length > 0 && (
          <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-lg shadow-amber-200/40">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-xl text-slate-900">Upcoming & live community events</h2>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Community-led GTM</p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {activeCommunity.upcomingEvents.slice(0, 4).map((event) => (
                <article
                  key={event.id}
                  className="flex flex-col gap-2 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-xs text-slate-600"
                >
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-amber-600">
                    {event.status === 'live' ? 'Live now' : 'On deck'}
                  </p>
                  <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
                  <p>{event.description}</p>
                  <dl className="space-y-1">
                    <div className="flex justify-between">
                      <dt>Starts</dt>
                      <dd>{formatDateTime(event.startsAt)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Location</dt>
                      <dd>{event.location}</dd>
                    </div>
                    {event.relatedSkuId && (
                      <div className="flex justify-between">
                        <dt>Featured SKU</dt>
                        <dd className="uppercase">{event.relatedSkuId.replace('sku-', '').split('-').join(' ')}</dd>
                      </div>
                    )}
                  </dl>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold text-amber-600">
                    {event.deliveryMode} · {event.format}
                  </span>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <nav className="flex flex-wrap gap-2">
            {[{ id: 'feed', label: 'Feed' }, { id: 'related', label: 'Related SKUs' }, { id: 'members', label: 'Members' }].map(
              (tab) => (
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
              ),
            )}
          </nav>

          <div className="mt-6 space-y-4">
            {activeTab === 'feed' && (
              <>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">Drop an update</p>
                  <textarea
                    rows={3}
                    placeholder="Share a win, ask a question, or invite accountability."
                    className="mt-3 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && event.metaKey) {
                        event.preventDefault()
                        const target = event.target as HTMLTextAreaElement
                        if (target.value.trim()) {
                          onCreatePost(activeCommunity.id, target.value.trim())
                          target.value = ''
                        }
                      }
                    }}
                  />
                  <p className="mt-2 text-xs text-slate-500">Press ⌘ + Enter to post.</p>
                </div>
                {activeCommunity.feed.map((post) => (
                  <article
                    key={post.id}
                    className={`rounded-2xl border px-4 py-4 shadow-sm ${
                      post.authorType === 'ai-agent'
                        ? 'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white'
                        : 'border-slate-100 bg-white'
                    }`}
                  >
                    <header className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={post.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{post.author}</p>
                          <p className="text-xs text-slate-500">
                            {post.authorType === 'ai-agent' ? 'AI Engagement Agent' : 'Community member'} · {formatRelativeTime(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{formatDateTime(post.createdAt)}</span>
                    </header>
                    <p className="mt-3 text-sm text-slate-600">{post.content}</p>
                    {post.poll && (
                      <div className="mt-3 space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700">
                        <p className="font-semibold">{post.poll.prompt}</p>
                        {post.poll.options.map((option) => (
                          <div key={option.id} className="flex items-center justify-between rounded-full bg-white px-3 py-2">
                            <span>{option.label}</span>
                            <span className="font-semibold">{option.votes}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {post.media && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {post.media.map((image, index) => (
                          <img key={index} src={image} alt="" className="h-24 w-full rounded-xl object-cover" />
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </>
            )}

            {activeTab === 'related' && (
              <div className="grid gap-4 md:grid-cols-2">
                {activeCommunity.relatedSkuIds.map((skuId) => (
                  <article key={skuId} className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-700">
                    <p className="font-semibold">{skuId.replace('sku-', '').replace('-', ' ')}</p>
                    <p className="mt-1 text-xs text-teal-600">Curated for this community—tap Discover to compare cohorts.</p>
                  </article>
                ))}
              </div>
            )}

            {activeTab === 'members' && (
              <ul className="grid gap-3 md:grid-cols-2">
                {activeCommunity.memberIds.map((memberId) => (
                  <li key={memberId} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                    Member · {memberId}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

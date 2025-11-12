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

export function CommunityHub({ communities, activeCommunityId, onSelectCommunity, onCreatePost, onAiPulse }: CommunityHubProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'related' | 'members'>('feed')
  const activeCommunity = useMemo(() => {
    if (!communities.length) return undefined
    return communities.find((community) => community.id === activeCommunityId) ?? communities[0]
  }, [activeCommunityId, communities])

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
          <p className="mt-2 text-sm text-slate-600">{activeCommunity.description}</p>
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

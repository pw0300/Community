import { useMemo, useState } from 'react'
import type { Category, Cohort, Community, RecommendationItem, SKU, User } from '../types'
import { formatDate, formatDateTime, getSeatsLabel, sortBySoonest } from '../utils'

interface DiscoverViewProps {
  categories: Category[]
  skus: SKU[]
  cohorts: Cohort[]
  communities: Community[]
  user: User | null
  onSelectSku: (skuId: string) => void
  recommendations: RecommendationItem[]
}

type DeliveryFilter = 'all' | 'online' | 'offline' | 'mixed'

export function DiscoverView({
  categories,
  skus,
  cohorts,
  communities,
  user,
  onSelectSku,
  recommendations,
}: DiscoverViewProps) {
  const [location, setLocation] = useState('all')
  const [delivery, setDelivery] = useState<DeliveryFilter>('all')
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({})

  const availableLocations = useMemo(() => {
    const values = new Set<string>()
    cohorts.forEach((cohort) => {
      const locationToken = cohort.deliveryMode === 'online' ? 'Online' : cohort.location.split(',').pop()?.trim() ?? cohort.location
      values.add(locationToken)
    })
    return ['all', ...Array.from(values)]
  }, [cohorts])

  const filteredTiles = useMemo(() => {
    const startDate = dateRange.start ? new Date(dateRange.start) : null
    const endDate = dateRange.end ? new Date(dateRange.end) : null

    return categories.map((category) => ({
      ...category,
      tiles: category.tiles.filter((tile) => {
        const sku = skus.find((item) => item.id === tile.skuId)
        if (!sku) return false
        const upcoming = sortBySoonest(cohorts.filter((cohort) => cohort.skuId === sku.id)).slice(0, 2)
        if (!upcoming.length) return false

        const matchesLocation =
          location === 'all' ||
          upcoming.some((cohort) => {
            if (cohort.deliveryMode === 'online' && location === 'Online') return true
            return cohort.location.toLowerCase().includes(location.toLowerCase())
          })

        const matchesDelivery = delivery === 'all' || sku.deliveryMode === delivery

        const matchesDate = upcoming.some((cohort) => {
          if (!startDate && !endDate) return true
          const time = cohort.startDate.getTime()
          if (startDate && time < startDate.getTime()) return false
          if (endDate && time > endDate.getTime()) return false
          return true
        })

        return matchesLocation && matchesDelivery && matchesDate
      }),
    }))
  }, [categories, cohorts, dateRange.end, dateRange.start, delivery, location, skus])

  const communityMoments = useMemo(
    () =>
      communities
        .map((community) => community.feed[0])
        .filter(Boolean)
        .slice(0, 4),
    [communities],
  )

  return (
    <section className="space-y-12 py-10">
      <header className="flex flex-col gap-6 rounded-3xl border border-teal-100 bg-white p-8 shadow-lg shadow-teal-500/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-500">Discover</p>
            <h1 className="mt-2 max-w-2xl font-display text-3xl text-slate-900 sm:text-4xl">
              When you decide to grow, here are two doors you can walk through right now.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-600">
              GrowthQuest Concierge accelerates action. Pick a lane, compare top cohorts instantly, or ask the concierge to
              hold your seat.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            <p className="font-semibold text-slate-900">Filters that respect momentum</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <select
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 focus:border-teal-500 focus:outline-none"
              >
                {availableLocations.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All locations' : option}
                  </option>
                ))}
              </select>
              <select
                value={delivery}
                onChange={(event) => setDelivery(event.target.value as DeliveryFilter)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 focus:border-teal-500 focus:outline-none"
              >
                <option value="all">Any mode</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="mixed">Mixed</option>
              </select>
              <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                Start
                <input
                  type="date"
                  value={dateRange.start ?? ''}
                  onChange={(event) => setDateRange((prev) => ({ ...prev, start: event.target.value }))}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:border-teal-500 focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                End
                <input
                  type="date"
                  value={dateRange.end ?? ''}
                  onChange={(event) => setDateRange((prev) => ({ ...prev, end: event.target.value }))}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:border-teal-500 focus:outline-none"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      {user?.isReturning && recommendations.length > 0 && (
        <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-inner shadow-amber-200/40">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-xl text-slate-900">
              AI-powered: Just for {user.name.split(' ')[0]}
            </h2>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Concierge Recommendations</p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {recommendations.map((item) => (
              <article
                key={item.skuId}
                className="group rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-200/80"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Momentum match</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.tagline}</p>
                <dl className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <dt>Next start</dt>
                    <dd>{formatDateTime(item.nextStart)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Delivery</dt>
                    <dd className="capitalize">{item.deliveryMode}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs font-semibold text-slate-600">Why now: {item.reason}</p>
                <button
                  onClick={() => onSelectSku(item.skuId)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-amber-200/60 transition hover:bg-amber-600"
                >
                  Compare top cohorts
                  <span aria-hidden>→</span>
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-12">
        {filteredTiles.map((category) => (
          <section key={category.id} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">{category.label}</p>
                <h2 className="mt-2 font-display text-2xl text-slate-900">{category.description}</h2>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {category.tiles.map((tile) => {
                const sku = skus.find((item) => item.id === tile.skuId)
                if (!sku) return null
                const upcoming = sortBySoonest(cohorts.filter((cohort) => cohort.skuId === sku.id)).slice(0, 2)
                return (
                  <article
                    key={tile.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-teal-200/70"
                  >
                    <div className="overflow-hidden rounded-t-3xl">
                      <div
                        className="h-48 w-full bg-cover bg-center"
                        style={{ backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.3), rgba(15,23,42,0.7)), url(${tile.coverImage})` }}
                      />
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">{sku.theme}</p>
                          <h3 className="mt-1 text-2xl font-semibold text-slate-900">{tile.name}</h3>
                          <p className="mt-2 text-sm text-slate-600">{sku.tagline}</p>
                        </div>
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600">
                          {sku.format === 'group' ? 'Group Session' : '1-to-1'}
                        </span>
                      </div>

                      <div className="grid gap-2 text-xs text-slate-500">
                        {upcoming.map((cohort) => (
                          <div
                            key={cohort.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
                          >
                            <div>
                              <p className="font-semibold text-slate-700">{formatDate(cohort.startDate)}</p>
                              <p>{getSeatsLabel(cohort)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-700">{cohort.deliveryMode.toUpperCase()}</p>
                              <p>{cohort.format === 'group' ? 'Group' : '1-to-1'} · {sku.sessionType === 'single' ? 'Single' : 'Multi'} session</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => onSelectSku(sku.id)}
                        className="w-full rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-500/40 transition hover:bg-teal-600"
                      >
                        View top options
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-inner shadow-slate-200/60">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl text-slate-900">Live from the community</h2>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Cross-discovery in motion</p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {communityMoments.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{post.author}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(post.createdAt)}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">{post.content}</p>
              {post.media && (
                <img src={post.media[0]} alt="Community highlight" className="mt-3 h-32 w-full rounded-xl object-cover" />
              )}
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

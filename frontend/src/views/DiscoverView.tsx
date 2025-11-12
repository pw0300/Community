import { useMemo, useState } from 'react'
import type { Category, Cohort, Community, RecommendationItem, SKU, SubCategory, User } from '../types'
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

  type CatalogCategory = Category & { subCategories: (SubCategory & { skus: SKU[] })[] }

  const filteredCatalog = useMemo<CatalogCategory[]>(() => {
    const startDate = dateRange.start ? new Date(dateRange.start) : null
    const endDate = dateRange.end ? new Date(dateRange.end) : null

    return categories
      .map((category) => {
        const subCategories = category.subCategories
          .map((subCategory) => {
            const subSkus = subCategory.skuIds
              .map((skuId) => skus.find((sku) => sku.id === skuId))
              .filter((sku): sku is SKU => Boolean(sku))
              .filter((sku) => {
                const upcoming = sortBySoonest(cohorts.filter((cohort) => cohort.skuId === sku.id))
                if (!upcoming.length) return false

                const matchesLocation =
                  location === 'all' ||
                  upcoming.some((cohort) => {
                    if (cohort.deliveryMode === 'online' && location === 'Online') return true
                    return cohort.location.toLowerCase().includes(location.toLowerCase())
                  })

                const matchesDelivery =
                  delivery === 'all' || sku.variants.some((variant) => variant.deliveryMode === delivery)

                const matchesDate = upcoming.some((cohort) => {
                  if (!startDate && !endDate) return true
                  const time = cohort.startDate.getTime()
                  if (startDate && time < startDate.getTime()) return false
                  if (endDate && time > endDate.getTime()) return false
                  return true
                })

                return matchesLocation && matchesDelivery && matchesDate
              })

            return { ...subCategory, skus: subSkus }
          })
          .filter((subCategory) => subCategory.skus.length > 0)

        return { ...category, subCategories }
      })
      .filter((category) => category.subCategories.length > 0)
  }, [categories, cohorts, dateRange.end, dateRange.start, delivery, location, skus])

  const communityActivations = useMemo(() => {
    return communities
      .flatMap((community) => community.upcomingEvents.map((event) => ({ community, event })))
      .sort((a, b) => a.event.startsAt.getTime() - b.event.startsAt.getTime())
      .slice(0, 4)
  }, [communities])

  const communitySignals = useMemo(() => {
    return communities
      .map((community) => community.feed[0])
      .filter((post): post is NonNullable<typeof post> => Boolean(post))
      .slice(0, 4)
  }, [communities])

  return (
    <section className="space-y-12 py-10">
      <header className="flex flex-col gap-6 rounded-3xl border border-teal-100 bg-white p-8 shadow-lg shadow-teal-500/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-500">Discover</p>
            <h1 className="mt-2 max-w-2xl font-display text-3xl text-slate-900 sm:text-4xl">
              When you decide to grow, your communities unlock the next move.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-600">
              GrowthQuest Concierge is community-first GTM: every option here is already moving inside a circle you can join.
              Compare top cohorts instantly or let the concierge hold a seat before momentum fades.
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

      {communityActivations.length > 0 && (
        <section className="rounded-3xl border border-teal-200 bg-white p-6 shadow-lg shadow-teal-500/10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-xl text-slate-900">Community activations happening now</h2>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">Community-led GTM</p>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-4">
            {communityActivations.map(({ community, event }) => (
              <article
                key={`${community.id}-${event.id}`}
                className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600"
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-teal-500">
                  {community.name}
                </p>
                <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
                <p>{event.description}</p>
                <dl className="space-y-1">
                  <div className="flex justify-between">
                    <dt>Starts</dt>
                    <dd>{formatDateTime(event.startsAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Where</dt>
                    <dd>{event.location}</dd>
                  </div>
                  {event.relatedSkuId && (
                    <div className="flex justify-between">
                      <dt>Featured SKU</dt>
                      <dd className="uppercase">{event.relatedSkuId.replace('sku-', '').split('-').join(' ')}</dd>
                    </div>
                  )}
                </dl>
                <span
                  className={`mt-2 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[0.65rem] font-semibold ${
                    event.status === 'live'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-teal-50 text-teal-600'
                  }`}
                >
                  {event.status === 'live' ? 'Live now' : 'Up next'} · {event.deliveryMode}
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-12">
        {filteredCatalog.map((category) => (
          <section key={category.id} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">{category.label}</p>
                <h2 className="mt-2 font-display text-2xl text-slate-900">{category.description}</h2>
              </div>
            </div>
            <div className="space-y-6">
              {category.subCategories.map((subCategory: SubCategory & { skus: SKU[] }) => {
                const defaultCommunity = communities.find((community) => community.id === subCategory.defaultCommunityId)
                return (
                  <article
                    key={subCategory.id}
                    className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/60"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <img
                        src={subCategory.heroImage}
                        alt=""
                        className="h-32 w-full rounded-2xl object-cover md:h-40 md:w-56"
                      />
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
                            {subCategory.label}
                          </span>
                          {defaultCommunity && (
                            <span className="rounded-full bg-teal-50 px-3 py-1 font-semibold text-teal-600">
                              Community engine: {defaultCommunity.name}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-2xl text-slate-900">{subCategory.description}</h3>
                        <p className="text-sm text-slate-600">{subCategory.narrative}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      {subCategory.skus.slice(0, 2).map((sku: SKU) => {
                        const upcoming = sortBySoonest(cohorts.filter((cohort) => cohort.skuId === sku.id)).slice(0, 2)
                        if (!upcoming.length) return null
                        const primaryVariant = sku.variants[0]
                        return (
                          <div
                            key={sku.id}
                            className="flex h-full flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600"
                          >
                            <div className="flex flex-col gap-1">
                              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">
                                {sku.theme}
                              </p>
                              <h4 className="text-lg font-semibold text-slate-900">{sku.tagline}</h4>
                            </div>
                            <p className="text-xs text-slate-500">{primaryVariant?.description ?? sku.description}</p>
                            <div className="flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold text-slate-500">
                              <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-600">
                                {primaryVariant?.deliveryMode.toUpperCase()} · {primaryVariant?.format}
                              </span>
                              <span className="rounded-full bg-slate-100 px-3 py-1">
                                {primaryVariant?.sessionType === 'single' ? 'Single session' : 'Multi-session'}
                              </span>
                              <span className="rounded-full bg-slate-100 px-3 py-1">{sku.intensity}</span>
                            </div>
                            <ul className="space-y-1 text-xs text-slate-500">
                              {primaryVariant?.highlights.slice(0, 2).map((highlight: string) => (
                                <li key={highlight} className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-teal-500" /> {highlight}
                                </li>
                              ))}
                            </ul>
                            <dl className="space-y-2 text-xs">
                              {upcoming.map((cohort) => (
                                <div key={cohort.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                                  <dt className="font-semibold text-slate-900">{formatDate(cohort.startDate)}</dt>
                                  <dd className="text-slate-500">{getSeatsLabel(cohort)}</dd>
                                </div>
                              ))}
                            </dl>
                            <button
                              onClick={() => onSelectSku(sku.id)}
                              className="mt-auto inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-teal-500/40 transition hover:bg-teal-600"
                            >
                              Compare top cohorts
                              <span aria-hidden>→</span>
                            </button>
                          </div>
                        )
                      })}
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
          {communitySignals.map((post) => (
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

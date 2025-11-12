import type { Cohort, Provider, SKU } from '../types'
import { formatCurrency, formatDateRange, formatDateTime, summariseDelivery } from '../utils'

interface ProviderGuideViewProps {
  provider: Provider
  cohorts: Cohort[]
  skus: SKU[]
}

export function ProviderGuideView({ provider, cohorts, skus }: ProviderGuideViewProps) {
  const upcoming = cohorts.filter((cohort) => cohort.providerId === provider.id)
  const totalPayout = upcoming.reduce((sum, cohort) => sum + cohort.price * Math.max(cohort.capacity - cohort.seatsLeft, 0), 0)

  return (
    <section className="space-y-8 py-10">
      <header className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white p-8 shadow-lg shadow-amber-200/60">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Provider · Guide mode</p>
        <h1 className="mt-3 font-display text-3xl text-slate-900">Welcome back, {provider.name.split(' ')[0]}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Publish new cohorts, manage comms, and keep your on-time streak thriving.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-white/80 bg-white/90 p-4 text-sm shadow-inner shadow-amber-200/40">
            <p className="text-xs text-slate-500">On-time start rate</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{Math.round(provider.onTimeStartRate * 100)}%</p>
            <p className="text-xs text-amber-500">Keep it above 95% to maintain Trusted badge.</p>
          </article>
          <article className="rounded-2xl border border-white/80 bg-white/90 p-4 text-sm shadow-inner shadow-amber-200/40">
            <p className="text-xs text-slate-500">Upcoming cohorts</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{upcoming.length}</p>
            <p className="text-xs text-slate-500">Across {new Set(upcoming.map((cohort) => cohort.skuId)).size} curated SKUs.</p>
          </article>
          <article className="rounded-2xl border border-white/80 bg-white/90 p-4 text-sm shadow-inner shadow-amber-200/40">
            <p className="text-xs text-slate-500">Projected payouts</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{formatCurrency(totalPayout)}</p>
            <p className="text-xs text-slate-500">Pending: {formatCurrency(totalPayout * 0.45)} · Completed: {formatCurrency(totalPayout * 0.55)}</p>
          </article>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl text-slate-900">Cohort management</h2>
          <button className="rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-600 shadow-sm hover:border-teal-300">
            Publish new cohort
          </button>
        </header>
        <div className="mt-4 space-y-3">
          {upcoming.map((cohort) => {
            const sku = skus.find((item) => item.id === cohort.skuId)
            return (
              <article key={cohort.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">{sku?.theme}</p>
                    <h3 className="text-lg font-semibold text-slate-900">{sku?.tagline}</h3>
                    <p className="text-xs text-slate-500">{formatDateRange(cohort.startDate, cohort.endDate, cohort.timeZone)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-white">Start cohort</button>
                    <button className="rounded-full border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-600">End cohort</button>
                  </div>
                </div>
                <dl className="mt-3 grid gap-2 text-xs text-slate-600 md:grid-cols-3">
                  <div>
                    <dt>Schedule</dt>
                    <dd>{formatDateTime(cohort.startDate, cohort.timeZone)}</dd>
                  </div>
                  <div>
                    <dt>Delivery</dt>
                    <dd>{summariseDelivery(cohort)}</dd>
                  </div>
                  <div>
                    <dt>Roster</dt>
                    <dd>{cohort.capacity - cohort.seatsLeft}/{cohort.capacity} confirmed</dd>
                  </div>
                </dl>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <button className="rounded-full border border-slate-200 px-3 py-1">Post announcement</button>
                  <button className="rounded-full border border-slate-200 px-3 py-1">Answer Q&A</button>
                  <button className="rounded-full border border-slate-200 px-3 py-1">Export roster</button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </section>
  )
}

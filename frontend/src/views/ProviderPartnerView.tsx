import type { Cohort, Provider, SKU } from '../types'
import { formatCurrency, formatDateRange, formatDateTime } from '../utils'

interface ProviderPartnerViewProps {
  provider: Provider
  cohorts: Cohort[]
  skus: SKU[]
}

export function ProviderPartnerView({ provider, cohorts, skus }: ProviderPartnerViewProps) {
  const enterpriseCohorts = cohorts.filter((cohort) => cohort.providerId === provider.id)
  const totalLearners = enterpriseCohorts.reduce((sum, cohort) => sum + (cohort.capacity - cohort.seatsLeft), 0)

  return (
    <section className="space-y-8 py-10">
      <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Provider · Partner mode</p>
        <h1 className="mt-3 font-display text-3xl text-slate-900">Enterprise dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Track enrolments, upload student rosters, and monitor cohort health in one glance.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm">
            <p className="text-xs text-slate-500">Active courses</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{enterpriseCohorts.length}</p>
          </article>
          <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm">
            <p className="text-xs text-slate-500">Learners engaged</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{totalLearners}</p>
          </article>
          <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm">
            <p className="text-xs text-slate-500">Completion rate</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">92%</p>
          </article>
          <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm">
            <p className="text-xs text-slate-500">Feedback score</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">4.8 / 5</p>
          </article>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl text-slate-900">Enrollment overview</h2>
          <div className="flex gap-2">
            <button className="rounded-full border border-teal-200 px-4 py-2 text-xs font-semibold text-teal-600">Upload roster</button>
            <button className="rounded-full border border-teal-200 px-4 py-2 text-xs font-semibold text-teal-600">Download CSV</button>
          </div>
        </header>
        <div className="mt-4 space-y-3">
          {enterpriseCohorts.map((cohort) => {
            const sku = skus.find((item) => item.id === cohort.skuId)
            return (
              <article key={cohort.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">{sku?.theme}</p>
                    <h3 className="text-lg font-semibold text-slate-900">{sku?.tagline}</h3>
                    <p className="text-xs text-slate-500">{formatDateRange(cohort.startDate, cohort.endDate, cohort.timeZone)}</p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p>{cohort.capacity - cohort.seatsLeft}/{cohort.capacity} enrolled</p>
                    <p>{formatCurrency(cohort.price)} · {formatDateTime(cohort.startDate, cohort.timeZone)}</p>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-slate-600 md:grid-cols-3">
                  <div>
                    <dt>Delivery mode</dt>
                    <dd>{cohort.deliveryMode}</dd>
                  </div>
                  <div>
                    <dt>Session type</dt>
                    <dd>{cohort.sessionType}</dd>
                  </div>
                  <div>
                    <dt>Format</dt>
                    <dd>{cohort.format}</dd>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <h2 className="font-display text-xl text-slate-900">Insights</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
            <h3 className="text-sm font-semibold text-slate-900">Engagement agent summary</h3>
            <p className="mt-2">AI prompts kept discussion active every 32 minutes across cohorts this week.</p>
          </article>
          <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
            <h3 className="text-sm font-semibold text-slate-900">Top cohort</h3>
            <p className="mt-2">{enterpriseCohorts[0] ? skus.find((sku) => sku.id === enterpriseCohorts[0].skuId)?.theme : 'TBD'} with 98% completion.</p>
          </article>
          <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
            <h3 className="text-sm font-semibold text-slate-900">Feedback trend</h3>
            <p className="mt-2">Learners cite “clarity of expectations” as the top strength three cohorts running.</p>
          </article>
        </div>
      </section>
    </section>
  )
}

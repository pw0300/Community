import type { Cohort, Provider, SKU } from '../types'
import { formatCurrency, formatDateRange, formatDateTime, getSeatsLabel, summariseDelivery } from '../utils'

interface DecisionViewProps {
  sku: SKU
  cohorts: Cohort[]
  providers: Provider[]
  onSelectCohort: (cohortId: string) => void
  onCompare: () => void
  comparing: boolean
  onCloseCompare: () => void
}

export function DecisionView({ sku, cohorts, providers, onSelectCohort, onCompare, comparing, onCloseCompare }: DecisionViewProps) {
  const topCohorts = cohorts.slice(0, 2)
  const primaryVariant = sku.variants[0]
  const comparisonVariants = sku.variants.slice(0, 2)

  return (
    <section className="space-y-10 py-10">
      <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/80">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">Decide</p>
        <h1 className="mt-3 font-display text-3xl text-slate-900">{sku.theme}: {sku.tagline}</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">{sku.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600">
            {(primaryVariant?.deliveryMode ?? sku.deliveryMode).toUpperCase()}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {primaryVariant?.format ?? sku.format}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {(primaryVariant?.sessionType ?? sku.sessionType) === 'single' ? 'Single session' : 'Multi-session'}
          </span>
          <button
            onClick={onCompare}
            className="ml-auto rounded-full border border-teal-200 px-4 py-2 text-xs font-semibold text-teal-600 shadow-sm hover:border-teal-400 hover:text-teal-700"
          >
            Compare options
          </button>
        </div>
        {comparisonVariants.length > 0 && (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {comparisonVariants.map((variant) => (
              <div key={variant.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-teal-500">Variant</p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">{variant.name}</h3>
                <p className="mt-2 text-slate-600">{variant.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1 text-teal-600">{variant.deliveryMode.toUpperCase()}</span>
                  <span className="rounded-full bg-white px-3 py-1">{variant.format}</span>
                  <span className="rounded-full bg-white px-3 py-1">{variant.sessionType === 'single' ? 'Single' : 'Multi'} session</span>
                </div>
                <ul className="mt-3 space-y-1 text-[0.65rem] text-slate-500">
                  {variant.highlights.slice(0, 3).map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-teal-500" /> {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {topCohorts.map((cohort) => {
          const provider = providers.find((item) => item.id === cohort.providerId)
          return (
            <article
              key={cohort.id}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80"
            >
              <header className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{provider?.name ?? 'Provider'}</h2>
                  <p className="text-sm text-slate-500">{provider?.headline}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 font-semibold text-teal-600">
                      <span className="h-2 w-2 rounded-full bg-teal-500" /> On-time start {Math.round((provider?.onTimeStartRate ?? 0) * 100)}%
                    </span>
                    {provider?.trusted && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700">
                        <span aria-hidden>★</span> Trusted Provider
                      </span>
                    )}
                  </div>
                </div>
                <img src={provider?.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
              </header>

              <dl className="grid gap-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <dt className="font-semibold text-slate-900">{formatDateRange(cohort.startDate, cohort.endDate, cohort.timeZone)}</dt>
                  <dd className="text-xs text-slate-500">{formatDateTime(cohort.startDate, cohort.timeZone)}</dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <dt>{summariseDelivery(cohort)}</dt>
                  <dd className="font-semibold text-slate-900">{formatCurrency(cohort.price)}</dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <dt className="text-teal-600">{getSeatsLabel(cohort)}</dt>
                  <dd className="text-xs text-slate-500">Capacity {cohort.capacity}</dd>
                </div>
                {cohort.weatherOutlook && (
                  <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
                    <dt>Weather outlook</dt>
                    <dd>{cohort.weatherOutlook}</dd>
                  </div>
                )}
              </dl>

              <ul className="space-y-2 text-xs text-slate-500">
                {cohort.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-500" /> {perk}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectCohort(cohort.id)}
                className={`w-full rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition ${
                  cohort.seatsLeft > 0
                    ? 'bg-teal-500 text-white shadow-teal-500/40 hover:bg-teal-600'
                    : 'bg-slate-200 text-slate-500 shadow-none'
                }`}
              >
                {cohort.seatsLeft > 0 ? 'Hold seat' : 'Join waitlist'}
              </button>
            </article>
          )
        })}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-inner shadow-slate-200/80">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl text-slate-900">From the community</h2>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Proof in motion</p>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {sku.communityHighlights.map((highlight) => (
            <article key={highlight.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <img src={highlight.image} alt="" className="h-36 w-full object-cover" />
              <div className="space-y-2 p-4 text-sm text-slate-600">
                <h3 className="text-base font-semibold text-slate-900">{highlight.title}</h3>
                <p>{highlight.description}</p>
              </div>
            </article>
          ))}
        </div>
        <dl className="mt-6 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
          {sku.qa.map((item) => (
            <div key={item.question} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">{item.question}</dt>
              <dd className="mt-2 text-slate-700">{item.answer}</dd>
              <p className="mt-3 text-xs font-semibold text-slate-500">— {item.answeredBy}</p>
            </div>
          ))}
        </dl>
      </section>

      {comparing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-6">
          <div className="w-full max-w-4xl space-y-6 rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-slate-900">Side-by-side comparison</h2>
              <button onClick={onCloseCompare} className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                Close
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {topCohorts.map((cohort) => {
                const provider = providers.find((item) => item.id === cohort.providerId)
                return (
                  <div key={cohort.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                    <h3 className="text-lg font-semibold text-slate-900">{provider?.name}</h3>
                    <p className="text-xs text-slate-500">{provider?.headline}</p>
                    <dl className="mt-3 space-y-2">
                      <div className="flex justify-between">
                        <dt>Price</dt>
                        <dd>{formatCurrency(cohort.price)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Schedule</dt>
                        <dd>{formatDateRange(cohort.startDate, cohort.endDate, cohort.timeZone)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Location</dt>
                        <dd>{cohort.location}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Weather</dt>
                        <dd>{cohort.weatherOutlook ?? '—'}</dd>
                      </div>
                    </dl>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

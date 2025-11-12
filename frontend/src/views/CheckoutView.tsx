import type { AddOn, BundleSuggestion, Cohort, Provider, SKU } from '../types'
import { formatCurrency, formatDateTime, summariseDelivery } from '../utils'
import { CountdownTimer } from '../components/CountdownTimer'

interface CheckoutViewProps {
  cohort: Cohort
  sku: SKU
  provider: Provider
  selectedAddOnIds: string[]
  onToggleAddOn: (addOnId: string) => void
  onConfirm: () => void
  expiresAt: Date
  onExpire: () => void
  bundleSuggestion: BundleSuggestion | null
}

export function CheckoutView({
  cohort,
  sku,
  provider,
  selectedAddOnIds,
  onToggleAddOn,
  onConfirm,
  expiresAt,
  onExpire,
  bundleSuggestion,
}: CheckoutViewProps) {
  const computeTotal = (addOns: AddOn[]) => {
    const addOnTotal = addOns.filter((addOn) => selectedAddOnIds.includes(addOn.id)).reduce((sum, addOn) => sum + addOn.price, 0)
    return cohort.price + addOnTotal
  }

  return (
    <section className="space-y-8 py-10">
      <header className="flex flex-col gap-4 rounded-3xl border border-teal-200 bg-white p-8 shadow-lg shadow-teal-500/10">
        <div className="flex flex-wrap items-center gap-4">
          <CountdownTimer expiresAt={expiresAt} onExpire={onExpire} />
          <span className="rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-white">Seats held · 1</span>
          <p className="text-xs text-slate-500">We protect your seat across cohorts for 15 minutes while you confirm.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">Commit</p>
          <h1 className="mt-2 font-display text-3xl text-slate-900">{sku.theme} · {provider.name}</h1>
          <p className="mt-2 text-sm text-slate-600">{summariseDelivery(cohort)}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <h2 className="font-semibold text-slate-900">Cohort overview</h2>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <dt>Date</dt>
                <dd className="font-semibold text-slate-900">{formatDateTime(cohort.startDate, cohort.timeZone)}</dd>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <dt>Location</dt>
                <dd>{cohort.location}</dd>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <dt>Price</dt>
                <dd className="font-semibold text-slate-900">{formatCurrency(cohort.price)}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <header className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Add-ons</h2>
              <p className="text-xs text-slate-500">Optional boosts, curated for this cohort.</p>
            </header>
            <div className="mt-4 space-y-3">
              {sku.addOns.map((addOn) => {
                const selected = selectedAddOnIds.includes(addOn.id)
                return (
                  <label
                    key={addOn.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                      selected
                        ? 'border-teal-400 bg-teal-50 shadow-inner shadow-teal-200/60'
                        : 'border-slate-200 bg-white hover:border-teal-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggleAddOn(addOn.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{addOn.name}</p>
                      <p className="text-sm text-slate-600">{addOn.description}</p>
                      <p className="mt-1 text-sm font-semibold text-teal-600">{formatCurrency(addOn.price)}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </article>
        </section>

        <aside className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <h2 className="font-semibold text-slate-900">Total</h2>
            <p className="mt-1 text-sm text-slate-500">Includes seat hold and selected add-ons.</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(computeTotal(sku.addOns))}</p>
            <button
              onClick={onConfirm}
              className="mt-6 w-full rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-500/40 transition hover:bg-teal-600"
            >
              Confirm & enter cohort room
            </button>
          </article>

          {bundleSuggestion && (
            <article className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white p-6 shadow-lg shadow-amber-200/60">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">AI bundle</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{bundleSuggestion.narrative}</h3>
              <p className="mt-2 text-sm text-slate-600">
                Add <span className="font-semibold">{bundleSuggestion.suggestedSkuId.replace('sku-', '').replace('-', ' ')}</span> to save
                {bundleSuggestion.discountPercentage}% and unlock the connected community instantly.
              </p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-amber-600 shadow-sm hover:border-amber-300 hover:text-amber-700">
                Preview bundle
                <span aria-hidden>→</span>
              </button>
            </article>
          )}
        </aside>
      </div>
    </section>
  )
}

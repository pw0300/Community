import type { ActivityRecord, RecommendationItem, SKU, User } from '../types'
import { formatDateRange, formatDateTime, formatRelativeTime } from '../utils'

interface ActivitiesHubProps {
  user: User
  skus: SKU[]
  onEnterCohort: (cohortId: string) => void
  onExploreSku: (skuId: string) => void
  nextSteps: RecommendationItem[]
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
    <h2 className="font-display text-xl text-slate-900">{title}</h2>
    {children}
  </section>
)

const ActivityCard = ({ activity, cta }: { activity: ActivityRecord; cta?: React.ReactNode }) => (
  <article className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
    <header className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-lg font-semibold text-slate-900">{activity.title}</h3>
      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600 capitalize">{activity.status}</span>
    </header>
    <dl className="grid gap-1 text-sm text-slate-600">
      <div className="flex justify-between">
        <dt>Schedule</dt>
        <dd>{formatDateRange(activity.startDate, activity.endDate)}</dd>
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <dt>Mode</dt>
        <dd>{activity.deliveryMode} · {activity.format}</dd>
      </div>
    </dl>
    {cta}
  </article>
)

export function ActivitiesHub({ user, onEnterCohort, onExploreSku, nextSteps }: ActivitiesHubProps) {
  return (
    <section className="space-y-8 py-10">
      <header className="rounded-3xl border border-teal-200 bg-white p-8 shadow-lg shadow-teal-500/10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">Attend & Reflect</p>
        <h1 className="mt-3 font-display text-3xl text-slate-900">My activities hub</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Upcoming commitments, waitlist pulse, and alumni assets all in one command centre.
        </p>
      </header>

      <Section title="Upcoming">
        <div className="grid gap-4 md:grid-cols-2">
          {user.upcomingActivities.map((activity) => (
            <ActivityCard
              key={activity.cohortId}
              activity={activity}
              cta={
                <button
                  onClick={() => onEnterCohort(activity.cohortId)}
                  className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-teal-500/40"
                >
                  Enter cohort room
                </button>
              }
            />
          ))}
        </div>
      </Section>

      <Section title="Waitlisted">
        {user.waitlistedActivities.length === 0 ? (
          <p className="text-sm text-slate-500">No waitlists. Ask the concierge to scout a new date.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {user.waitlistedActivities.map((activity) => (
              <ActivityCard
                key={activity.cohortId}
                activity={activity}
                cta={<p className="text-xs text-slate-500">{formatRelativeTime(activity.startDate)} · you’re #3 in line</p>}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Past experiences">
        {user.pastActivities.length === 0 ? (
          <p className="text-sm text-slate-500">Your reflection archive will appear here after your first program.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {user.pastActivities.map((activity) => (
              <article key={activity.cohortId} className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <header className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{activity.title}</h3>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Alumni</span>
                </header>
                <p className="text-xs text-slate-500">Wrapped {formatDateTime(activity.endDate)}</p>
                {activity.gallery && (
                  <div className="grid grid-cols-3 gap-2">
                    {activity.gallery.map((image, index) => (
                      <img key={index} src={image} alt="" className="h-20 w-full rounded-lg object-cover" />
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <button className="rounded-full bg-teal-500 px-4 py-2 font-semibold text-white shadow-teal-500/30">Download certificate</button>
                  <button className="rounded-full border border-teal-200 px-4 py-2 font-semibold text-teal-600 hover:border-teal-400">
                    Refer a friend
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white p-6 shadow-lg shadow-amber-200/60">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl text-slate-900">AI-powered: What’s next?</h2>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Momentum suggestions</p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {nextSteps.map((item) => (
            <article key={item.skuId} className="rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.tagline}</p>
              <p className="mt-2 text-xs font-semibold text-slate-500">Why now: {item.reason}</p>
              <p className="mt-2 text-xs text-slate-500">Next start {formatDateTime(item.nextStart)}</p>
              <button
                onClick={() => onExploreSku(item.skuId)}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-amber-200/70"
              >
                Review top options
                <span aria-hidden>→</span>
              </button>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

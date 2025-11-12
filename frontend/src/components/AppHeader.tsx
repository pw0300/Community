import type { AppMode, AppView, ProviderView } from '../types'

interface AppHeaderProps {
  mode: AppMode
  currentView: AppView
  onNavigate: (view: AppView) => void
  onModeChange: (mode: AppMode) => void
  providerView: ProviderView
  onProviderViewChange: (view: ProviderView) => void
}

const seekerTabs: { id: AppView; label: string }[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'activities', label: 'My Activities' },
  { id: 'community', label: 'Community Hub' },
]

const providerTabs: { id: ProviderView; label: string }[] = [
  { id: 'guide', label: 'Guide Mode' },
  { id: 'partner', label: 'Partner Mode' },
]

export function AppHeader({
  mode,
  currentView,
  onNavigate,
  onModeChange,
  providerView,
  onProviderViewChange,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-teal-100/40 bg-white/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal-500 text-lg font-semibold text-white shadow-lg shadow-teal-500/40">
              GQ
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
                GrowthQuest Concierge
              </p>
              <p className="text-xs text-slate-500">Action-led marketplace for seekers & providers</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-1 py-1 text-xs font-semibold text-slate-600">
            <button
              className={`rounded-full px-3 py-1 transition ${
                mode === 'seeker' ? 'bg-white text-teal-600 shadow-sm shadow-teal-200' : 'hover:text-teal-500'
              }`}
              onClick={() => onModeChange('seeker')}
            >
              Seeker
            </button>
            <button
              className={`rounded-full px-3 py-1 transition ${
                mode === 'provider' ? 'bg-white text-teal-600 shadow-sm shadow-teal-200' : 'hover:text-teal-500'
              }`}
              onClick={() => onModeChange('provider')}
            >
              Provider
            </button>
          </div>
        </div>

        {mode === 'seeker' ? (
          <nav className="flex flex-wrap items-center gap-2 lg:gap-4">
            {seekerTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  currentView === tab.id
                    ? 'border-teal-500 bg-teal-500 text-white shadow-card'
                    : 'border-transparent bg-slate-100 text-slate-600 hover:border-teal-200 hover:text-teal-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        ) : (
          <nav className="flex flex-wrap items-center gap-2 lg:gap-4">
            {providerTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onProviderViewChange(tab.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  providerView === tab.id
                    ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-200/60'
                    : 'border-transparent bg-slate-100 text-slate-600 hover:border-amber-200 hover:text-amber-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

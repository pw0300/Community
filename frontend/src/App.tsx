import { useEffect, useMemo, useReducer } from 'react'
import type {
  ActivityRecord,
  AppMode,
  AppView,
  BundleSuggestion,
  Category,
  Cohort,
  Community,
  ConciergeAction,
  Provider,
  ProviderView,
  RecommendationItem,
  SKU,
  User,
} from './types'
import { mockApi } from './mockApi'
import { geminiService } from './geminiService'
import { generateHoldExpiry } from './utils'
import { AppHeader } from './components/AppHeader'
import { ConciergeAgent } from './components/ConciergeAgent'
import { DiscoverView } from './views/DiscoverView'
import { DecisionView } from './views/DecisionView'
import { CheckoutView } from './views/CheckoutView'
import { CohortRoomView } from './views/CohortRoomView'
import { ActivitiesHub } from './views/ActivitiesHub'
import { CommunityHub } from './views/CommunityHub'
import { ProviderGuideView } from './views/ProviderGuideView'
import { ProviderPartnerView } from './views/ProviderPartnerView'

interface CheckoutState {
  cohortId: string
  addOnIds: string[]
  expiresAt: Date
}

interface AppState {
  mode: AppMode
  providerView: ProviderView
  view: AppView
  categories: Category[]
  skus: SKU[]
  cohorts: Cohort[]
  providers: Provider[]
  communities: Community[]
  user: User | null
  selectedSkuId?: string
  selectedCohortId?: string
  checkout?: CheckoutState
  compareOpen: boolean
  conciergeAction?: ConciergeAction
  recommendations: RecommendationItem[]
  nextActivities: RecommendationItem[]
  activeCommunityId?: string
  aiBusy: boolean
  bundleSuggestion?: BundleSuggestion | null
}

type Action =
  | { type: 'SET_DATA'; payload: { categories: Category[]; skus: SKU[]; cohorts: Cohort[]; providers: Provider[]; communities: Community[]; user: User } }
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'SET_MODE'; payload: AppMode }
  | { type: 'SET_PROVIDER_VIEW'; payload: ProviderView }
  | { type: 'SELECT_SKU'; payload?: string }
  | { type: 'SELECT_COHORT'; payload?: string }
  | { type: 'SET_COMPARE'; payload: boolean }
  | { type: 'START_CHECKOUT'; payload: CheckoutState }
  | { type: 'RESET_CHECKOUT' }
  | { type: 'UPDATE_ADDONS'; payload: string[] }
  | { type: 'SET_CONCIERGE'; payload?: ConciergeAction }
  | { type: 'SET_RECOMMENDATIONS'; payload: RecommendationItem[] }
  | { type: 'SET_NEXT_ACTIVITIES'; payload: RecommendationItem[] }
  | { type: 'SET_ACTIVE_COMMUNITY'; payload: string }
  | { type: 'ADD_COMMUNITY_POST'; payload: { communityId: string; post: Community['feed'][number] } }
  | { type: 'UPDATE_COHORT'; payload: Cohort }
  | { type: 'SET_USER'; payload: User }
  | { type: 'COMPLETE_CHECKOUT'; payload: ActivityRecord }
  | { type: 'JOIN_WAITLIST'; payload: ActivityRecord }
  | { type: 'SET_AI_BUSY'; payload: boolean }
  | { type: 'SET_BUNDLE'; payload: BundleSuggestion | null }

const initialState: AppState = {
  mode: 'seeker',
  providerView: 'guide',
  view: 'discover',
  categories: [],
  skus: [],
  cohorts: [],
  providers: [],
  communities: [],
  user: null,
  compareOpen: false,
  recommendations: [],
  nextActivities: [],
  aiBusy: false,
  bundleSuggestion: null,
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_DATA': {
      const activeCommunityId = action.payload.user.joinedCommunityIds[0] ?? action.payload.communities[0]?.id
      return {
        ...state,
        categories: action.payload.categories,
        skus: action.payload.skus,
        cohorts: action.payload.cohorts,
        providers: action.payload.providers,
        communities: action.payload.communities,
        user: action.payload.user,
        activeCommunityId,
      }
    }
    case 'SET_VIEW':
      return { ...state, view: action.payload }
    case 'SET_MODE':
      return { ...state, mode: action.payload, view: action.payload === 'provider' ? state.view : state.view === 'cohort' ? 'activities' : state.view }
    case 'SET_PROVIDER_VIEW':
      return { ...state, providerView: action.payload }
    case 'SELECT_SKU':
      return { ...state, selectedSkuId: action.payload }
    case 'SELECT_COHORT':
      return { ...state, selectedCohortId: action.payload }
    case 'SET_COMPARE':
      return { ...state, compareOpen: action.payload }
    case 'START_CHECKOUT':
      return { ...state, checkout: action.payload }
    case 'RESET_CHECKOUT':
      return { ...state, checkout: undefined, bundleSuggestion: null }
    case 'UPDATE_ADDONS':
      return state.checkout ? { ...state, checkout: { ...state.checkout, addOnIds: action.payload } } : state
    case 'SET_CONCIERGE':
      return { ...state, conciergeAction: action.payload }
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload }
    case 'SET_NEXT_ACTIVITIES':
      return { ...state, nextActivities: action.payload }
    case 'SET_ACTIVE_COMMUNITY':
      return { ...state, activeCommunityId: action.payload }
    case 'ADD_COMMUNITY_POST': {
      const communities = state.communities.map((community) =>
        community.id === action.payload.communityId
          ? { ...community, feed: [action.payload.post, ...community.feed] }
          : community,
      )
      return { ...state, communities }
    }
    case 'UPDATE_COHORT': {
      const cohorts = state.cohorts.map((cohort) => (cohort.id === action.payload.id ? action.payload : cohort))
      return { ...state, cohorts }
    }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'COMPLETE_CHECKOUT': {
      if (!state.user) return state
      const updatedUser: User = {
        ...state.user,
        upcomingActivities: [action.payload, ...state.user.upcomingActivities],
        joinedCommunityIds: state.selectedSkuId
          ? Array.from(
              new Set([
                ...state.user.joinedCommunityIds,
                ...state.communities
                  .filter((community) => community.relatedSkuIds.includes(state.selectedSkuId!))
                  .map((community) => community.id),
              ]),
            )
          : state.user.joinedCommunityIds,
      }
      return { ...state, user: updatedUser }
    }
    case 'JOIN_WAITLIST': {
      if (!state.user) return state
      const exists = state.user.waitlistedActivities.some((item) => item.cohortId === action.payload.cohortId)
      if (exists) return state
      const updatedUser: User = {
        ...state.user,
        waitlistedActivities: [action.payload, ...state.user.waitlistedActivities],
      }
      return { ...state, user: updatedUser }
    }
    case 'SET_AI_BUSY':
      return { ...state, aiBusy: action.payload }
    case 'SET_BUNDLE':
      return { ...state, bundleSuggestion: action.payload }
    default:
      return state
  }
}

function createActivityRecord(cohort: Cohort, sku: SKU, status: ActivityRecord['status']): ActivityRecord {
  return {
    cohortId: cohort.id,
    skuId: sku.id,
    title: sku.theme,
    startDate: cohort.startDate,
    endDate: cohort.endDate,
    status,
    deliveryMode: cohort.deliveryMode,
    format: cohort.format,
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    async function load() {
      const [categories, skus, cohorts, providers, communities, user] = await Promise.all([
        mockApi.getCategories(),
        mockApi.getSkus(),
        mockApi.getCohorts(),
        mockApi.getProviders(),
        mockApi.getCommunities(),
        mockApi.getUserProfile(),
      ])
      dispatch({ type: 'SET_DATA', payload: { categories, skus, cohorts, providers, communities, user } })
      const [rail, next] = await Promise.all([
        geminiService.getPersonalisedRail(user),
        geminiService.getNextActivitySuggestions(user),
      ])
      dispatch({ type: 'SET_RECOMMENDATIONS', payload: rail })
      dispatch({ type: 'SET_NEXT_ACTIVITIES', payload: next })
    }

    load()
  }, [])

  const selectedSku = useMemo(() => state.skus.find((sku) => sku.id === state.selectedSkuId), [state.selectedSkuId, state.skus])
  const selectedCohort = useMemo(
    () => state.cohorts.find((cohort) => cohort.id === state.selectedCohortId),
    [state.selectedCohortId, state.cohorts],
  )

  const viewCohorts = useMemo(() => {
    if (!selectedSku) return []
    return state.cohorts
      .filter((cohort) => cohort.skuId === selectedSku.id)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }, [selectedSku, state.cohorts])

  const conciergeHold = async (cohortId: string) => {
    const cohort = state.cohorts.find((item) => item.id === cohortId)
    if (!cohort) return
    try {
      dispatch({ type: 'SET_AI_BUSY', payload: true })
      const updated = await mockApi.holdSeat(cohortId)
      dispatch({ type: 'UPDATE_COHORT', payload: updated })
      dispatch({ type: 'SELECT_SKU', payload: updated.skuId })
      dispatch({ type: 'SELECT_COHORT', payload: updated.id })
      dispatch({ type: 'START_CHECKOUT', payload: { cohortId: updated.id, addOnIds: [], expiresAt: generateHoldExpiry() } })
      dispatch({ type: 'SET_VIEW', payload: 'checkout' })
      const bundle = await geminiService.getBundleSuggestion(updated.skuId)
      dispatch({ type: 'SET_BUNDLE', payload: bundle })
    } catch (error) {
      console.error(error)
    } finally {
      dispatch({ type: 'SET_AI_BUSY', payload: false })
    }
  }

  const conciergeWaitlist = async (cohortId: string) => {
    const cohort = state.cohorts.find((item) => item.id === cohortId)
    if (!cohort) return
    const sku = state.skus.find((item) => item.id === cohort.skuId)
    if (!sku) return
    await mockApi.joinWaitlist(cohortId)
    dispatch({ type: 'JOIN_WAITLIST', payload: createActivityRecord(cohort, sku, 'waitlisted') })
    dispatch({ type: 'SET_VIEW', payload: 'activities' })
  }

  const handleSelectCohort = async (cohortId: string) => {
    const cohort = state.cohorts.find((item) => item.id === cohortId)
    if (!cohort) return
    dispatch({ type: 'SELECT_COHORT', payload: cohort.id })
    dispatch({ type: 'SELECT_SKU', payload: cohort.skuId })
    if (cohort.seatsLeft <= 0) {
      await conciergeWaitlist(cohortId)
      dispatch({
        type: 'SET_CONCIERGE',
        payload: { action: 'joinWaitlist', cohortId, rationale: 'Added to waitlist automatically.' },
      })
      return
    }
    await conciergeHold(cohortId)
  }

  const handleConciergeInterpretation = async (message: string) => {
    const fallbackCohort = state.selectedCohortId
    const action = await geminiService.conciergeIntent(message, fallbackCohort)
    dispatch({ type: 'SET_CONCIERGE', payload: action })
    if (action.action === 'holdSeat' && action.cohortId) {
      await conciergeHold(action.cohortId)
    }
    if (action.action === 'joinWaitlist' && action.cohortId) {
      await conciergeWaitlist(action.cohortId)
    }
    return action
  }

  const handleAddOnToggle = (addOnId: string) => {
    if (!state.checkout) return
    const current = new Set(state.checkout.addOnIds)
    if (current.has(addOnId)) {
      current.delete(addOnId)
    } else {
      current.add(addOnId)
    }
    dispatch({ type: 'UPDATE_ADDONS', payload: Array.from(current) })
  }

  const handleCheckoutExpire = () => {
    dispatch({ type: 'RESET_CHECKOUT' })
  }

  const handleConfirmCheckout = () => {
    if (!state.checkout || !selectedSku || !selectedCohort) return
    const activity = createActivityRecord(selectedCohort, selectedSku, 'upcoming')
    dispatch({ type: 'COMPLETE_CHECKOUT', payload: activity })
    dispatch({ type: 'RESET_CHECKOUT' })
    dispatch({ type: 'SET_VIEW', payload: 'cohort' })
  }

  const handleCommunityPost = async (communityId: string, content: string) => {
    const post = await mockApi.postCommunityMessage(communityId, content)
    dispatch({ type: 'ADD_COMMUNITY_POST', payload: { communityId, post } })
  }

  const handleAiPulse = async (communityId: string) => {
    dispatch({ type: 'SET_AI_BUSY', payload: true })
    try {
      const community = state.communities.find((item) => item.id === communityId)
      if (!community) return
      const post = await geminiService.getCommunityEngagementPost(community)
      dispatch({ type: 'ADD_COMMUNITY_POST', payload: { communityId, post } })
    } finally {
      dispatch({ type: 'SET_AI_BUSY', payload: false })
    }
  }

  const activeProvider = state.providers[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-24">
      <AppHeader
        mode={state.mode}
        currentView={state.view}
        onNavigate={(view) => dispatch({ type: 'SET_VIEW', payload: view })}
        onModeChange={(mode) => dispatch({ type: 'SET_MODE', payload: mode })}
        providerView={state.providerView}
        onProviderViewChange={(view) => dispatch({ type: 'SET_PROVIDER_VIEW', payload: view })}
      />

      <main className="mx-auto mt-10 w-full max-w-7xl px-6">
        {state.mode === 'seeker' && state.view === 'discover' && (
          <DiscoverView
            categories={state.categories}
            skus={state.skus}
            cohorts={state.cohorts}
            communities={state.communities}
            user={state.user}
            onSelectSku={(skuId) => {
              dispatch({ type: 'SELECT_SKU', payload: skuId })
              dispatch({ type: 'SET_VIEW', payload: 'decision' })
              dispatch({ type: 'SET_COMPARE', payload: false })
            }}
            recommendations={state.recommendations}
          />
        )}

        {state.mode === 'seeker' && state.view === 'decision' && selectedSku && (
          <DecisionView
            sku={selectedSku}
            cohorts={viewCohorts}
            providers={state.providers}
            onSelectCohort={handleSelectCohort}
            onCompare={() => dispatch({ type: 'SET_COMPARE', payload: true })}
            comparing={state.compareOpen}
            onCloseCompare={() => dispatch({ type: 'SET_COMPARE', payload: false })}
          />
        )}

        {state.mode === 'seeker' && state.view === 'checkout' && state.checkout && selectedSku && selectedCohort && (
          <CheckoutView
            cohort={selectedCohort}
            sku={selectedSku}
            provider={state.providers.find((provider) => provider.id === selectedCohort.providerId)!}
            selectedAddOnIds={state.checkout.addOnIds}
            onToggleAddOn={handleAddOnToggle}
            onConfirm={handleConfirmCheckout}
            expiresAt={state.checkout.expiresAt}
            onExpire={handleCheckoutExpire}
            bundleSuggestion={state.bundleSuggestion ?? null}
          />
        )}

        {state.mode === 'seeker' && state.view === 'cohort' && selectedCohort && selectedSku && (
          <CohortRoomView
            cohort={selectedCohort}
            sku={selectedSku}
            provider={state.providers.find((provider) => provider.id === selectedCohort.providerId)!}
            onBack={() => dispatch({ type: 'SET_VIEW', payload: 'activities' })}
          />
        )}

        {state.mode === 'seeker' && state.view === 'activities' && state.user && (
          <ActivitiesHub
            user={state.user}
            skus={state.skus}
            onEnterCohort={(cohortId) => {
              dispatch({ type: 'SELECT_COHORT', payload: cohortId })
              dispatch({ type: 'SET_VIEW', payload: 'cohort' })
            }}
            onExploreSku={(skuId) => {
              dispatch({ type: 'SELECT_SKU', payload: skuId })
              dispatch({ type: 'SET_VIEW', payload: 'decision' })
            }}
            nextSteps={state.nextActivities}
          />
        )}

        {state.mode === 'seeker' && state.view === 'community' && (
          <CommunityHub
            communities={state.communities}
            activeCommunityId={state.activeCommunityId}
            onSelectCommunity={(communityId) => dispatch({ type: 'SET_ACTIVE_COMMUNITY', payload: communityId })}
            onCreatePost={handleCommunityPost}
            onAiPulse={handleAiPulse}
          />
        )}

        {state.mode === 'provider' && state.providerView === 'guide' && activeProvider && (
          <ProviderGuideView provider={activeProvider} cohorts={state.cohorts} skus={state.skus} />
        )}

        {state.mode === 'provider' && state.providerView === 'partner' && activeProvider && (
          <ProviderPartnerView provider={activeProvider} cohorts={state.cohorts} skus={state.skus} />
        )}
      </main>

      {state.mode === 'seeker' && (
        <ConciergeAgent
          interpretMessage={handleConciergeInterpretation}
          onAction={(action) => dispatch({ type: 'SET_CONCIERGE', payload: action })}
          busy={state.aiBusy}
          lastAction={state.conciergeAction}
        />
      )}
    </div>
  )
}

export default App

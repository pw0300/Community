export type DeliveryMode = 'online' | 'offline' | 'mixed'
export type SessionFormat = '1-to-1' | 'group'
export type SessionType = 'single' | 'multi'
export type AppView =
  | 'discover'
  | 'decision'
  | 'checkout'
  | 'cohort'
  | 'activities'
  | 'community'
export type AppMode = 'seeker' | 'provider'
export type ProviderView = 'guide' | 'partner'

export type OctalysisDrive =
  | 'epicMeaning'
  | 'accomplishment'
  | 'empowerment'
  | 'ownership'
  | 'socialInfluence'
  | 'scarcity'
  | 'unpredictability'
  | 'avoidance'

export interface GamificationBadge {
  id: string
  title: string
  description: string
  drive: OctalysisDrive
  earnedAt: Date
}

export interface GamifiedQuest {
  id: string
  title: string
  description: string
  drive: OctalysisDrive
  progress: number
  target: number
  reward: string
  status: 'active' | 'completed'
  expiresAt: Date
}

export interface UserGamificationState {
  level: number
  xp: number
  nextLevelXp: number
  streakDays: number
  energy: number
  focusDrive: OctalysisDrive
  badges: GamificationBadge[]
  questLog: GamifiedQuest[]
}

export interface CommunityGamificationState {
  synergyScore: number
  questOfWeek: GamifiedQuest
  leaderBoard: { memberName: string; score: number; drive: OctalysisDrive }[]
  driveSpotlights: { drive: OctalysisDrive; narrative: string }[]
  scarcityCountdown?: { label: string; endsAt: Date }
}

export interface Provider {
  id: string
  name: string
  avatar: string
  headline: string
  onTimeStartRate: number
  trusted: boolean
  specialties: string[]
  bio: string
  homeBase: string
}

export interface AddOn {
  id: string
  name: string
  description: string
  price: number
}

export interface SkuVariant {
  id: string
  skuId: string
  name: string
  description: string
  heroImage: string
  deliveryMode: DeliveryMode
  format: SessionFormat
  sessionType: SessionType
  highlights: string[]
  upcomingCohortIds: string[]
}

export interface SubCategory {
  id: string
  label: string
  description: string
  narrative: string
  heroImage: string
  skuIds: string[]
  defaultCommunityId?: string
}

export interface Cohort {
  id: string
  skuId: string
  providerId: string
  startDate: Date
  endDate: Date
  location: string
  timeZone: string
  price: number
  capacity: number
  seatsLeft: number
  deliveryMode: DeliveryMode
  format: SessionFormat
  sessionType: SessionType
  perks: string[]
  weatherOutlook?: string
}

export interface CommunityHighlight {
  id: string
  title: string
  description: string
  image: string
}

export interface CommunityQA {
  question: string
  answer: string
  answeredBy: string
}

export interface SKU {
  id: string
  categoryId: string
  subCategoryId: string
  theme: string
  tagline: string
  description: string
  heroImage: string
  deliveryMode: DeliveryMode
  format: SessionFormat
  sessionType: SessionType
  intensity: 'introductory' | 'intermediate' | 'advanced'
  upcomingCohortIds: string[]
  relatedCommunityIds: string[]
  addOns: AddOn[]
  communityHighlights: CommunityHighlight[]
  qa: CommunityQA[]
  bundleTargets: string[]
  variants: SkuVariant[]
}

export interface Category {
  id: string
  label: string
  description: string
  themeColor: string
  subCategories: SubCategory[]
}

export interface CommunityPost {
  id: string
  author: string
  authorType: 'member' | 'provider' | 'ai-agent'
  avatar: string
  createdAt: Date
  content: string
  media?: string[]
  poll?: {
    prompt: string
    options: { id: string; label: string; votes: number }[]
  }
  spotlightMemberId?: string
}

export interface Community {
  id: string
  name: string
  description: string
  coverImage: string
  members: number
  activeNow: number
  feed: CommunityPost[]
  relatedSkuIds: string[]
  memberIds: string[]
  upcomingEvents: CommunityEvent[]
  aiAgentConfig: {
    cadenceMinutes: number
    tone: 'warm' | 'energizing' | 'celebratory'
    defaultPrompts: string[]
  }
  gamification: CommunityGamificationState
}

export interface CommunityEvent {
  id: string
  title: string
  description: string
  startsAt: Date
  timeZone: string
  location: string
  host: string
  relatedSkuId?: string
  image: string
  status: 'upcoming' | 'live'
  format: SessionFormat
  deliveryMode: DeliveryMode
}

export interface ActivityRecord {
  cohortId: string
  skuId: string
  title: string
  startDate: Date
  endDate: Date
  status: 'upcoming' | 'waitlisted' | 'completed'
  deliveryMode: DeliveryMode
  format: SessionFormat
  certificateUrl?: string
  gallery?: string[]
}

export interface User {
  id: string
  name: string
  avatar: string
  timeZone: string
  isReturning: boolean
  interests: string[]
  joinedCommunityIds: string[]
  upcomingActivities: ActivityRecord[]
  waitlistedActivities: ActivityRecord[]
  pastActivities: ActivityRecord[]
  gamification: UserGamificationState
}

export interface ConciergeAction {
  action: 'holdSeat' | 'joinWaitlist' | 'none'
  cohortId?: string
  rationale?: string
  message?: string
}

export interface RecommendationItem {
  skuId: string
  title: string
  tagline: string
  reason: string
  nextStart: Date
  deliveryMode: DeliveryMode
}

export interface BundleSuggestion {
  primarySkuId: string
  suggestedSkuId: string
  discountPercentage: number
  narrative: string
}

export interface EnrollmentSummary {
  cohortId: string
  skuId: string
  seatsHeld: number
  expiresAt: Date
  addOnIds: string[]
}

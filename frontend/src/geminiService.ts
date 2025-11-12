import type {
  BundleSuggestion,
  Community,
  CommunityPost,
  ConciergeAction,
  RecommendationItem,
  SKU,
  User,
} from './types'
import { dataIndex } from './mockApi'
import { formatDateTime, sortBySoonest } from './utils'

const avatarAi = 'https://cdn-icons-png.flaticon.com/512/6134/6134346.png'

const normalise = (text: string) => text.toLowerCase().trim()

const detectSkuFromMessage = (message: string): SKU | undefined => {
  const normalised = normalise(message)
  return dataIndex.skus.find((sku) => {
    const tokens = [sku.theme, sku.tagline, sku.description]
    return tokens.some((token) => normalised.includes(normalise(token.split(':')[0])))
  })
}

export const geminiService = {
  async conciergeIntent(message: string, fallbackCohortId?: string): Promise<ConciergeAction> {
    const sku = detectSkuFromMessage(message)
    const cohorts = sortBySoonest(dataIndex.cohorts.filter((c) => !sku || c.skuId === sku.id))
    const targetCohort =
      cohorts.find((cohort) => cohort.seatsLeft > 0) ??
      cohorts.find((cohort) => cohort.seatsLeft === 0) ??
      (fallbackCohortId ? dataIndex.cohorts.find((c) => c.id === fallbackCohortId) : undefined)

    if (!targetCohort) {
      return { action: 'none', message: "I couldn't find a matching cohort, but I can keep an eye out." }
    }

    const intentHold = /(hold|reserve|book|get me|save).*(seat|spot|place)/i.test(message)
    const intentWaitlist = /(waitlist|full|next run|notify)/i.test(message)

    if (intentWaitlist || targetCohort.seatsLeft === 0) {
      return {
        action: 'joinWaitlist',
        cohortId: targetCohort.id,
        rationale: `Cohort is full or you asked for the next slot. Added you to updates for ${formatDateTime(
          targetCohort.startDate,
          targetCohort.timeZone,
        )}.`,
      }
    }

    if (intentHold || targetCohort.seatsLeft > 0) {
      return {
        action: 'holdSeat',
        cohortId: targetCohort.id,
        rationale: `Holding a seat for the ${formatDateTime(targetCohort.startDate, targetCohort.timeZone)} start.`,
      }
    }

    return { action: 'none', message: 'I’ll keep tracking availability and let you know when a seat opens.' }
  },

  async getPersonalisedRail(user: User): Promise<RecommendationItem[]> {
    const interestMatches = dataIndex.skus.filter((sku) =>
      user.interests.some((interest) => sku.theme.toLowerCase().includes(interest)),
    )
    const fallback = sortBySoonest(dataIndex.cohorts).slice(0, 3)

    const picks = (interestMatches.length ? interestMatches : dataIndex.skus)
      .slice(0, 3)
      .map((sku) => {
        const nextCohort = sortBySoonest(dataIndex.cohorts.filter((c) => c.skuId === sku.id))[0]
        return {
          skuId: sku.id,
          title: sku.theme,
          tagline: sku.tagline,
          reason: `Based on your interest in ${sku.bundleTargets[0]?.replace('sku-', '').replace('-', ' ')}`,
          nextStart: nextCohort?.startDate ?? new Date(),
          deliveryMode: nextCohort?.deliveryMode ?? sku.deliveryMode,
        }
      })

    return picks.length ? picks : fallback.map((cohort) => ({
      skuId: cohort.skuId,
      title: dataIndex.skus.find((sku) => sku.id === cohort.skuId)?.theme ?? 'Experience',
      tagline: dataIndex.skus.find((sku) => sku.id === cohort.skuId)?.tagline ?? '',
      reason: 'Trending in your circles right now',
      nextStart: cohort.startDate,
      deliveryMode: cohort.deliveryMode,
    }))
  },

  async getBundleSuggestion(primarySkuId: string): Promise<BundleSuggestion | null> {
    const primary = dataIndex.skus.find((sku) => sku.id === primarySkuId)
    if (!primary) return null
    const suggestionTarget = primary.bundleTargets
      .map((id) => dataIndex.skus.find((sku) => sku.id === id))
      .filter(Boolean)[0]
    if (!suggestionTarget) return null
    return {
      primarySkuId,
      suggestedSkuId: suggestionTarget.id,
      discountPercentage: 12,
      narrative: `Momentum pairing: save 12% when you add ${suggestionTarget.theme} to keep the progress loop going.`,
    }
  },

  async getCommunityEngagementPost(community: Community): Promise<CommunityPost> {
    const prompt =
      community.aiAgentConfig.defaultPrompts[
        Math.floor(Math.random() * community.aiAgentConfig.defaultPrompts.length)
      ]

    return {
      id: `ai-${community.id}-${Date.now()}`,
      author: 'Community Engagement AI',
      authorType: 'ai-agent',
      avatar: avatarAi,
      createdAt: new Date(),
      content: prompt,
      poll: /poll/i.test(prompt)
        ? {
            prompt: 'Cast your vote',
            options: [
              { id: 'option-a', label: 'I’m in', votes: Math.floor(Math.random() * 18) + 5 },
              { id: 'option-b', label: 'Need support', votes: Math.floor(Math.random() * 12) + 3 },
              { id: 'option-c', label: 'Share tips', votes: Math.floor(Math.random() * 9) + 2 },
            ],
          }
        : undefined,
    }
  },

  async getNextActivitySuggestions(user: User): Promise<RecommendationItem[]> {
    const recentThemes = user.pastActivities.map((activity) =>
      dataIndex.skus.find((sku) => sku.id === activity.skuId)?.theme ?? '',
    )
    const suggestions = dataIndex.skus
      .filter((sku) => sku.bundleTargets.some((bundle) => recentThemes.join(' ').toLowerCase().includes(bundle.split('-')[1])))
      .slice(0, 2)
      .map((sku) => {
        const cohort = sortBySoonest(dataIndex.cohorts.filter((c) => c.skuId === sku.id))[0]
        return {
          skuId: sku.id,
          title: sku.theme,
          tagline: sku.tagline,
          reason: `Pairs well with your ${recentThemes[0]} momentum`,
          nextStart: cohort?.startDate ?? new Date(),
          deliveryMode: cohort?.deliveryMode ?? sku.deliveryMode,
        }
      })

    if (suggestions.length) return suggestions

    return this.getPersonalisedRail(user)
  },
}

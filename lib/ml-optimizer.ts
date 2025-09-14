// ML Optimization Engine for $pendr

interface ChannelStats {
  CPM: number
  CTR: number
  CVR: number
}

interface Benchmarks {
  [industry: string]: {
    channels: {
      [channel: string]: ChannelStats
    }
  }
}

interface AudienceMultipliers {
  [audience: string]: {
    [channel: string]: number
  }
}

interface SimulationResult {
  reach: number
  clicks: number
  conversions: number
  revenue: number
  roi: number
  cpa: number
}

interface AllocationResult {
  [slab: string]: {
    [channel: string]: number
  }
}

// Locked-in Benchmark Data
const benchmarks: Benchmarks = {
  "Ecommerce": {
    "channels": {
      "TikTok": {"CPM": 6, "CTR": 0.018, "CVR": 0.012},
      "Instagram": {"CPM": 8, "CTR": 0.015, "CVR": 0.015},
      "GoogleAds": {"CPM": 12, "CTR": 0.025, "CVR": 0.04},
      "YouTube": {"CPM": 10, "CTR": 0.01, "CVR": 0.012},
      "Facebook": {"CPM": 7, "CTR": 0.013, "CVR": 0.02},
      "LinkedIn": {"CPM": 20, "CTR": 0.007, "CVR": 0.06}
    }
  },
  "B2B_SaaS": {
    "channels": {
      "LinkedIn": {"CPM": 20, "CTR": 0.007, "CVR": 0.06},
      "GoogleAds": {"CPM": 15, "CTR": 0.02, "CVR": 0.05},
      "Email": {"CPM": 5, "CTR": 0.05, "CVR": 0.02},
      "Facebook": {"CPM": 7, "CTR": 0.013, "CVR": 0.02},
      "YouTube": {"CPM": 8, "CTR": 0.012, "CVR": 0.02}
    }
  },
  "Healthcare": {
    "channels": {
      "GoogleAds": {"CPM": 10, "CTR": 0.015, "CVR": 0.03},
      "YouTube": {"CPM": 8, "CTR": 0.012, "CVR": 0.015},
      "Facebook": {"CPM": 7, "CTR": 0.013, "CVR": 0.02},
      "LinkedIn": {"CPM": 20, "CTR": 0.007, "CVR": 0.06}
    }
  },
  "Travel": {
    "channels": {
      "Instagram": {"CPM": 9, "CTR": 0.016, "CVR": 0.01},
      "TikTok": {"CPM": 7, "CTR": 0.018, "CVR": 0.012},
      "GoogleAds": {"CPM": 11, "CTR": 0.02, "CVR": 0.02},
      "YouTube": {"CPM": 8, "CTR": 0.012, "CVR": 0.015}
    }
  },
  "Education": {
    "channels": {
      "GoogleAds": {"CPM": 9, "CTR": 0.02, "CVR": 0.04},
      "Facebook": {"CPM": 6, "CTR": 0.014, "CVR": 0.025},
      "YouTube": {"CPM": 8, "CTR": 0.012, "CVR": 0.02},
      "LinkedIn": {"CPM": 20, "CTR": 0.007, "CVR": 0.06}
    }
  }
}

// Audience Multipliers
const audienceMultipliers: AudienceMultipliers = {
  "GenZ": {"TikTok": 1.2, "Instagram": 1.1},
  "Millennials": {"Instagram": 1.1, "GoogleAds": 1.05},
  "B2B": {"LinkedIn": 1.3, "GoogleAds": 1.1},
  "Healthcare": {"GoogleAds": 1.1, "YouTube": 1.05},
  "Travelers": {"Instagram": 1.2, "TikTok": 1.15}
}

// Simulation Function
function simulateChannel(budget: number, channelStats: ChannelStats, aov: number, multiplier: number = 1.0): SimulationResult {
  const cpm = channelStats.CPM
  const ctr = channelStats.CTR * multiplier
  const cvr = channelStats.CVR

  const reach = (budget / cpm) * 1000
  const clicks = reach * ctr
  const conversions = clicks * cvr
  const revenue = conversions * aov
  const roi = budget > 0 ? (revenue - budget) / budget : 0
  const cpa = conversions > 0 ? budget / conversions : Number.POSITIVE_INFINITY

  return {
    reach,
    clicks,
    conversions,
    revenue,
    roi,
    cpa
  }
}

// Slab Allocator
export function allocateSlabs(totalBudget: number, industry: string, audience: string, aov: number = 150): {
  allocation: AllocationResult
  ranked: Array<{channel: string, result: SimulationResult}>
  explanations: string[]
} {
  const industryData = benchmarks[industry]
  if (!industryData) {
    throw new Error(`Industry ${industry} not found in benchmarks`)
  }

  const channels = industryData.channels
  const multipliers = audienceMultipliers[audience] || {}

  // Simulate all channels
  const results: {[channel: string]: SimulationResult} = {}
  for (const [channel, stats] of Object.entries(channels)) {
    const mult = multipliers[channel] || 1.0
    results[channel] = simulateChannel(totalBudget / Object.keys(channels).length, stats, aov, mult)
  }

  // Rank channels by ROI
  const ranked = Object.entries(results)
    .map(([channel, result]) => ({ channel, result }))
    .sort((a, b) => b.result.roi - a.result.roi)

  // Slab allocation
  const slabBudgets = {
    "Slab1": totalBudget * 0.3,
    "Slab2": totalBudget * 0.4,
    "Slab3": totalBudget * 0.3
  }

  const allocation: AllocationResult = {
    "Slab1": {},
    "Slab2": {},
    "Slab3": {}
  }

  // Top 2 channels get Slab1
  const topChannels = ranked.slice(0, 2)
  for (const { channel } of topChannels) {
    allocation["Slab1"][channel] = slabBudgets["Slab1"] / topChannels.length
  }

  // Next 3 channels get Slab2
  const nextChannels = ranked.slice(2, 5)
  for (const { channel } of nextChannels) {
    allocation["Slab2"][channel] = slabBudgets["Slab2"] / Math.max(1, nextChannels.length)
  }

  // Remaining channels get Slab3
  const remainingChannels = ranked.slice(5)
  if (remainingChannels.length > 0) {
    for (const { channel } of remainingChannels) {
      allocation["Slab3"][channel] = slabBudgets["Slab3"] / remainingChannels.length
    }
  }

  // Generate explanations
  const explanations: string[] = []
  for (const [slab, channels] of Object.entries(allocation)) {
    for (const [channel, budget] of Object.entries(channels)) {
      let reason = `${channel} chosen in ${slab} with $${budget.toFixed(0)}`
      if (audienceMultipliers[audience] && audienceMultipliers[audience][channel]) {
        reason += ` because ${audience} multiplier boosts CTR to ${audienceMultipliers[audience][channel]}x`
      } else {
        reason += " due to strong ROI baseline"
      }
      explanations.push(reason)
    }
  }

  return { allocation, ranked, explanations }
}

// Get industry mapping
export function getIndustryMapping(industry: string): string {
  const mapping: {[key: string]: string} = {
    'technology': 'B2B_SaaS',
    'finance': 'B2B_SaaS',
    'healthcare': 'Healthcare',
    'retail': 'Ecommerce',
    'education': 'Education',
    'manufacturing': 'B2B_SaaS',
    'real-estate': 'B2B_SaaS',
    'food-beverage': 'Ecommerce',
    'automotive': 'Ecommerce',
    'other': 'Ecommerce'
  }
  return mapping[industry] || 'Ecommerce'
}

// Get audience mapping
export function getAudienceMapping(targetAudience: string): string {
  const audience = targetAudience.toLowerCase()
  if (audience.includes('gen z') || audience.includes('18-24')) return 'GenZ'
  if (audience.includes('millennial') || audience.includes('25-35')) return 'Millennials'
  if (audience.includes('b2b') || audience.includes('business')) return 'B2B'
  if (audience.includes('healthcare') || audience.includes('medical')) return 'Healthcare'
  if (audience.includes('travel') || audience.includes('tourism')) return 'Travelers'
  return 'Millennials' // Default
}

// Generate optimized allocation data
export function generateOptimizedAllocation(
  totalBudget: number,
  industry: string,
  targetAudience: string,
  currentAllocation: {[key: string]: string}
): {
  platforms: Array<{
    platform: string
    manual: number
    aiOptimized: number
    change: number
    color: string
    roi: number
    cpa: number
  }>
  totalROI: number
  totalRevenue: number
  totalConversions: number
} {
  const mappedIndustry = getIndustryMapping(industry)
  const mappedAudience = getAudienceMapping(targetAudience)
  
  const { allocation, ranked } = allocateSlabs(totalBudget, mappedIndustry, mappedAudience)
  
  // Flatten allocation to get total per channel
  const channelTotals: {[key: string]: number} = {}
  for (const slab of Object.values(allocation)) {
    for (const [channel, budget] of Object.entries(slab)) {
      channelTotals[channel] = (channelTotals[channel] || 0) + budget
    }
  }

  // Platform colors
  const platformColors: {[key: string]: string} = {
    'Facebook Ads': '#3B82F6',
    'Google Ads': '#10B981',
    'Instagram': '#EC4899',
    'TikTok': '#000000',
    'LinkedIn Ads': '#0077B5',
    'YouTube': '#FF0000',
    'Email': '#6B7280'
  }

  // Create platform data
  const platforms = ranked.map(({ channel, result }) => {
    const platformName = channel === 'GoogleAds' ? 'Google Ads' : 
                        channel === 'LinkedIn' ? 'LinkedIn Ads' :
                        channel === 'Facebook' ? 'Facebook Ads' :
                        channel === 'YouTube' ? 'YouTube' :
                        channel === 'TikTok' ? 'TikTok' :
                        channel === 'Instagram' ? 'Instagram' :
                        channel === 'Email' ? 'Email' : channel

    const manualPercentage = parseFloat(currentAllocation[channel.toLowerCase()] || '0')
    const manualAmount = (manualPercentage / 100) * totalBudget
    const aiOptimizedAmount = channelTotals[channel] || 0
    const change = aiOptimizedAmount - manualAmount

    return {
      platform: platformName,
      manual: manualAmount,
      aiOptimized: aiOptimizedAmount,
      change: change,
      color: platformColors[platformName] || '#6B7280',
      roi: result.roi,
      cpa: result.cpa
    }
  })

  // Calculate totals
  const totalROI = ranked.reduce((sum, { result }) => sum + result.roi, 0) / ranked.length
  const totalRevenue = ranked.reduce((sum, { result }) => sum + result.revenue, 0)
  const totalConversions = ranked.reduce((sum, { result }) => sum + result.conversions, 0)

  return {
    platforms,
    totalROI,
    totalRevenue,
    totalConversions
  }
}


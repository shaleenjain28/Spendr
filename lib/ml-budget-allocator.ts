// ML Budget Allocation Engine
// Based on industry benchmarks and audience multipliers

export interface ChannelStats {
  CPM: number;
  CTR: number;
  CVR: number;
}

export interface SimulationResult {
  reach: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
  cpa: number;
}

export interface BudgetAllocation {
  [channelName: string]: number;
}

export interface AllocationResult {
  allocation: {
    Slab1: BudgetAllocation;
    Slab2: BudgetAllocation;
    Slab3: BudgetAllocation;
  };
  ranked: Array<[string, SimulationResult]>;
  explanations: string[];
}

// ------------------------------
// Locked-in Benchmark Data
// ------------------------------
export const benchmarks = {
  "Ecommerce": {
    "channels": {
      "TikTok": {"CPM": 6, "CTR": 0.018, "CVR": 0.012},
      "Instagram": {"CPM": 8, "CTR": 0.015, "CVR": 0.015},
      "GoogleAds": {"CPM": 12, "CTR": 0.025, "CVR": 0.04},
      "YouTube": {"CPM": 10, "CTR": 0.01, "CVR": 0.012}
    }
  },
  "B2B_SaaS": {
    "channels": {
      "LinkedIn": {"CPM": 20, "CTR": 0.007, "CVR": 0.06},
      "GoogleAds": {"CPM": 15, "CTR": 0.02, "CVR": 0.05},
      "Email": {"CPM": 5, "CTR": 0.05, "CVR": 0.02}
    }
  },
  "Healthcare": {
    "channels": {
      "GoogleAds": {"CPM": 10, "CTR": 0.015, "CVR": 0.03},
      "YouTube": {"CPM": 8, "CTR": 0.012, "CVR": 0.015},
      "Facebook": {"CPM": 7, "CTR": 0.013, "CVR": 0.02}
    }
  },
  "Travel": {
    "channels": {
      "Instagram": {"CPM": 9, "CTR": 0.016, "CVR": 0.01},
      "TikTok": {"CPM": 7, "CTR": 0.018, "CVR": 0.012},
      "GoogleAds": {"CPM": 11, "CTR": 0.02, "CVR": 0.02}
    }
  },
  "Education": {
    "channels": {
      "GoogleAds": {"CPM": 9, "CTR": 0.02, "CVR": 0.04},
      "Facebook": {"CPM": 6, "CTR": 0.014, "CVR": 0.025},
      "YouTube": {"CPM": 8, "CTR": 0.012, "CVR": 0.02}
    }
  }
} as const;

// ------------------------------
// Audience Multipliers
// ------------------------------
export const audienceMultipliers = {
  "GenZ": {"TikTok": 1.2, "Instagram": 1.1},
  "Millennials": {"Instagram": 1.1, "GoogleAds": 1.05},
  "B2B": {"LinkedIn": 1.3, "GoogleAds": 1.1},
  "Healthcare": {"GoogleAds": 1.1, "YouTube": 1.05},
  "Travelers": {"Instagram": 1.2, "TikTok": 1.15}
} as const;

// ------------------------------
// Simulation Function
// ------------------------------
export function simulateChannel(
  budget: number, 
  channelStats: ChannelStats, 
  aov: number, 
  multiplier: number = 1.0
): SimulationResult {
  const cpm = channelStats.CPM;
  const ctr = channelStats.CTR * multiplier;
  const cvr = channelStats.CVR;

  const reach = (budget / cpm) * 1000;
  const clicks = reach * ctr;
  const conversions = clicks * cvr;
  const revenue = conversions * aov;
  const roi = budget > 0 ? (revenue - budget) / budget : 0;
  const cpa = conversions > 0 ? budget / conversions : Infinity;

  return {
    reach,
    clicks,
    conversions,
    revenue,
    roi,
    cpa
  };
}

// ------------------------------
// Slab Allocator
// ------------------------------
export function allocateSlabs(
  totalBudget: number, 
  industry: keyof typeof benchmarks, 
  audience: keyof typeof audienceMultipliers, 
  aov: number
): AllocationResult {
  const channels = benchmarks[industry].channels;
  const multipliers = audienceMultipliers[audience] || {};

  const results: { [channel: string]: SimulationResult } = {};
  
  // Simulate each channel with equal budget initially
  Object.entries(channels).forEach(([channel, stats]) => {
    const mult = multipliers[channel as keyof typeof multipliers] || 1.0;
    results[channel] = simulateChannel(totalBudget / Object.keys(channels).length, stats, aov, mult);
  });

  // Rank channels by ROI
  const ranked = Object.entries(results).sort(([, a], [, b]) => b.roi - a.roi);

  const slabBudgets = {
    "Slab1": totalBudget * 0.3,
    "Slab2": totalBudget * 0.4,
    "Slab3": totalBudget * 0.3
  };

  const allocation = {
    "Slab1": {} as BudgetAllocation,
    "Slab2": {} as BudgetAllocation,
    "Slab3": {} as BudgetAllocation
  };

  // Slab allocation logic
  const topChannels = ranked.slice(0, 2);
  topChannels.forEach(([channel]) => {
    allocation.Slab1[channel] = slabBudgets.Slab1 / topChannels.length;
  });

  const nextChannels = ranked.slice(2, 5);
  nextChannels.forEach(([channel]) => {
    allocation.Slab2[channel] = slabBudgets.Slab2 / Math.max(1, nextChannels.length);
  });

  const remaining = ranked.slice(5);
  if (remaining.length > 0) {
    remaining.forEach(([channel]) => {
      allocation.Slab3[channel] = slabBudgets.Slab3 / remaining.length;
    });
  }

  const explanations = explainAllocations(industry, audience, allocation);

  return {
    allocation,
    ranked,
    explanations
  };
}

// ------------------------------
// Explanation Generator
// ------------------------------
function explainAllocations(
  industry: keyof typeof benchmarks,
  audience: keyof typeof audienceMultipliers,
  allocation: { Slab1: BudgetAllocation; Slab2: BudgetAllocation; Slab3: BudgetAllocation }
): string[] {
  const explanations: string[] = [];
  
  Object.entries(allocation).forEach(([slab, channels]) => {
    Object.entries(channels).forEach(([channel, budget]) => {
      let reason = `${channel} chosen in ${slab} with $${budget.toFixed(0)}`;
      
      const multipliers = audienceMultipliers[audience];
      if (multipliers && channel in multipliers) {
        reason += ` because ${audience} multiplier boosts CTR to ${multipliers[channel as keyof typeof multipliers]}x`;
      } else {
        reason += " due to strong ROI baseline";
      }
      
      explanations.push(reason);
    });
  });
  
  return explanations;
}

// ------------------------------
// Convert to Pie Chart Data
// ------------------------------
export function convertToPieChartData(allocation: AllocationResult, totalBudget: number) {
  const pieData: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
    roi: number;
    cpa: number;
  }> = [];

  const colors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"
  ];

  let colorIndex = 0;

  // Combine all slabs into single allocation
  const combinedAllocation: { [key: string]: number } = {};
  
  Object.values(allocation.allocation).forEach(slab => {
    Object.entries(slab).forEach(([channel, budget]) => {
      combinedAllocation[channel] = (combinedAllocation[channel] || 0) + budget;
    });
  });

  Object.entries(combinedAllocation).forEach(([channel, budget]) => {
    const percentage = (budget / totalBudget) * 100;
    const channelData = allocation.ranked.find(([name]) => name === channel);
    const roi = channelData ? channelData[1].roi : 0;
    const cpa = channelData ? channelData[1].cpa : 0;

    pieData.push({
      name: channel,
      value: budget,
      percentage: Math.round(percentage * 100) / 100,
      color: colors[colorIndex % colors.length],
      roi: Math.round(roi * 100) / 100,
      cpa: Math.round(cpa * 100) / 100
    });

    colorIndex++;
  });

  return pieData.sort((a, b) => b.value - a.value);
}

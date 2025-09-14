'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3,
  ArrowLeft,
  Settings
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface CampaignData {
  budget: string
  productDescription: string
  targetAudience: string
  region: string
  campaignDuration: string
  usp: string
  demographics: string
  companyName: string
  industry: string
}

interface StrategyData {
  name: string
  budget: number
  budgetChange: number
  model: string
  channelAllocation: Array<{
    channel: string
    budget: number
    percentage: number
    color: string
  }>
  metrics: {
    impressions: number
    clicks: number
    conversions: number
    cac: number
    ctr: number
    roas: number
  }
}

export default function ComparePage() {
  const router = useRouter()
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null)
  const [originalStrategy, setOriginalStrategy] = useState<StrategyData | null>(null)
  const [optimizedStrategy, setOptimizedStrategy] = useState<StrategyData | null>(null)
  const [budgetMultiplier, setBudgetMultiplier] = useState([1.0])

  useEffect(() => {
    const data = localStorage.getItem('campaignData')
    if (data) {
      const parsed = JSON.parse(data)
      setCampaignData(parsed)
      
      const strategies = generateStrategies(parsed)
      setOriginalStrategy(strategies.original)
      setOptimizedStrategy(strategies.optimized)
    } else {
      router.push('/')
    }
  }, [router])

  const generateStrategies = (data: CampaignData) => {
    const baseBudget = parseFloat(data.budget)
    
    // Original Strategy
    const originalChannels = [
      { channel: 'Affiliate', budget: baseBudget * 0.42, percentage: 42, color: '#3B82F6' },
      { channel: 'Paid Social Facebook', budget: baseBudget * 0.19, percentage: 19, color: '#1E40AF' },
      { channel: 'Display', budget: baseBudget * 0.17, percentage: 17, color: '#F59E0B' },
      { channel: 'Brand Google', budget: baseBudget * 0.09, percentage: 9, color: '#EC4899' },
      { channel: 'Brand Bing', budget: baseBudget * 0.05, percentage: 5, color: '#10B981' },
      { channel: 'Non-Brand Bing', budget: baseBudget * 0.05, percentage: 5, color: '#8B5CF6' },
      { channel: 'Non-Brand Google', budget: baseBudget * 0.03, percentage: 3, color: '#EF4444' },
    ]

    // Optimized Strategy
    const optimizedChannels = [
      { channel: 'Paid Social Facebook', budget: baseBudget * 0.35, percentage: 35, color: '#3B82F6' },
      { channel: 'Google Ads', budget: baseBudget * 0.25, percentage: 25, color: '#10B981' },
      { channel: 'Display', budget: baseBudget * 0.20, percentage: 20, color: '#F59E0B' },
      { channel: 'Affiliate', budget: baseBudget * 0.12, percentage: 12, color: '#EC4899' },
      { channel: 'Email Marketing', budget: baseBudget * 0.08, percentage: 8, color: '#8B5CF6' },
    ]

    const original = {
      name: `${data.companyName} 2024 H2 Plan Original`,
      budget: baseBudget,
      budgetChange: 0,
      model: `${data.companyName} MMM account opens model with MTA`,
      channelAllocation: originalChannels,
      metrics: {
        impressions: Math.round(baseBudget * 150),
        clicks: Math.round(baseBudget * 150 * 0.025),
        conversions: Math.round(baseBudget * 150 * 0.025 * 0.08),
        cac: Math.round(baseBudget / (baseBudget * 150 * 0.025 * 0.08)),
        ctr: 2.5,
        roas: 1.2
      }
    }

    const optimized = {
      name: `${data.companyName} 2024 H2 Plan Optimized`,
      budget: baseBudget,
      budgetChange: 0,
      model: `${data.companyName} MMM account opens model with MTA`,
      channelAllocation: optimizedChannels,
      metrics: {
        impressions: Math.round(baseBudget * 200),
        clicks: Math.round(baseBudget * 200 * 0.035),
        conversions: Math.round(baseBudget * 200 * 0.035 * 0.12),
        cac: Math.round(baseBudget / (baseBudget * 200 * 0.035 * 0.12)),
        ctr: 3.5,
        roas: 1.8
      }
    }

    return { original, optimized }
  }

  const updateBudget = (multiplier: number) => {
    if (!campaignData) return
    
    const baseBudget = parseFloat(campaignData.budget)
    const newBudget = baseBudget * multiplier
    
    // Update original strategy
    const originalChannels = originalStrategy?.channelAllocation.map(channel => ({
      ...channel,
      budget: (channel.budget / originalStrategy.budget) * newBudget
    })) || []
    
    setOriginalStrategy(prev => prev ? {
      ...prev,
      budget: newBudget,
      budgetChange: multiplier > 1 ? (newBudget - baseBudget) : -(baseBudget - newBudget),
      channelAllocation: originalChannels
    } : null)

    // Update optimized strategy
    const optimizedChannels = optimizedStrategy?.channelAllocation.map(channel => ({
      ...channel,
      budget: (channel.budget / optimizedStrategy.budget) * newBudget
    })) || []
    
    setOptimizedStrategy(prev => prev ? {
      ...prev,
      budget: newBudget,
      budgetChange: multiplier > 1 ? (newBudget - baseBudget) : -(baseBudget - newBudget),
      channelAllocation: optimizedChannels
    } : null)
  }

  if (!campaignData || !originalStrategy || !optimizedStrategy) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/optimized')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Strategy Comparison
                </h1>
                <p className="text-gray-600">
                  Compare your original strategy with the AI-optimized version
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Slider */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Budget Adjustment
            </CardTitle>
            <CardDescription>
              Adjust the budget to see how it affects both strategies in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Budget Multiplier</span>
                <span className="text-sm text-gray-600">
                  {budgetMultiplier[0]}x (${Math.round(parseFloat(campaignData.budget) * budgetMultiplier[0]).toLocaleString()})
                </span>
              </div>
              <Slider
                value={budgetMultiplier}
                onValueChange={(value) => {
                  setBudgetMultiplier(value)
                  updateBudget(value[0])
                }}
                max={2}
                min={0.5}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>1.5x</span>
                <span>2.0x</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side-by-side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Strategy */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">{originalStrategy.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>Model:</strong> {originalStrategy.model}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Total Budget:</strong> 
                  <span className="text-lg font-bold">${originalStrategy.budget.toLocaleString()}M</span>
                  {originalStrategy.budgetChange !== 0 && (
                    <span className={`text-sm px-2 py-1 rounded ${
                      originalStrategy.budgetChange > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {originalStrategy.budgetChange > 0 ? '+' : ''}${Math.abs(originalStrategy.budgetChange).toLocaleString()}M
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Channel Budgeting:</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                    Manual
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Donut Chart */}
              <div>
                <h4 className="font-semibold mb-3">Total Spend Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={originalStrategy.channelAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="budget"
                      >
                        {originalStrategy.channelAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}M`, 'Budget']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center text-sm font-medium">
                  ${originalStrategy.budget.toLocaleString()}M Total spend
                </div>
              </div>

              {/* Bar Chart */}
              <div>
                <h4 className="font-semibold mb-3">Planned Spend by Channel</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={originalStrategy.channelAllocation} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="channel" type="category" width={100} />
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}M`, 'Budget']} />
                      <Bar dataKey="budget" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimized Strategy */}
          <Card className="border-2 border-green-200 bg-green-50/30">
            <CardHeader>
              <CardTitle className="text-lg">{optimizedStrategy.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>Model:</strong> {optimizedStrategy.model}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Total Budget:</strong> 
                  <span className="text-lg font-bold">${optimizedStrategy.budget.toLocaleString()}M</span>
                  {optimizedStrategy.budgetChange !== 0 && (
                    <span className={`text-sm px-2 py-1 rounded ${
                      optimizedStrategy.budgetChange > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {optimizedStrategy.budgetChange > 0 ? '+' : ''}${Math.abs(optimizedStrategy.budgetChange).toLocaleString()}M
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Channel Budgeting:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    AI automated
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Donut Chart */}
              <div>
                <h4 className="font-semibold mb-3">Total Spend Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={optimizedStrategy.channelAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="budget"
                      >
                        {optimizedStrategy.channelAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}M`, 'Budget']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center text-sm font-medium">
                  ${optimizedStrategy.budget.toLocaleString()}M Total spend
                </div>
              </div>

              {/* Bar Chart */}
              <div>
                <h4 className="font-semibold mb-3">Planned Spend by Channel</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={optimizedStrategy.channelAllocation} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="channel" type="category" width={100} />
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}M`, 'Budget']} />
                      <Bar dataKey="budget" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Comparison */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics Comparison
            </CardTitle>
            <CardDescription>
              Key performance indicators comparing both strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-2">Impressions</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {originalStrategy.metrics.impressions.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Original</div>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  {optimizedStrategy.metrics.impressions.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Optimized (+33%)</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-2">Clicks</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {originalStrategy.metrics.clicks.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Original</div>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  {optimizedStrategy.metrics.clicks.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Optimized (+40%)</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-2">ROAS</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {originalStrategy.metrics.roas}x
                </div>
                <div className="text-sm text-gray-500">Original</div>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  {optimizedStrategy.metrics.roas}x
                </div>
                <div className="text-sm text-green-600">Optimized (+50%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Lightbulb
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

interface OptimizedStrategy {
  totalBudget: number
  channelAllocation: Array<{
    channel: string
    budget: number
    percentage: number
    color: string
  }>
  expectedMetrics: {
    impressions: number
    clicks: number
    conversions: number
    cac: number
    ctr: number
    roas: number
  }
  improvements: Array<{
    metric: string
    original: number
    optimized: number
    improvement: number
  }>
}

export default function OptimizedPage() {
  const router = useRouter()
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null)
  const [optimizedStrategy, setOptimizedStrategy] = useState<OptimizedStrategy | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    const data = localStorage.getItem('campaignData')
    if (data) {
      const parsed = JSON.parse(data)
      setCampaignData(parsed)
      
      // Simulate AI optimization process
      setTimeout(() => {
        const strategy = generateOptimizedStrategy(parsed)
        setOptimizedStrategy(strategy)
        setIsGenerating(false)
      }, 2000)
    } else {
      router.push('/')
    }
  }, [router])

  const generateOptimizedStrategy = (data: CampaignData): OptimizedStrategy => {
    const budget = parseFloat(data.budget)
    
    // Generate optimized channel allocation based on industry and region
    const channelAllocation = [
      { channel: 'Paid Social Facebook', budget: budget * 0.35, percentage: 35, color: '#3B82F6' },
      { channel: 'Google Ads', budget: budget * 0.25, percentage: 25, color: '#10B981' },
      { channel: 'Display Advertising', budget: budget * 0.20, percentage: 20, color: '#F59E0B' },
      { channel: 'Affiliate Marketing', budget: budget * 0.12, percentage: 12, color: '#EF4444' },
      { channel: 'Email Marketing', budget: budget * 0.08, percentage: 8, color: '#8B5CF6' },
    ]

    // Calculate improved metrics
    const baseMultiplier = 1.4 // 40% improvement
    const impressions = Math.round(budget * 200 * baseMultiplier)
    const clicks = Math.round(impressions * 0.035) // 3.5% CTR
    const conversions = Math.round(clicks * 0.12) // 12% conversion rate
    const cac = Math.round(budget / conversions)
    const ctr = 3.5
    const roas = Math.round((conversions * 150) / budget * 100) / 100

    const improvements = [
      { metric: 'Impressions', original: Math.round(budget * 150), optimized: impressions, improvement: 40 },
      { metric: 'Clicks', original: Math.round(budget * 150 * 0.025), optimized: clicks, improvement: 65 },
      { metric: 'Conversions', original: Math.round(budget * 150 * 0.025 * 0.08), optimized: conversions, improvement: 80 },
      { metric: 'CTR', original: 2.5, optimized: ctr, improvement: 40 },
      { metric: 'ROAS', original: 1.2, optimized: roas, improvement: 67 },
    ]

    return {
      totalBudget: budget,
      channelAllocation,
      expectedMetrics: { impressions, clicks, conversions, cac, ctr, roas },
      improvements
    }
  }

  if (!campaignData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Optimizing Your Strategy</h2>
            <p className="text-gray-600">Our AI is analyzing your campaign and generating the ideal marketing strategy...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!optimizedStrategy) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Optimized Strategy
              </h1>
              <p className="text-gray-600">
                {campaignData.companyName} • AI-Optimized Campaign Plan
              </p>
            </div>
            <Button 
              onClick={() => router.push('/compare')}
              className="flex items-center gap-2"
            >
              Compare Strategies
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Success Message */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div>
                <h3 className="text-xl font-semibold text-green-900 mb-1">
                  Strategy Optimized Successfully!
                </h3>
                <p className="text-green-700">
                  Your campaign has been optimized with AI-powered insights. Expected performance improvement: 40-80%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${optimizedStrategy.totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Optimized allocation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expected ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{optimizedStrategy.expectedMetrics.roas}x</div>
              <p className="text-xs text-muted-foreground">
                +67% improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expected Conversions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{optimizedStrategy.expectedMetrics.conversions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +80% improvement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Channel Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Channel Budget Allocation
              </CardTitle>
              <CardDescription>
                AI-optimized budget distribution across marketing channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={optimizedStrategy.channelAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ channel, percentage }) => `${channel} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="budget"
                    >
                      {optimizedStrategy.channelAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Budget']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget by Channel</CardTitle>
              <CardDescription>
                Detailed breakdown of recommended spend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={optimizedStrategy.channelAllocation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Budget']} />
                    <Bar dataKey="budget" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Improvements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Expected Performance Improvements
            </CardTitle>
            <CardDescription>
              Key metrics showing the impact of optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {optimizedStrategy.improvements.map((improvement, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 mb-2">{improvement.metric}</div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {typeof improvement.optimized === 'number' && improvement.optimized > 1000 
                        ? improvement.optimized.toLocaleString() 
                        : improvement.optimized}
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      +{improvement.improvement}%
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    From {typeof improvement.original === 'number' && improvement.original > 1000 
                      ? improvement.original.toLocaleString() 
                      : improvement.original}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => router.push('/compare')}
            className="px-8"
          >
            Compare with Original Strategy
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => router.push('/simulate')}
            className="px-8"
          >
            Simulate Ads
          </Button>
        </div>
      </div>
    </div>
  )
}

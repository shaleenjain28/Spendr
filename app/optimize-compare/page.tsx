'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Target,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  Brain,
  Users
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface CampaignData {
  budget: string
  companyName: string
  industry: string
  region: string
  targetAudience: string
  budgetAllocation?: {
    instagram?: string
    linkedin?: string
    facebook?: string
    google?: string
    twitter?: string
    youtube?: string
    tiktok?: string
    other?: string
  }
}

interface AllocationData {
  platform: string
  manual: number
  aiOptimized: number
  change: number
  color: string
}

export default function OptimizeComparePage() {
  const router = useRouter()
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null)
  const [allocationData, setAllocationData] = useState<AllocationData[]>([])
  const [kpiData, setKpiData] = useState({
    projectedROI: { manual: 0, ai: 0 },
    estimatedRevenue: { manual: 0, ai: 0 },
    estimatedConversions: { manual: 0, ai: 0 },
    improvement: 0
  })

  // Random value generation functions with different formulas
  // 
  // FORMULA EXPLANATIONS:
  // 
  // 1. PROJECTED ROI FORMULA:
  //    Manual ROI = 8-25% (realistic range for manual allocation)
  //    AI ROI = 35-85% (optimized range with AI assistance)
  //    Seed: budget + industry.length + region.length + targetAudience.length
  //    Random: sin(seed + random * 1000) * 10000 for consistent but varied results
  //
  // 2. ESTIMATED REVENUE FORMULA:
  //    Manual Revenue = budget * (0.8 to 1.5) (conservative multiplier)
  //    AI Revenue = budget * (2.5 to 6.5) (optimized multiplier)
  //    Based on budget efficiency and platform optimization
  //
  // 3. ESTIMATED CONVERSIONS FORMULA:
  //    Manual Conversions = budget * (0.5% to 2%) (low conversion rate)
  //    AI Conversions = budget * (3% to 8%) (high conversion rate)
  //    Represents actual conversions per dollar spent
  //
  // 4. IMPROVEMENT PERCENTAGE FORMULA:
  //    Improvement = ((AI_ROI - Manual_ROI) / Manual_ROI) * 100
  //    Shows percentage improvement from manual to AI optimization
  //
  // 5. AI ALLOCATION FORMULA:
  //    Base weights: Facebook(25%), Google(20%), Instagram(15%), TikTok(12%), LinkedIn(10%), YouTube(8%), Twitter(10%)
  //    Variation: ±5% random variation from base weights
  //    Normalization: All weights normalized to sum to 100%
  //
  const generateRandomValues = (campaignData: CampaignData) => {
    const budget = parseFloat(campaignData.budget)
    const industry = campaignData.industry
    const region = campaignData.region
    const targetAudience = campaignData.targetAudience
    
    // Create a seed based on campaign data for consistent randomness
    const seed = budget + industry.length + region.length + targetAudience.length
    const random = (min: number, max: number) => {
      const x = Math.sin(seed + Math.random() * 1000) * 10000
      return min + (x - Math.floor(x)) * (max - min)
    }
    
    // Formula 1: Projected ROI
    // Manual ROI: 8-25% (lower range, less optimized)
    // AI ROI: 35-85% (higher range, AI optimized)
    const manualROI = random(8, 25)
    const aiROI = random(35, 85)
    
    // Formula 2: Estimated Revenue
    // Manual Revenue: 0.8-1.5x budget (conservative)
    // AI Revenue: 2.5-6.5x budget (optimized)
    const manualRevenue = budget * random(0.8, 1.5)
    const aiRevenue = budget * random(2.5, 6.5)
    
    // Formula 3: Estimated Conversions
    // Manual Conversions: 0.5-2% of budget (low conversion)
    // AI Conversions: 3-8% of budget (high conversion)
    const manualConversions = Math.round(budget * random(0.005, 0.02))
    const aiConversions = Math.round(budget * random(0.03, 0.08))
    
    // Formula 4: Improvement Percentage
    // Based on the difference between AI and Manual performance
    const improvement = ((aiROI - manualROI) / manualROI) * 100
    
    return {
      projectedROI: { 
        manual: Math.round(manualROI * 10) / 10, 
        ai: Math.round(aiROI * 10) / 10 
      },
      estimatedRevenue: { 
        manual: Math.round(manualRevenue), 
        ai: Math.round(aiRevenue) 
      },
      estimatedConversions: { 
        manual: manualConversions, 
        ai: aiConversions 
      },
      improvement: Math.round(improvement * 10) / 10
    }
  }

  // Random AI allocation generation
  const generateRandomAIAllocation = (totalBudget: number) => {
    const platforms = [
      { key: 'facebook', name: 'Facebook Ads', color: '#3B82F6', baseWeight: 0.25 },
      { key: 'google', name: 'Google Ads', color: '#10B981', baseWeight: 0.20 },
      { key: 'instagram', name: 'Instagram', color: '#EC4899', baseWeight: 0.15 },
      { key: 'tiktok', name: 'TikTok', color: '#000000', baseWeight: 0.12 },
      { key: 'linkedin', name: 'LinkedIn Ads', color: '#0077B5', baseWeight: 0.10 },
      { key: 'youtube', name: 'YouTube', color: '#FF0000', baseWeight: 0.08 },
      { key: 'twitter', name: 'Twitter', color: '#1DA1F2', baseWeight: 0.10 }
    ]
    
    // Generate random weights that sum to 100%
    const weights = platforms.map(platform => ({
      ...platform,
      weight: platform.baseWeight + (Math.random() - 0.5) * 0.1 // ±5% variation
    }))
    
    // Normalize weights to sum to 1
    const totalWeight = weights.reduce((sum, p) => sum + p.weight, 0)
    const normalizedWeights = weights.map(p => ({
      ...p,
      weight: p.weight / totalWeight
    }))
    
    return normalizedWeights.map(platform => ({
      platform: platform.name,
      percentage: Math.round(platform.weight * 100),
      amount: Math.round(platform.weight * totalBudget),
      color: platform.color
    }))
  }

  useEffect(() => {
    const data = localStorage.getItem('spendr_campaign_data')
    if (data) {
      const parsed = JSON.parse(data)
      setCampaignData(parsed)
      
      // Generate random KPI data
      const kpiValues = generateRandomValues(parsed)
      setKpiData(kpiValues)
      
      // Generate comparison data
      const totalBudget = parseFloat(parsed.budget)
      const allocation = parsed.budgetAllocation || {}
      
      const platforms = [
        { key: 'facebook', name: 'Facebook Ads', color: '#3B82F6' },
        { key: 'google', name: 'Google Ads', color: '#10B981' },
        { key: 'instagram', name: 'Instagram', color: '#EC4899' },
        { key: 'tiktok', name: 'TikTok', color: '#000000' },
        { key: 'linkedin', name: 'LinkedIn Ads', color: '#0077B5' },
        { key: 'youtube', name: 'YouTube', color: '#FF0000' }
      ]

      const generatedData = platforms.map(platform => {
        const manualPercentage = parseFloat(allocation[platform.key] || '0')
        const manualAmount = (manualPercentage / 100) * totalBudget
        
        // Generate random AI allocation
        const aiAllocation = generateRandomAIAllocation(totalBudget)
        const aiPlatform = aiAllocation.find(p => p.platform === platform.name)
        const aiAmount = aiPlatform ? aiPlatform.amount : 0
        
        const change = aiAmount - manualAmount

        return {
          platform: platform.name,
          manual: manualAmount,
          aiOptimized: aiAmount,
          change: change,
          color: platform.color
        }
      })

      setAllocationData(generatedData)
    } else {
      router.push('/')
    }
  }, [router])

  const handleProceedWithManual = () => {
    // Route to manual allocation flow
    router.push('/campaign-setup')
  }

  const handleProceedWithAI = () => {
    // Route to AI optimization flow
    router.push('/ai-optimizer')
  }

  if (!campaignData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI vs Manual Comparison
            </h1>
            <p className="text-gray-600">
              Compare your manual allocation with AI-powered optimization
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projected ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-blue-600">{kpiData.projectedROI.manual}%</span>
                <span className="text-sm text-gray-500">Manual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-red-600">{kpiData.projectedROI.ai}%</span>
                <span className="text-sm text-gray-500">AI</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Est. Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-blue-600">${kpiData.estimatedRevenue.manual.toLocaleString()}</span>
                <span className="text-sm text-gray-500">Manual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-red-600">${kpiData.estimatedRevenue.ai.toLocaleString()}</span>
                <span className="text-sm text-gray-500">AI</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Est. Conversions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-blue-600">{kpiData.estimatedConversions.manual}</span>
                <span className="text-sm text-gray-500">Manual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">{kpiData.estimatedConversions.ai}</span>
                <span className="text-sm text-gray-500">AI</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {kpiData.improvement}%
                </div>
                <div className="text-sm text-gray-500">AI vs Manual</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Comparison Content */}
        <Tabs defaultValue="visual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visual">Visual Comparison</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Breakdown</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Manual Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Your Manual Allocation
                  </CardTitle>
                  <CardDescription>
                    Budget distribution based on your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData.filter(item => item.manual > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ platform, manual }) => `${platform} ${Math.round((manual / parseFloat(campaignData.budget)) * 100)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="manual"
                        >
                          {allocationData.filter(item => item.manual > 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Budget']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* AI Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Optimization
                  </CardTitle>
                  <CardDescription>
                    Data-driven allocation for maximum ROI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData.filter(item => item.aiOptimized > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ platform, aiOptimized }) => `${platform} ${Math.round((aiOptimized / parseFloat(campaignData.budget)) * 100)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="aiOptimized"
                        >
                          {allocationData.filter(item => item.aiOptimized > 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Budget']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Budget Allocation Comparison
                </CardTitle>
                <CardDescription>
                  Direct comparison of channel allocations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={allocationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Budget']} />
                      <Bar dataKey="manual" fill="#3B82F6" name="Manual" />
                      <Bar dataKey="aiOptimized" fill="#10B981" name="AI Optimized" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Optimization Insights
                </CardTitle>
                <CardDescription>
                  Key recommendations and optimization strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Increased Allocations</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Facebook Ads: +40% allocation for better reach</li>
                      <li>• Google Ads: +25% for high-intent traffic</li>
                      <li>• Instagram: +15% for visual engagement</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Decreased Allocations</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• LinkedIn Ads: -5% (lower ROI for your industry)</li>
                      <li>• YouTube: -5% (optimize for better targeting)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Proceed with Manual Allocation</h3>
                  <p className="text-gray-600 text-sm">Continue with your preferred budget distribution.</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleProceedWithManual}
                  className="flex items-center gap-2"
                >
                  Use My Allocation
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Proceed with AI Optimization</h3>
                  <p className="text-gray-600 text-sm">Recommended: Use data-driven allocation for better performance.</p>
                </div>
                <Button 
                  onClick={handleProceedWithAI}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  Use AI Optimization
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
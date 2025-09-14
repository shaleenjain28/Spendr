'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  Lightbulb,
  Users,
  Globe,
  Zap,
  CheckCircle
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface ChannelData {
  id: string
  name: string
  percentage: number
  budget: number
  color: string
  profits: string
  caseStudy: {
    company: string
    situation: string
    solution: string
    result: string
  }
  reasoning: string
}

export default function ChannelBreakdownPage() {
  const router = useRouter()
  const [totalBudget, setTotalBudget] = useState(100000)
  const [channels, setChannels] = useState<ChannelData[]>([
    {
      id: 'facebook',
      name: 'Paid Social Facebook',
      percentage: 35,
      budget: 35000,
      color: '#3B82F6',
      profits: 'High engagement, excellent targeting, strong ROI for B2C',
      caseStudy: {
        company: 'TechStart Inc.',
        situation: 'Low brand awareness in target demographic',
        solution: 'Allocated 40% budget to Facebook with video ads',
        result: 'Increased brand awareness by 180% and reduced CAC by 45%'
      },
      reasoning: 'Facebook offers superior demographic targeting and high engagement rates, making it ideal for building brand awareness and driving conversions.'
    },
    {
      id: 'google',
      name: 'Google Ads',
      percentage: 25,
      budget: 25000,
      color: '#10B981',
      profits: 'High intent traffic, excellent conversion rates, measurable ROI',
      caseStudy: {
        company: 'E-commerce Plus',
        situation: 'Need for high-intent traffic and immediate conversions',
        solution: 'Focused 30% budget on Google Search and Shopping ads',
        result: 'Achieved 320% ROAS and 25% increase in conversion rate'
      },
      reasoning: 'Google Ads capture users with high purchase intent, providing excellent conversion rates and measurable ROI for direct response campaigns.'
    },
    {
      id: 'display',
      name: 'Display Advertising',
      percentage: 20,
      budget: 20000,
      color: '#F59E0B',
      profits: 'Broad reach, retargeting capabilities, brand visibility',
      caseStudy: {
        company: 'FashionForward',
        situation: 'Need to reach broad audience and retarget website visitors',
        solution: 'Used 25% budget for display ads with retargeting',
        result: 'Increased website traffic by 150% and improved retargeting conversion by 60%'
      },
      reasoning: 'Display advertising provides broad reach and excellent retargeting capabilities, essential for building brand awareness and converting warm leads.'
    },
    {
      id: 'affiliate',
      name: 'Affiliate Marketing',
      percentage: 12,
      budget: 12000,
      color: '#EF4444',
      profits: 'Performance-based, scalable, diverse partner network',
      caseStudy: {
        company: 'HealthTech Solutions',
        situation: 'Need for performance-based marketing with lower risk',
        solution: 'Allocated 15% to affiliate partnerships with health influencers',
        result: 'Generated 40% of total sales through affiliates with 280% ROAS'
      },
      reasoning: 'Affiliate marketing offers performance-based results with lower upfront risk, making it ideal for scaling marketing efforts with proven partners.'
    },
    {
      id: 'email',
      name: 'Email Marketing',
      percentage: 8,
      budget: 8000,
      color: '#8B5CF6',
      profits: 'High ROI, direct communication, customer retention',
      caseStudy: {
        company: 'SaaS Pro',
        situation: 'Need to nurture leads and retain existing customers',
        solution: 'Invested 10% in email automation and segmentation',
        result: 'Increased customer lifetime value by 65% and reduced churn by 30%'
      },
      reasoning: 'Email marketing provides the highest ROI of all channels, offering direct communication and excellent customer retention capabilities.'
    }
  ])

  const [isSliderModalOpen, setIsSliderModalOpen] = useState(false)

  useEffect(() => {
    // Update budgets when total budget changes
    setChannels(prev => prev.map(channel => ({
      ...channel,
      budget: Math.round((channel.percentage / 100) * totalBudget)
    })))
  }, [totalBudget])

  const handleSliderChange = (channelId: string, newPercentage: number) => {
    setChannels(prev => {
      const updated = prev.map(channel => {
        if (channel.id === channelId) {
          return { ...channel, percentage: newPercentage, budget: Math.round((newPercentage / 100) * totalBudget) }
        }
        return channel
      })
      
      // Rebalance other channels to maintain 100% total
      const changedChannel = updated.find(c => c.id === channelId)!
      const otherChannels = updated.filter(c => c.id !== channelId)
      const remainingPercentage = 100 - changedChannel.percentage
      const totalOtherPercentage = otherChannels.reduce((sum, c) => sum + c.percentage, 0)
      
      if (totalOtherPercentage > 0) {
        const scaleFactor = remainingPercentage / totalOtherPercentage
        return updated.map(channel => {
          if (channel.id !== channelId) {
            const newPercentage = Math.round(channel.percentage * scaleFactor * 100) / 100
            return { ...channel, percentage: newPercentage, budget: Math.round((newPercentage / 100) * totalBudget) }
          }
          return channel
        })
      }
      
      return updated
    })
  }

  const handleChannelClick = (channelId: string) => {
    // This would normally route to a detailed channel page
    console.log(`Clicked on channel: ${channelId}`)
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
                onClick={() => router.push('/ai-optimizer')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to AI Optimizer
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Channel Breakdown Analysis
                </h1>
                <p className="text-gray-600">
                  Detailed analysis of budget allocation and channel performance
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsSliderModalOpen(true)}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Adjust Budget
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Budget Distribution
              </CardTitle>
              <CardDescription>
                Click on any segment to view detailed analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channels}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="percentage"
                      onClick={(data) => handleChannelClick(data.id)}
                    >
                      {channels.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value}% ($${props.payload.budget.toLocaleString()})`, 
                        'Budget'
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Budget Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Summary
              </CardTitle>
              <CardDescription>
                Total budget: ${totalBudget.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: channel.color }}
                      />
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${channel.budget.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{channel.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel Details */}
        <div className="mt-8 space-y-6">
          {channels.map((channel) => (
            <Card key={channel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: channel.color }}
                    />
                    <CardTitle className="text-xl">{channel.name}</CardTitle>
                    <span className="text-lg font-bold text-gray-600">
                      {channel.percentage}% (${channel.budget.toLocaleString()})
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Why This Percentage?
                    </h4>
                    <p className="text-sm text-gray-600">{channel.reasoning}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      Expected Profits
                    </h4>
                    <p className="text-sm text-gray-600">{channel.profits}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-600" />
                    Case Study: {channel.caseStudy.company}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Situation:</span>
                      <p className="text-gray-600 mt-1">{channel.caseStudy.situation}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Solution:</span>
                      <p className="text-gray-600 mt-1">{channel.caseStudy.solution}</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-700">Result:</span>
                      <p className="text-green-600 mt-1 font-medium">{channel.caseStudy.result}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Slider Modal */}
        {isSliderModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Adjust Budget Allocation
                </CardTitle>
                <CardDescription>
                  Modify channel percentages. Other channels will automatically rebalance to maintain 100% total.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {channels.map((channel) => (
                  <div key={channel.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: channel.color }}
                        />
                        <span className="font-medium">{channel.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{channel.percentage}%</span>
                        <div className="text-sm text-gray-600">${channel.budget.toLocaleString()}</div>
                      </div>
                    </div>
                    <Slider
                      value={[channel.percentage]}
                      onValueChange={(value) => handleSliderChange(channel.id, value[0])}
                      max={50}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSliderModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsSliderModalOpen(false)}>
                    Apply Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}



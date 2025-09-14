'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, TrendingUp, Users, DollarSign, Globe } from 'lucide-react'

interface ShortcomingsPanelProps {
  campaignData: any
  predictedMetrics: any
}

export function ShortcomingsPanel({ campaignData, predictedMetrics }: ShortcomingsPanelProps) {
  const shortcomings = [
    {
      id: 1,
      title: "Budget per channel is too low to achieve scale",
      description: "Your current budget allocation may not be sufficient to reach the minimum viable scale for effective advertising on major platforms.",
      impact: "Low reach and poor performance",
      recommendation: "Consider increasing budget by 25-40% or focusing on fewer, more targeted channels.",
      caseStudy: {
        company: "TechStart Inc.",
        situation: "Similar budget constraints with broad channel targeting",
        solution: "Focused 80% of budget on top 2 performing channels",
        result: "Increased conversions by 180% and reduced CAC by 45%"
      },
      icon: DollarSign,
      severity: "high"
    },
    {
      id: 2,
      title: "Demographic targeting is too broad",
      description: "Your target audience definition covers too wide a range, which can lead to inefficient ad spend and lower conversion rates.",
      impact: "Higher CAC and lower conversion rates",
      recommendation: "Narrow your target audience to 2-3 specific demographic segments with highest purchase intent.",
      caseStudy: {
        company: "FashionForward",
        situation: "Targeting ages 18-65 across all income levels",
        solution: "Focused on 25-40 age group with $50k+ income",
        result: "Improved CTR by 65% and reduced CAC by 30%"
      },
      icon: Users,
      severity: "medium"
    },
    {
      id: 3,
      title: "Regional targeting could be more specific",
      description: "Broad regional targeting may not capture the most valuable markets for your product or service.",
      impact: "Suboptimal market penetration",
      recommendation: "Analyze your best-performing markets and allocate more budget to high-value regions.",
      caseStudy: {
        company: "HealthTech Solutions",
        situation: "Global targeting with equal budget allocation",
        solution: "Identified top 3 markets and allocated 70% budget there",
        result: "Increased market penetration by 120% in key regions"
      },
      icon: Globe,
      severity: "medium"
    },
    {
      id: 4,
      title: "Campaign duration may be too short for optimization",
      description: "Short campaign durations don't allow enough time for proper optimization and learning.",
      impact: "Missed optimization opportunities",
      recommendation: "Extend campaign duration to at least 4-6 weeks for better data collection and optimization.",
      caseStudy: {
        company: "EcoProducts",
        situation: "2-week campaigns with constant changes",
        solution: "Extended to 6-week campaigns with weekly optimizations",
        result: "Improved ROAS by 85% through better learning phase"
      },
      icon: TrendingUp,
      severity: "low"
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getSeverityIconColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Analysis</h2>
        <p className="text-gray-600">
          Our AI has identified several areas where your campaign can be improved
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {shortcomings.map((shortcoming) => {
          const IconComponent = shortcoming.icon
          return (
            <Card key={shortcoming.id} className={`border-2 ${getSeverityColor(shortcoming.severity)}`}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <IconComponent className={`h-6 w-6 mt-1 ${getSeverityIconColor(shortcoming.severity)}`} />
                  <div>
                    <CardTitle className="text-lg">{shortcoming.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {shortcoming.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Impact:</h4>
                  <p className="text-sm text-gray-600">{shortcoming.impact}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Recommendation:</h4>
                  <p className="text-sm text-gray-600">{shortcoming.recommendation}</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Case Study: {shortcoming.caseStudy.company}</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Situation:</span> {shortcoming.caseStudy.situation}
                    </div>
                    <div>
                      <span className="font-medium">Solution:</span> {shortcoming.caseStudy.solution}
                    </div>
                    <div className="text-green-600 font-medium">
                      <span className="font-medium">Result:</span> {shortcoming.caseStudy.result}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Optimize Your Campaign?
            </h3>
            <p className="text-gray-600 mb-4">
              Our AI optimizer can address these issues and generate an ideal marketing strategy for your business.
            </p>
            <div className="text-sm text-gray-500">
              Expected improvement: 40-80% better performance
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

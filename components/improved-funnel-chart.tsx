'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, MousePointer, ShoppingCart, TrendingUp } from 'lucide-react'

interface ImprovedFunnelChartProps {
  data: {
    impressions: number
    clicks: number
    conversions: number
  }
}

export function ImprovedFunnelChart({ data }: ImprovedFunnelChartProps) {
  const steps = [
    {
      name: 'Impressions',
      value: data.impressions,
      icon: Eye,
      color: 'bg-blue-500',
      description: 'People who saw your ad'
    },
    {
      name: 'Clicks',
      value: data.clicks,
      icon: MousePointer,
      color: 'bg-green-500',
      description: 'People who clicked on your ad'
    },
    {
      name: 'Conversions',
      value: data.conversions,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      description: 'People who completed desired action'
    }
  ]

  const calculateConversionRate = (from: number, to: number) => {
    if (from === 0) return 0
    return ((to / from) * 100).toFixed(1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Conversion Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            const isLast = index === steps.length - 1
            const nextStep = !isLast ? steps[index + 1] : null
            const conversionRate = nextStep ? calculateConversionRate(step.value, nextStep.value) : null

            return (
              <div key={step.name} className="relative">
                {/* Funnel Step */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-3 rounded-full ${step.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-lg">{step.name}</h3>
                      <span className="text-2xl font-bold text-gray-900">
                        {step.value.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>

                {/* Conversion Rate Arrow */}
                {!isLast && conversionRate && (
                  <div className="flex items-center justify-center my-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-full shadow-sm">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {conversionRate}% conversion rate
                      </span>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Performance Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Performance Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {calculateConversionRate(data.impressions, data.clicks)}%
                </div>
                <div className="text-gray-600">Click-through Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {calculateConversionRate(data.clicks, data.conversions)}%
                </div>
                <div className="text-gray-600">Conversion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {calculateConversionRate(data.impressions, data.conversions)}%
                </div>
                <div className="text-gray-600">Overall Conversion</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



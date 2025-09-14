'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Instagram, 
  Linkedin, 
  Facebook, 
  Search, 
  Twitter, 
  Youtube, 
  Music,
  Globe
} from 'lucide-react'

interface BudgetAllocationChartProps {
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
  totalBudget: number
}

export function BudgetAllocationChart({ budgetAllocation, totalBudget }: BudgetAllocationChartProps) {
  const platforms = [
    { key: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { key: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-gradient-to-r from-blue-600 to-blue-800' },
    { key: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-gradient-to-r from-blue-500 to-blue-700' },
    { key: 'google', name: 'Google', icon: Search, color: 'bg-gradient-to-r from-green-500 to-blue-500' },
    { key: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
    { key: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-gradient-to-r from-red-500 to-red-700' },
    { key: 'tiktok', name: 'TikTok', icon: Music, color: 'bg-gradient-to-r from-black to-gray-800' },
    { key: 'other', name: 'Other', icon: Globe, color: 'bg-gradient-to-r from-gray-500 to-gray-700' },
  ]

  const getPlatformData = () => {
    return platforms.map(platform => {
      const percentage = parseFloat(budgetAllocation?.[platform.key as keyof typeof budgetAllocation] || '0') || 0
      const budget = (percentage / 100) * totalBudget
      return {
        ...platform,
        percentage,
        budget
      }
    }).filter(platform => platform.percentage > 0)
  }

  const platformData = getPlatformData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Current Budget Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {platformData.length > 0 ? (
          <div className="space-y-4">
            {platformData.map((platform) => {
              const IconComponent = platform.icon
              return (
                <div key={platform.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${platform.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${platform.budget.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{platform.percentage}%</div>
                    </div>
                  </div>
                  <Progress value={platform.percentage} className="h-2" />
                </div>
              )
            })}
            
            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Allocated</span>
                <span className="font-bold">
                  {platformData.reduce((sum, p) => sum + p.percentage, 0)}%
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">Total Budget</span>
                <span className="text-sm font-medium">${totalBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No budget allocation data available</p>
            <p className="text-sm text-gray-500">Please fill in your budget allocation in the campaign setup</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

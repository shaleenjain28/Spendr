'use client'

import { Card, CardContent } from '@/components/ui/card'

interface RegionalHeatmapProps {
  region: string
}

export function RegionalHeatmap({ region }: RegionalHeatmapProps) {
  const regions = [
    { name: 'North America', value: region === 'north-america' ? 95 : 60, color: 'bg-red-500' },
    { name: 'Europe', value: region === 'europe' ? 90 : 55, color: 'bg-orange-500' },
    { name: 'Asia Pacific', value: region === 'asia-pacific' ? 85 : 50, color: 'bg-yellow-500' },
    { name: 'Latin America', value: region === 'latin-america' ? 80 : 45, color: 'bg-green-500' },
    { name: 'Middle East & Africa', value: region === 'middle-east-africa' ? 75 : 40, color: 'bg-blue-500' },
  ]

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Reach intensity by region (higher values indicate better reach potential)
      </div>
      {regions.map((region) => (
        <div key={region.name} className="flex items-center justify-between">
          <span className="text-sm font-medium">{region.name}</span>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${region.color}`}
                style={{ width: `${region.value}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-8">{region.value}%</span>
          </div>
        </div>
      ))}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-sm font-medium text-blue-900 mb-1">Target Region</div>
        <div className="text-sm text-blue-700">
          {regions.find(r => r.name.toLowerCase().replace(' & ', '-').replace(' ', '-') === region)?.name || 'Global'}
        </div>
      </div>
    </div>
  )
}

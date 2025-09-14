'use client'

import { FunnelChart as RechartsFunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface FunnelChartProps {
  data: {
    impressions: number
    clicks: number
    conversions: number
  }
}

export function FunnelChart({ data }: FunnelChartProps) {
  const funnelData = [
    { name: 'Impressions', value: data.impressions, fill: '#3B82F6' },
    { name: 'Clicks', value: data.clicks, fill: '#10B981' },
    { name: 'Conversions', value: data.conversions, fill: '#8B5CF6' },
  ]

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsFunnelChart>
          <Funnel
            dataKey="value"
            data={funnelData}
            isAnimationActive={true}
          >
            {funnelData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Funnel>
          <Tooltip 
            formatter={(value: number, name: string) => [
              value.toLocaleString(), 
              name
            ]}
          />
        </RechartsFunnelChart>
      </ResponsiveContainer>
    </div>
  )
}

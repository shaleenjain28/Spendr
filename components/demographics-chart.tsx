'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface DemographicsChartProps {
  demographics: string
}

export function DemographicsChart({ demographics }: DemographicsChartProps) {
  // Parse demographics and create sample data
  const parseDemographics = (demographics: string) => {
    // This is a simplified parser - in a real app, you'd have more sophisticated parsing
    const ageMatch = demographics.match(/(\d+)-(\d+)/)
    const ageRange = ageMatch ? `${ageMatch[1]}-${ageMatch[2]}` : '25-35'
    
    return [
      { name: `Age ${ageRange}`, value: 35, fill: '#3B82F6' },
      { name: 'Age 36-45', value: 25, fill: '#10B981' },
      { name: 'Age 18-24', value: 20, fill: '#F59E0B' },
      { name: 'Age 46-55', value: 15, fill: '#EF4444' },
      { name: 'Age 55+', value: 5, fill: '#8B5CF6' },
    ]
  }

  const data = parseDemographics(demographics)

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

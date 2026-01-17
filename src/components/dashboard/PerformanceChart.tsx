'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeSeriesData } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PerformanceChartProps {
  data: TimeSeriesData[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Email Performance Trends (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sent" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Sent"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="delivered" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Delivered"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="opened" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Opened"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="clicked" 
              stroke="#6366f1" 
              strokeWidth={2}
              name="Clicked"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="bounced" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Bounced"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

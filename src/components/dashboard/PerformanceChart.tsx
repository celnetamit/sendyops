'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeSeriesData } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'

interface PerformanceChartProps {
  data: TimeSeriesData[]
}

type TimeRange = '7d' | '30d' | '90d'

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')

  // Filter data based on selected range
  const filteredData = data.slice(
      timeRange === '7d' ? -7 : 
      timeRange === '30d' ? -30 : 
      0 // 90d or all available (API default is 30 currently so 90 would need API update)
  )

  return (
    <Card className="col-span-2 shadow-sm border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-gray-800">Email Performance Trends</CardTitle>
        <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
          {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                timeRange === range
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getDate()}`
                }}
                dy={10}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6b7280' }} 
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  padding: '12px'
                }}
                itemStyle={{ fontSize: '12px' }}
                labelStyle={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '0px' }}
              />
              <Line 
                type="monotone" 
                dataKey="sent" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Sent"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="delivered" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Delivered"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="opened" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Opened"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="clicked" 
                stroke="#6366f1" 
                strokeWidth={2}
                name="Clicked"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

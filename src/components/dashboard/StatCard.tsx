import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number | string
  trend?: number
  format?: 'number' | 'percentage'
  icon?: React.ReactNode
}

export function StatCard({ title, value, trend, format = 'number', icon }: StatCardProps) {
  const formattedValue = typeof value === 'number' && format === 'number' 
    ? formatNumber(value) 
    : value

  const trendColor = trend && trend > 0 ? 'text-emerald-600' : trend && trend < 0 ? 'text-rose-600' : 'text-gray-500'
  const trendBgColor = trend && trend > 0 ? 'bg-emerald-50' : trend && trend < 0 ? 'bg-rose-50' : 'bg-gray-50'
  const TrendIcon = trend && trend > 0 ? ArrowUp : ArrowDown

  return (
    <Card className="relative overflow-hidden border-gray-200 hover:shadow-lg transition-all duration-300 group">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && (
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {formattedValue}
        </div>
        {trend !== undefined && (
          <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-semibold ${trendColor} ${trendBgColor}`}>
            <TrendIcon className="h-3 w-3" />
            <span>{Math.abs(trend)}% from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

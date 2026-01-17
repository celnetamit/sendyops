'use client'

import { useState } from 'react'
import { Campaign } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, ArrowUpDown } from 'lucide-react'
import { formatNumber, formatPercentage, formatDateTime } from '@/lib/utils'

interface CampaignListProps {
  campaigns: Campaign[]
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Campaign>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'secondary'> = {
      sent: 'success',
      sending: 'info',
      scheduled: 'warning',
      draft: 'secondary',
      paused: 'warning',
      cancelled: 'error'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' 
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    return 0
  })

  const handleSort = (field: keyof Campaign) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Campaigns</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  <button 
                    onClick={() => handleSort('title')}
                    className="flex items-center hover:text-gray-900"
                  >
                    Campaign <ArrowUpDown className="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Brand</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  <button 
                    onClick={() => handleSort('totalSent')}
                    className="flex items-center ml-auto hover:text-gray-900"
                  >
                    Sent <ArrowUpDown className="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  <button 
                    onClick={() => handleSort('deliveryRate')}
                    className="flex items-center ml-auto hover:text-gray-900"
                  >
                    Delivery <ArrowUpDown className="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  <button 
                    onClick={() => handleSort('openRate')}
                    className="flex items-center ml-auto hover:text-gray-900"
                  >
                    Open Rate <ArrowUpDown className="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  <button 
                    onClick={() => handleSort('clickRate')}
                    className="flex items-center ml-auto hover:text-gray-900"
                  >
                    Click Rate <ArrowUpDown className="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  <button 
                    onClick={() => handleSort('bounceRate')}
                    className="flex items-center ml-auto hover:text-gray-900"
                  >
                    Bounce <ArrowUpDown className="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  <button 
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center hover:text-gray-900"
                  >
                    Created <ArrowUpDown className="ml-1 h-3 w-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{campaign.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{campaign.subject}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(campaign.status)}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{campaign.brandName}</td>
                  <td className="py-3 px-4 text-right text-sm text-gray-900 font-medium">
                    {formatNumber(campaign.totalSent)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium ${campaign.deliveryRate >= 95 ? 'text-green-600' : campaign.deliveryRate >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatPercentage(campaign.deliveryRate)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium ${campaign.openRate >= 25 ? 'text-green-600' : campaign.openRate >= 15 ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {formatPercentage(campaign.openRate)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium ${campaign.clickRate >= 5 ? 'text-green-600' : campaign.clickRate >= 2 ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {formatPercentage(campaign.clickRate)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium ${campaign.bounceRate <= 2 ? 'text-green-600' : campaign.bounceRate <= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatPercentage(campaign.bounceRate)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDateTime(campaign.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedCampaigns.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No campaigns found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

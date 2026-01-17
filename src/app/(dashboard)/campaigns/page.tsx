'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { initializeMockData } from '@/lib/mockData'
import { Campaign } from '@/types'
import { formatNumber, formatPercentage } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch('/api/campaigns')
        const data = await res.json()
        setCampaigns(data)
      } catch (error) {
        console.error('Failed to fetch campaigns:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading campaigns...</p>
        </div>
      </div>
    )
  }



  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-700 border-green-200'
      case 'sending': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'scheduled': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Campaigns
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and monitor all your email campaigns
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
          Create Campaign
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{campaigns.length}</div>
            <p className="text-sm text-gray-600 mt-1">Total Campaigns</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {campaigns.filter(c => c.status === 'sent').length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Sent</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {campaigns.filter(c => c.status === 'sending').length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Sending</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {campaigns.filter(c => c.status === 'scheduled').length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Scheduled</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search campaigns by title or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="sending">Sending</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
              </select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="border-gray-200 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {campaign.title}
                    </h3>
                    <Badge className={`${getStatusColor(campaign.status)} border`}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{campaign.subject}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Brand: <span className="font-medium text-gray-700">{campaign.brandName}</span></span>
                    <span>List: <span className="font-medium text-gray-700">{campaign.listName}</span></span>
                    <span>Sent: <span className="font-medium text-gray-700">{campaign.sentAt ? format(new Date(campaign.sentAt), 'MMM d, yyyy HH:mm') : 'N/A'}</span></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Metrics */}
              {campaign.status === 'sent' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Sent</p>
                      <p className="text-sm font-semibold text-gray-900">{formatNumber(campaign.recipients)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Delivered</p>
                      <p className="text-sm font-semibold text-green-600">
                        {campaign.recipients > 0 
                          ? formatPercentage(((campaign.recipients - campaign.bounced) / campaign.recipients) * 100) 
                          : '0%'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Opened</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {campaign.recipients > 0 
                          ? formatPercentage((campaign.opened / campaign.recipients) * 100) 
                          : '0%'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clicked</p>
                      <p className="text-sm font-semibold text-indigo-600">
                        {campaign.recipients > 0 
                          ? formatPercentage((campaign.clicked / campaign.recipients) * 100) 
                          : '0%'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Bounced</p>
                      <p className="text-sm font-semibold text-red-600">
                        {campaign.recipients > 0 
                          ? formatPercentage((campaign.bounced / campaign.recipients) * 100) 
                          : '0%'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Unsubscribed</p>
                      <p className="text-sm font-semibold text-gray-600">{campaign.unsubscribed}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No campaigns found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

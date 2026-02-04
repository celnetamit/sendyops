'use client'

import { useState, useEffect } from 'react'
import { Search, Download, Eye, Edit, Trash2, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { formatNumber, formatPercentage } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, User, BarChart } from 'lucide-react'

import { Suspense } from 'react'

function CampaignsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const senderParam = searchParams.get('sender')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [senderStats, setSenderStats] = useState<any>(null)

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        if (senderParam) queryParams.set('sender', senderParam)
        
        const res = await fetch(`/api/campaigns?${queryParams.toString()}`)
        const data = await res.json()
        setCampaigns(data)

        if (senderParam) {
           const statsRes = await fetch(`/api/stats/sender?sender=${senderParam}`)
           const statsData = await statsRes.json()
           setSenderStats(statsData)
        } else {
           setSenderStats(null)
        }

      } catch (error) {
        console.error('Failed to fetch campaigns:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaigns()
  }, [senderParam])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading workshops...</p>
        </div>
      </div>
    )
  }



  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (campaign.senderName && campaign.senderName.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || campaign.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'courses': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'workshops': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'general': return 'bg-gray-100 text-gray-700 border-gray-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'courses': return '📚'
      case 'workshops': return '🎯'
      case 'general': return '📧'
      default: return '📧'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {senderParam ? `Workshops by ${senderStats?.name || senderParam}` : 'Workshops'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {senderParam ? 'Viewing specific user history and statistics' : 'Manage and monitor all your email workshops'}
          </p>
        </div>
        {!senderParam && (
          <Link href="/campaigns/new">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
              Create Workshop
            </Button>
          </Link>
        )}
        {senderParam && (
            <Button variant="outline" onClick={() => router.push('/campaigns')}>
                <X className="h-4 w-4 mr-2" />
                Clear Filter
            </Button>
        )}
      </div>

      {/* Sender Stats Card */}
      {senderParam && senderStats && (
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-blue-100">
            <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        {senderParam.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{senderParam}</h2>
                        <p className="text-sm text-gray-500">Workshop Organizer</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <BarChart className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Total Workshops</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(senderStats.totalWorkshops)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <User className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Total Mails Sent</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{formatNumber(senderStats.totalMails)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Activity className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Active Workshops</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{senderStats.activeWorkshops}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{campaigns.length}</div>
            <p className="text-sm text-gray-600 mt-1">Total Workshops</p>
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
                placeholder="Search workshops by title or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="courses">📚 Courses</option>
                <option value="workshops">🎯 Workshops</option>
                <option value="general">📧 General</option>
              </select>
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
                    <Badge className={`${getCategoryColor(campaign.category || 'general')} border`}>
                      {getCategoryIcon(campaign.category || 'general')} {campaign.category || 'general'}
                    </Badge>
                    <Badge className={`${getStatusColor(campaign.status)} border`}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{campaign.subject}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    {campaign.senderName && (
                      <span className="flex items-center gap-1">
                        Scheduled By: 
                        <button 
                            onClick={() => router.push(`/campaigns?sender=${encodeURIComponent(campaign.senderName)}`)}
                            className="font-medium text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                        >
                            {campaign.senderName}
                        </button>
                      </span>
                    )}
                    {campaign.senderDepartment && (
                      <span>Department: <span className="font-medium text-gray-700">{campaign.senderDepartment}</span></span>
                    )}
                    {campaign.topic && (
                      <span>Topic: <span className="font-medium text-gray-700">{campaign.topic}</span></span>
                    )}
                    <span>Time & Date: <span className="font-medium text-gray-700">{campaign.sentAt ? format(new Date(campaign.sentAt), 'MMM d, yyyy HH:mm') : 'N/A'}</span></span>
                    
                    {/* Scheduled Count Display */}
                    {(campaign.status === 'scheduled' || campaign.status === 'draft') && (
                        <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                           {campaign.recipients} {campaign.status === 'scheduled' ? 'Scheduled Recipients' : 'Est. Recipients'}
                        </span>
                    )}
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
            <p className="text-gray-500">No workshops found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function CampaignsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading workshops...</p>
        </div>
      </div>
    }>
      <CampaignsContent />
    </Suspense>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, User, Building2, Target, Calendar, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumber, formatPercentage } from '@/lib/utils'
import { format } from 'date-fns'


// Mock hourly data for the graph


export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const res = await fetch(`/api/campaigns/${params.id}`)
        const data = await res.json()
        setCampaign(data)
      } catch (error) {
        console.error('Failed to fetch campaign:', error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchCampaign()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading campaign details...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Campaign not found</p>
        <Button onClick={() => router.push('/campaigns')} className="mt-4">
          Back to Campaigns
        </Button>
      </div>
    )
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push('/campaigns')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {campaign.title}
            </h1>
            <Badge className={`${getCategoryColor(campaign.category || 'general')} border`}>
              {getCategoryIcon(campaign.category || 'general')} {campaign.category || 'general'}
            </Badge>
            <Badge className={`${getStatusColor(campaign.status)} border`}>
              {campaign.status}
            </Badge>
          </div>
          <p className="text-gray-600">{campaign.subject}</p>
        </div>
      </div>

      {/* Sender Information */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Sender Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Sender Name</p>
                <p className="font-semibold text-gray-900">{campaign.senderName || campaign.fromName || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-purple-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-semibold text-gray-900">{campaign.senderDepartment || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-semibold text-gray-900">{campaign.fromEmail || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-orange-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Target Audience</p>
                <p className="font-semibold text-gray-900">{campaign.targetAudience || 'N/A'}</p>
              </div>
            </div>
          </div>
          {campaign.topic && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Campaign Topic</p>
              <p className="text-gray-900">{campaign.topic}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(campaign.recipients)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Rate</p>
                <p className="text-2xl font-bold text-green-600">{formatPercentage(campaign.deliveryRate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Open Rate</p>
                <p className="text-2xl font-bold text-blue-600">{formatPercentage(campaign.openRate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Click Rate</p>
                <p className="text-2xl font-bold text-indigo-600">{formatPercentage(campaign.clickRate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bounce Rate</p>
                <p className="text-2xl font-bold text-red-600">{formatPercentage(campaign.bounceRate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Campaign Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Opened</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(campaign.opened)}</p>
              <p className="text-xs text-gray-500 mt-1">{formatPercentage(campaign.openRate)} of total</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Clicked</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(campaign.clicked)}</p>
              <p className="text-xs text-gray-500 mt-1">{formatPercentage(campaign.clickRate)} of total</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bounced</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(campaign.bounced)}</p>
              <p className="text-xs text-gray-500 mt-1">{formatPercentage(campaign.bounceRate)} of total</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Unsubscribed</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(campaign.unsubscribed)}</p>
              <p className="text-xs text-gray-500 mt-1">{formatPercentage(campaign.unsubscribeRate)} of total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Campaign Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-semibold text-gray-900">
                  {campaign.createdAt ? format(new Date(campaign.createdAt), 'PPpp') : 'N/A'}
                </p>
              </div>
            </div>
            {campaign.sentAt && (
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Sent</p>
                  <p className="font-semibold text-gray-900">
                    {format(new Date(campaign.sentAt), 'PPpp')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

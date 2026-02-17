'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, MousePointerClick, TrendingUp, Calendar, Clock, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

interface Activity {
  id: string
  type: string
  title: string
  timestamp: string | Date
  details: string
}

interface SubscriberProfile {
  id: string
  email: string
  name: string | null
  status: string
  timestamp: string
  listId: string
  stats: {
    totalSent: number
    openRate: number
    clickRate: number
  }
  activity: Activity[]
}

export default function SubscriberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<SubscriberProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      if (!params.subscriberId) return
      try {
        const res = await fetch(`/api/subscribers/${params.subscriberId}`)
        if (!res.ok) throw new Error('Failed to fetch profile')
        const data = await res.json()
        setProfile(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [params.subscriberId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Subscriber not found</h2>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'unsubscribed': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'bounced': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.email}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getStatusColor(profile.status)}>{profile.status}</Badge>
            <span className="text-sm text-gray-500">
              Joined {format(new Date(profile.timestamp), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 border-gray-200 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Subscriber Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg"><User className="h-5 w-5 text-gray-600" /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-gray-900">{profile.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg"><Mail className="h-5 w-5 text-gray-600" /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900 break-all">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg"><Calendar className="h-5 w-5 text-gray-600" /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Added On</p>
                <p className="text-gray-900">{format(new Date(profile.timestamp), 'PPP')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Activity */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-gray-200">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{profile.stats.totalSent}</div>
                <p className="text-xs text-gray-500">Campaigns Sent</p>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{profile.stats.openRate}%</div>
                <p className="text-xs text-gray-500">Open Rate</p>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <MousePointerClick className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{profile.stats.clickRate}%</div>
                <p className="text-xs text-gray-500">Click Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profile.activity.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      {index !== profile.activity.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.details}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
                {profile.activity.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

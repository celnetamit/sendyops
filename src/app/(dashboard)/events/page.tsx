'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Mail, MousePointerClick, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { initializeMockData } from '@/lib/mockData'
import { EmailEvent, EmailEventType } from '@/types'
import { format } from 'date-fns'

export default function EventLogsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/logs')
        const data = await res.json()
        setEvents(data)
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading event logs...</p>
        </div>
      </div>
    )
  }



  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.message || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.type || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = eventTypeFilter === 'all' || event.type === eventTypeFilter
    return matchesSearch && matchesType
  })

  const getEventIcon = (type: EmailEventType) => {
    switch (type) {
      case 'sent': return <Mail className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'opened': return <Mail className="h-4 w-4" />
      case 'clicked': return <MousePointerClick className="h-4 w-4" />
      case 'bounced': return <AlertCircle className="h-4 w-4" />
      case 'unsubscribed': return <Mail className="h-4 w-4" />
      case 'failed': return <AlertCircle className="h-4 w-4" />
      default: return <Mail className="h-4 w-4" />
    }
  }

  const getEventColor = (type: EmailEventType) => {
    switch (type) {
      case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200'
      case 'opened': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'clicked': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'bounced': return 'bg-red-100 text-red-700 border-red-200'
      case 'unsubscribed': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'failed': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const stats = {
    sent: events.filter(e => e.type === 'mail_sent').length,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    failed: events.filter(e => e.type === 'error').length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Event Logs
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Real-time tracking of all email events and activities
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="text-xl font-bold text-blue-600">{stats.sent}</div>
            <p className="text-xs text-gray-600 mt-1">Sent</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="text-xl font-bold text-green-600">{stats.delivered}</div>
            <p className="text-xs text-gray-600 mt-1">Delivered</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="text-xl font-bold text-purple-600">{stats.opened}</div>
            <p className="text-xs text-gray-600 mt-1">Opened</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="text-xl font-bold text-indigo-600">{stats.clicked}</div>
            <p className="text-xs text-gray-600 mt-1">Clicked</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="text-xl font-bold text-red-600">{stats.bounced}</div>
            <p className="text-xs text-gray-600 mt-1">Bounced</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="text-xl font-bold text-orange-600">{stats.failed}</div>
            <p className="text-xs text-gray-600 mt-1">Failed</p>
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
                placeholder="Search by email, campaign, or recipient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Events</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="opened">Opened</option>
              <option value="clicked">Clicked</option>
              <option value="bounced">Bounced</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Event Timeline */}
      <div className="space-y-3">
        {filteredEvents.slice(0, 100).map((event) => (
          <Card key={event.id} className="border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getEventColor(event.eventType).replace('border-', 'bg-').replace('text-', 'text-')}`}>
                  {getEventIcon(event.eventType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`${getEventColor(event.type as any)} border text-xs`}>
                      {event.type}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {format(new Date(event.timestamp), 'MMM d, yyyy HH:mm:ss')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {event.message}
                  </p>
                  {event.linkUrl && (
                    <p className="text-xs text-gray-500">
                      Clicked: <span className="text-blue-600">{event.linkUrl}</span>
                    </p>
                  )}
                  {event.bounceReason && (
                    <p className="text-xs text-red-600">
                      Reason: {event.bounceReason}
                    </p>
                  )}
                  {event.failureReason && (
                    <p className="text-xs text-orange-600">
                      Error: {event.failureReason}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-xs text-gray-500">
                      Location: {event.location.city}, {event.location.country}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No events found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

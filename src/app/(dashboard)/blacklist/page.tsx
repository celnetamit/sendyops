
'use client'

import { useState, useEffect } from 'react'
import { Search, Download, ShieldAlert, Ban, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatNumber } from '@/lib/utils'
import { format } from 'date-fns'

export default function BlacklistPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchBlacklisted() {
      try {
        // fetching all and filtering locally for now, optimization would be API filter
        const res = await fetch('/api/subscribers')
        const data = await res.json()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const blacklisted = data.filter((s: any) => 
            ['bounced', 'unsubscribed', 'complained'].includes(s.status)
        )
        setSubscribers(blacklisted)
      } catch (error) {
        console.error('Failed to fetch blacklist:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlacklisted()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading blacklist...</p>
        </div>
      </div>
    )
  }

  // Filter 
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (subscriber.name && subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unsubscribed': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'bounced': return 'bg-red-100 text-red-700 border-red-200'
      case 'complained': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const stats = {
    total: subscribers.length,
    bounced: subscribers.filter(s => s.status === 'bounced').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    complained: subscribers.filter(s => s.status === 'complained').length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-900 to-red-700 bg-clip-text text-transparent">
            Blacklist & Junk
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Monitor bounced emails, unsubscribes, and complaints
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
            <Download className="h-4 w-4" />
            Export Blacklist
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-red-100 bg-red-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{formatNumber(stats.bounced)}</div>
                <p className="text-sm text-gray-600 mt-1">Bounced</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <Ban className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-600">{formatNumber(stats.unsubscribed)}</div>
                <p className="text-sm text-gray-600 mt-1">Unsubscribed</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-100 bg-orange-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{formatNumber(stats.complained)}</div>
                <p className="text-sm text-gray-600 mt-1">Complaints</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
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
                placeholder="Search blacklist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Issues</option>
              <option value="bounced">Bounced</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="complained">Complaints</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Blacklist Table */}
      <Card className="border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.slice(0, 50).map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {subscriber.name && (
                        <div className="text-sm font-medium text-gray-900">{subscriber.name}</div>
                      )}
                      <div className="text-sm text-gray-500">{subscriber.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`${getStatusColor(subscriber.status)} border`}>
                      {subscriber.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(new Date(subscriber.timestamp), 'MMM d, yyyy HH:mm')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">System Sync</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredSubscribers.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No blacklisted emails found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

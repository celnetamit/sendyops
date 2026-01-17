'use client'

import { useState, useEffect } from 'react'
import { Mail, Send, MailOpen, MousePointerClick, AlertCircle, TrendingUp, BarChart3, Users } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { AlertsPanel } from '@/components/dashboard/AlertsPanel'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { CampaignList } from '@/components/campaigns/CampaignList'
import { initializeMockData } from '@/lib/mockData'
import { formatPercentage } from '@/lib/utils'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, campaignsRes, activityRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/campaigns'),
          fetch('/api/activity')
        ]);

        const statsData = await statsRes.json();
        const campaignsData = await campaignsRes.json();
        const activityData = await activityRes.json();

        setStats(statsData);
        setCampaigns(campaignsData);
        setActivity(activityData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [])

  // Show loading state while data is being initialized
  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Fallback for missing data
  const trends = stats.trendsVsPrevious || { sent: 0, delivered: 0, opened: 0, clicked: 0 };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor your email campaigns and track performance metrics in real-time
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Emails Sent"
          value={stats.totalEmailsSent}
          trend={trends.sent}
          icon={<Send className="h-5 w-5" />}
        />
        <StatCard
          title="Delivered"
          value={stats.totalDelivered}
          trend={trends.delivered}
          icon={<MailOpen className="h-5 w-5" />}
        />
        <StatCard
          title="Opened"
          value={stats.totalOpened}
          trend={trends.opened}
          icon={<MailOpen className="h-5 w-5" />}
        />
        <StatCard
          title="Clicked"
          value={stats.totalClicked}
          trend={trends.clicked}
          icon={<MousePointerClick className="h-5 w-5" />}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Delivery Rate"
          value={formatPercentage(stats.averageDeliveryRate)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Average Open Rate"
          value={formatPercentage(stats.averageOpenRate)}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          title="Average Click Rate"
          value={formatPercentage(stats.averageClickRate)}
          icon={<MousePointerClick className="h-5 w-5" />}
        />
        <StatCard
          title="Total Bounced"
          value={stats.totalBounced}
          icon={<AlertCircle className="h-5 w-5" />}
        />
      </div>

      {/* Chart and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PerformanceChart data={stats.timeSeriesData || []} />
        <ActivityFeed activities={activity} />
      </div>

      {/* Alerts Panel */}
      <AlertsPanel alerts={[]} />

      {/* Campaign List */}
      <CampaignList campaigns={campaigns} />
    </div>
  )
}

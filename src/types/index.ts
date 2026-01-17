// Types for the Sendy Email Tracking Dashboard

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled'
export type EmailEventType = 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed' | 'complained' | 'failed'
export type BounceType = 'hard' | 'soft' | 'complaint'
export type SubscriberStatus = 'subscribed' | 'unsubscribed' | 'bounced' | 'complained'
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'viewer'
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical'

export interface Campaign {
  id: string
  title: string
  subject: string
  status: CampaignStatus
  brandName: string
  listName: string
  fromName: string
  fromEmail: string
  scheduledAt?: Date
  sentAt?: Date
  totalRecipients: number
  totalSent: number
  totalDelivered: number
  totalBounced: number
  totalOpened: number
  totalClicked: number
  totalUnsubscribed: number
  totalFailed: number
  deliveryRate: number
  openRate: number
  clickRate: number
  bounceRate: number
  unsubscribeRate: number
  createdAt: Date
}

export interface EmailEvent {
  id: string
  eventTime: Date
  campaignId: string
  campaignTitle: string
  eventType: EmailEventType
  recipientEmail: string
  recipientName?: string
  subject: string
  linkUrl?: string
  bounceReason?: string
  failureReason?: string
  userAgent?: string
  ipAddress?: string
  location?: {
    city?: string
    country?: string
  }
}

export interface Subscriber {
  id: string
  email: string
  name?: string
  listName: string
  status: SubscriberStatus
  subscribedAt: Date
  unsubscribedAt?: Date
  bouncedAt?: Date
  totalCampaignsReceived: number
  totalOpens: number
  totalClicks: number
  engagementScore: number
}

export interface DashboardStats {
  totalCampaigns: number
  activeCampaigns: number
  totalEmailsSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  totalBounced: number
  totalFailed: number
  averageDeliveryRate: number
  averageOpenRate: number
  averageClickRate: number
  averageBounceRate: number
  trendsVsPrevious: {
    campaigns: number
    sent: number
    delivered: number
    opened: number
    clicked: number
  }
}

export interface Alert {
  id: string
  type: string
  severity: AlertSeverity
  title: string
  message: string
  campaignId?: string
  campaignTitle?: string
  thresholdValue?: number
  actualValue?: number
  isAcknowledged: boolean
  createdAt: Date
}

export interface TimeSeriesData {
  date: string
  sent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
}

export interface TopPerformer {
  campaignId: string
  title: string
  metric: string
  value: number
  change: number
}

export interface RecentActivity {
  id: string
  type: EmailEventType
  message: string
  timestamp: Date
  campaignTitle?: string
  email?: string
}

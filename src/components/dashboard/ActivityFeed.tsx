import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RecentActivity } from '@/types'
import { getRelativeTime } from '@/lib/utils'
import { Mail, MailOpen, MousePointerClick, AlertCircle, UserMinus, XCircle, CheckCircle } from 'lucide-react'

interface ActivityFeedProps {
  activities: RecentActivity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'sent':
        return <Mail className="h-4 w-4 text-blue-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'opened':
        return <MailOpen className="h-4 w-4 text-purple-500" />
      case 'clicked':
        return <MousePointerClick className="h-4 w-4 text-indigo-500" />
      case 'bounced':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'unsubscribed':
        return <UserMinus className="h-4 w-4 text-yellow-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Mail className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
              <div className="mt-0.5">{getIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                {activity.campaignTitle && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {activity.campaignTitle}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {getRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

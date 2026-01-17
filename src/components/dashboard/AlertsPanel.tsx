import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/types'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, AlertTriangle, Info, XCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface AlertsPanelProps {
  alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getBadgeVariant = (severity: string): 'error' | 'warning' | 'info' | 'default' => {
    switch (severity) {
      case 'critical':
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'default'
    }
  }

  const activeAlerts = alerts.filter(a => !a.isAcknowledged)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Active Alerts</CardTitle>
          <Badge variant="error">{activeAlerts.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Info className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No active alerts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="mt-0.5">{getIcon(alert.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                    <Badge variant={getBadgeVariant(alert.severity)} className="ml-2">
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                  {alert.campaignTitle && (
                    <p className="text-xs text-gray-500 truncate">
                      Campaign: {alert.campaignTitle}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDateTime(alert.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

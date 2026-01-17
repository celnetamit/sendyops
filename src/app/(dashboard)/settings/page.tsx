"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Bell, Shield, Key, Mail, Globe, Save, Link2 } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and application settings</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Update your personal details and public profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <Input defaultValue="Admin" placeholder="Enter your first name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <Input defaultValue="User" placeholder="Enter your last name" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="flex gap-2">
                <Input defaultValue="admin@sendy.com" readOnly className="bg-gray-50" />
                <Button variant="outline" className="shrink-0">Change</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t border-gray-100 bg-gray-50/50 p-4">
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-500" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Reports</p>
                  <p className="text-xs text-gray-500">Weekly performance summary</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Shield className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Security Alerts</p>
                  <p className="text-xs text-gray-500">Login attempts and password changes</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Campaign Updates</p>
                  <p className="text-xs text-gray-500">When campaigns are sent or completed</p>
                </div>
              </div>
              <input type="checkbox" className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Sendy Configuration - NEW */}
        <Card className="border-blue-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Link2 className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle>Sendy Configuration</CardTitle>
            </div>
            <CardDescription>Connect to your Sendy installation to sync campaigns and subscribers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Installation URL</label>
              <Input placeholder="https://sendy.yourdomain.com" />
              <p className="text-xs text-gray-500">The URL where your Sendy instance is hosted</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">API Key</label>
              <div className="relative">
                <Input type="password" placeholder="Enter your Sendy API Key" />
              </div>
              <p className="text-xs text-gray-500">Found in Sendy Settings &gt; API Key</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Brand ID (Optional)</label>
              <Input placeholder="Values like: 1, 2, or brand hash" />
            </div>
          </CardContent>
          <CardFooter className="justify-between border-t border-blue-50 bg-blue-50/30 p-4">
             <Button variant="outline" className="text-gray-600 hover:text-blue-600">
               Test Connection
             </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
          </CardFooter>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-indigo-500" />
              <CardTitle>App API Access</CardTitle>
            </div>
            <CardDescription>Manage your API keys and access tokens for this dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Public API Key</label>
              <div className="flex gap-2">
                <Input defaultValue="pk_live_51M0..." readOnly className="font-mono bg-gray-50 text-xs" />
                <Button variant="outline" size="sm" className="shrink-0">Copy</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

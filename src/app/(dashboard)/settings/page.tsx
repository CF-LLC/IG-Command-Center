'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoHashtags: true,
    autoReply: false,
    approvalRequired: true,
    emailNotifications: true,
    pushNotifications: true,
    timezone: 'America/New_York',
    language: 'en',
    postingTimes: ['09:00', '12:00', '18:00'],
  })

  const handleSave = () => {
    toast({ title: 'Settings saved successfully! ✅' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your IG Command Center preferences</p>
        </div>
        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto whitespace-nowrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic configuration for your workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Workspace Name</Label>
                <Input defaultValue="My Agency" />
              </div>
              <div className="grid gap-2">
                <Label>Timezone</Label>
                <Select value={settings.timezone} onValueChange={(v) => setSettings({ ...settings, timezone: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Language</Label>
                <Select value={settings.language} onValueChange={(v) => setSettings({ ...settings, language: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publishing" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Settings</CardTitle>
              <CardDescription>Control how content is published</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Approval Before Publishing</Label>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    All posts must be approved by an admin before being scheduled
                  </p>
                </div>
                <Switch
                  checked={settings.approvalRequired}
                  onCheckedChange={(v) => setSettings({ ...settings, approvalRequired: v })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Add Hashtags</Label>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Automatically suggest relevant hashtags when composing posts
                  </p>
                </div>
                <Switch
                  checked={settings.autoHashtags}
                  onCheckedChange={(v) => setSettings({ ...settings, autoHashtags: v })}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Default Posting Times</Label>
                <p className="text-sm text-muted-foreground">Optimal times suggested when scheduling</p>
                <div className="flex gap-2 flex-wrap">
                  {settings.postingTimes.map((time) => (
                    <Badge key={time} variant="outline" className="text-sm px-3 py-1">
                      {time}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">+ Add Time</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
                { key: 'autoReply', label: 'Auto-Reply to Comments', desc: 'Automatically reply to positive comments using AI' },
              ].map(({ key, label, desc }) => (
                <div key={key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{label}</Label>
                      <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    <Switch
                      checked={settings[key as keyof typeof settings] as boolean}
                      onCheckedChange={(v) => setSettings({ ...settings, [key]: v })}
                    />
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connected services and APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: 'Instagram Business API',
                  status: 'connected',
                  description: '5 accounts connected',
                  icon: '📸',
                },
                {
                  name: 'OpenAI (GPT-4)',
                  status: 'connected',
                  description: 'AI content generation enabled',
                  icon: '🤖',
                },
                {
                  name: 'Neon Postgres',
                  status: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? 'demo' : 'connected',
                  description: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? 'Using demo data' : 'Database connected',
                  icon: '🗄️',
                },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <span className="text-2xl">{integration.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                  <Badge
                    variant={integration.status === 'connected' ? 'success' : 'warning'}
                    className="capitalize"
                  >
                    {integration.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Plus, Instagram, CheckCircle2, XCircle, RefreshCw, Link, Unlink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DEMO_ACCOUNTS } from '@/lib/demo-data'

export default function AccountsPage() {
  const [accounts] = useState(DEMO_ACCOUNTS)

  const handleRefresh = (id: string) => {
    toast({ title: 'Account stats refreshed ✅' })
  }

  const handleDisconnect = (id: string) => {
    toast({ title: 'Account disconnected', variant: 'destructive' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Connected Accounts</h1>
          <p className="text-muted-foreground">{accounts.length} Instagram accounts connected</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>

      {/* Demo banner */}
      <div className="rounded-lg bg-primary/10 p-4 text-sm text-primary flex items-center gap-3">
        <Instagram className="h-5 w-5 shrink-0" />
        <div>
          <span className="font-medium">Demo Mode:</span> These accounts are simulated. In production,
          connect your real Instagram Business accounts via the Instagram API.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={account.avatar} alt={account.name} />
                    <AvatarFallback>{account.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="text-base">{account.name}</CardTitle>
                      {account.isVerified && (
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <CardDescription>@{account.username}</CardDescription>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{account.bio}</p>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold">{(account.followers / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{account.following.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{account.posts.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">{account.category}</Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRefresh(account.id)}
                    title="Refresh stats"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDisconnect(account.id)}
                    title="Disconnect"
                  >
                    <Unlink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add account card */}
        <Card className="border-dashed flex items-center justify-center min-h-[260px] cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="text-center p-6">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium">Connect New Account</p>
            <p className="text-sm text-muted-foreground mt-1">Add another Instagram Business account</p>
            <Button variant="outline" size="sm" className="mt-3">
              <Link className="h-3.5 w-3.5 mr-2" />
              Connect via Instagram
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

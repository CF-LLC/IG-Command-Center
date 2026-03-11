'use client'

import { useState } from 'react'
import { Plus, Mail, Shield, Clock, MoreHorizontal, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import { DEMO_TEAM, DEMO_ACCOUNTS } from '@/lib/demo-data'
import { formatDistanceToNow } from 'date-fns'
import type { TeamRole } from '@/types'

const ROLE_COLORS: Record<TeamRole, string> = {
  owner: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  editor: 'bg-green-100 text-green-700',
  viewer: 'bg-gray-100 text-gray-700',
}

const ROLE_PERMISSIONS: Record<TeamRole, string[]> = {
  owner: ['Full access', 'Billing', 'Delete account'],
  admin: ['Manage team', 'All content', 'All accounts'],
  editor: ['Create & schedule posts', 'Reply to comments', 'View analytics'],
  viewer: ['View posts', 'View analytics', 'View comments'],
}

export default function TeamPage() {
  const [team] = useState(DEMO_TEAM)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">{team.filter((m) => m.status === 'active').length} active members</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Role cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(['owner', 'admin', 'editor', 'viewer'] as TeamRole[]).map((role) => (
          <Card key={role}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`capitalize ${ROLE_COLORS[role]}`}>
                  {role}
                </Badge>
                <span className="text-2xl font-bold">
                  {team.filter((m) => m.role === role).length}
                </span>
              </div>
              <CardTitle className="text-sm capitalize">{role}s</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {ROLE_PERMISSIONS[role].map((perm) => (
                  <li key={perm} className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-500">✓</span> {perm}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Accounts</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${ROLE_COLORS[member.role]}`}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={member.status === 'active' ? 'success' : member.status === 'pending' ? 'warning' : 'secondary'}
                      className="capitalize"
                    >
                      {member.status === 'pending' ? '📧 Invite Sent' : member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      {member.assignedAccounts.length === DEMO_ACCOUNTS.length ? (
                        <Badge variant="secondary" className="text-xs">All accounts</Badge>
                      ) : member.assignedAccounts.length === 0 ? (
                        <span className="text-xs text-muted-foreground">None</span>
                      ) : (
                        member.assignedAccounts.slice(0, 2).map((accId) => {
                          const acc = DEMO_ACCOUNTS.find((a) => a.id === accId)
                          return acc ? (
                            <Badge key={accId} variant="outline" className="text-xs">
                              @{acc.username}
                            </Badge>
                          ) : null
                        })
                      )}
                      {member.assignedAccounts.length > 2 && member.assignedAccounts.length < DEMO_ACCOUNTS.length && (
                        <span className="text-xs text-muted-foreground">+{member.assignedAccounts.length - 2}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(member.lastActiveAt), { addSuffix: true })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        {member.status === 'pending' && (
                          <DropdownMenuItem>Resend Invite</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

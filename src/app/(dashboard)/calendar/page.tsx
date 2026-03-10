'use client'

import { useState } from 'react'
import Image from 'next/image'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { DEMO_CALENDAR_EVENTS } from '@/lib/demo-data'
import Link from 'next/link'
import type { CalendarEvent } from '@/types'

const STATUS_COLORS = {
  published: 'bg-green-500',
  scheduled: 'bg-blue-500',
  draft: 'bg-gray-400',
  pending_approval: 'bg-yellow-500',
  failed: 'bg-red-500',
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return DEMO_CALENDAR_EVENTS.filter((e) => isSameDay(parseISO(e.date), day))
  }

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : []

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  // Pad the start of the month grid with empty cells to align with day-of-week
  const firstDayOfWeek = monthStart.getDay()
  const paddedDays: (Date | undefined)[] = Array(firstDayOfWeek).fill(undefined).concat(days)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage your posts</p>
        </div>
        <Button asChild>
          <Link href="/composer">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {paddedDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} />
                  const events = getEventsForDay(day)
                  const isSelected = selectedDay && isSameDay(day, selectedDay)

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        'relative min-h-[72px] p-1.5 rounded-lg text-left transition-colors',
                        isToday(day) && 'ring-1 ring-primary',
                        isSelected ? 'bg-primary/10' : 'hover:bg-muted',
                      )}
                    >
                      <span className={cn(
                        'text-xs font-medium',
                        isToday(day) && 'text-primary font-bold',
                      )}>
                        {format(day, 'd')}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {events.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              'flex items-center gap-1 rounded px-1 py-0.5',
                              STATUS_COLORS[event.status] + '/20'
                            )}
                          >
                            <div className={cn('h-1.5 w-1.5 rounded-full shrink-0', STATUS_COLORS[event.status])} />
                            <span className="text-[10px] truncate leading-tight">{event.title}</span>
                          </div>
                        ))}
                        {events.length > 3 && (
                          <p className="text-[10px] text-muted-foreground px-1">+{events.length - 3} more</p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t flex-wrap">
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <div className={cn('h-2.5 w-2.5 rounded-full', color)} />
                    <span className="text-xs text-muted-foreground capitalize">{status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day detail panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {selectedDay ? format(selectedDay, 'EEEE, MMMM d') : 'Select a Day'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No posts on this day</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href="/composer">Schedule a post</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      {event.thumbnail ? (
                        <Image
                          src={event.thumbnail}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-md object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-muted shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={event.account?.avatar} />
                            <AvatarFallback>{event.account?.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{event.account?.name}</span>
                        </div>
                        <p className="text-xs font-medium line-clamp-2">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{event.time}</span>
                          <Badge
                            variant="outline"
                            className={cn('text-[10px] h-4 px-1', STATUS_COLORS[event.status] + '/20')}
                          >
                            {event.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

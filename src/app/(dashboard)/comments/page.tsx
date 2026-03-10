'use client'

import { useState } from 'react'
import { MessageSquare, Filter, Send, Archive, Flag, Sparkles, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { DEMO_COMMENTS, DEMO_ACCOUNTS } from '@/lib/demo-data'
import { commentsService } from '@/services/commentsService'
import { aiContentService } from '@/services/aiContentService'
import { formatDistanceToNow } from 'date-fns'
import type { Comment } from '@/types'
import { cn } from '@/lib/utils'

const SENTIMENT_COLORS = {
  positive: 'text-green-600 bg-green-50',
  neutral: 'text-yellow-600 bg-yellow-50',
  negative: 'text-red-600 bg-red-50',
}

const SENTIMENT_LABELS = {
  positive: '😊 Positive',
  neutral: '😐 Neutral',
  negative: '😠 Negative',
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(DEMO_COMMENTS)
  const [search, setSearch] = useState('')
  const [sentimentFilter, setSentimentFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedAccount, setSelectedAccount] = useState<string>('all')
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const filtered = comments.filter((c) => {
    const matchesSearch = c.author.toLowerCase().includes(search.toLowerCase()) ||
      c.text.toLowerCase().includes(search.toLowerCase())
    const matchesSentiment = sentimentFilter === 'all' || c.sentiment === sentimentFilter
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    const matchesAccount = selectedAccount === 'all' || c.accountId === selectedAccount
    return matchesSearch && matchesSentiment && matchesStatus && matchesAccount
  })

  const handleReply = async () => {
    if (!selectedComment || !replyText.trim()) return
    setIsReplying(true)
    try {
      const updated = await commentsService.replyToComment(selectedComment.id, replyText)
      setComments((prev) => prev.map((c) => c.id === updated.id ? updated : c))
      setSelectedComment(updated)
      setReplyText('')
      toast({ title: 'Reply sent! ✅' })
    } catch {
      toast({ title: 'Failed to send reply', variant: 'destructive' })
    } finally {
      setIsReplying(false)
    }
  }

  const handleAiReply = async () => {
    if (!selectedComment) return
    setIsGenerating(true)
    try {
      const reply = await aiContentService.generateReply(selectedComment.text)
      setReplyText(reply)
    } catch {
      toast({ title: 'Failed to generate reply', variant: 'destructive' })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleArchive = async (id: string) => {
    await commentsService.archiveComment(id)
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, status: 'archived' } : c))
    if (selectedComment?.id === id) setSelectedComment(null)
  }

  const newCount = comments.filter((c) => c.status === 'new').length
  const negativeCount = comments.filter((c) => c.sentiment === 'negative').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comments Manager</h1>
          <p className="text-muted-foreground">
            <span className="text-primary font-medium">{newCount} new</span> • {negativeCount} negative
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder="Search comments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-3"
          />
        </div>
        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Accounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {DEMO_ACCOUNTS.map((a) => (
              <SelectItem key={a.id} value={a.id}>@{a.username}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiment</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Comment list */}
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
          <p className="text-xs text-muted-foreground">{filtered.length} comments</p>
          {filtered.map((comment) => (
            <Card
              key={comment.id}
              className={cn(
                'cursor-pointer transition-all hover:ring-1 hover:ring-primary',
                selectedComment?.id === comment.id && 'ring-1 ring-primary',
                comment.isHighPriority && 'border-red-200 bg-red-50/30',
              )}
              onClick={() => setSelectedComment(comment)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.authorAvatar} />
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">@{comment.author}</span>
                      <Badge
                        variant="outline"
                        className={cn('text-[10px] h-4 px-1', SENTIMENT_COLORS[comment.sentiment])}
                      >
                        {SENTIMENT_LABELS[comment.sentiment]}
                      </Badge>
                      {comment.status === 'new' && (
                        <Badge className="text-[10px] h-4 px-1">new</Badge>
                      )}
                      {comment.isHighPriority && (
                        <Badge variant="destructive" className="text-[10px] h-4 px-1">⚠ Priority</Badge>
                      )}
                    </div>
                    <p className="text-sm mt-1 line-clamp-2">{comment.text}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <Heart className="h-3 w-3" />{comment.likes}
                      </span>
                      {(comment.replies?.length ?? 0) > 0 && (
                        <span className="text-xs text-primary">{comment.replies!.length} repl{comment.replies!.length > 1 ? 'ies' : 'y'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No comments found</p>
            </div>
          )}
        </div>

        {/* Comment detail / reply panel */}
        <div>
          {selectedComment ? (
            <Card className="sticky top-6">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedComment.authorAvatar} />
                    <AvatarFallback>{selectedComment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">@{selectedComment.author}</span>
                      <Badge
                        variant="outline"
                        className={cn('text-xs', SENTIMENT_COLORS[selectedComment.sentiment])}
                      >
                        {SENTIMENT_LABELS[selectedComment.sentiment]}
                      </Badge>
                    </div>
                    <p className="text-sm mt-1">{selectedComment.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(selectedComment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Existing replies */}
                {(selectedComment.replies?.length ?? 0) > 0 && (
                  <div className="ml-12 space-y-2">
                    {selectedComment.replies!.map((reply) => (
                      <div key={reply.id} className="bg-muted rounded-lg p-3 text-sm">
                        <p>{reply.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                          </span>
                          {reply.isAiGenerated && (
                            <Badge variant="secondary" className="text-[10px] h-4 px-1">
                              <Sparkles className="h-2.5 w-2.5 mr-1" />AI
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply area */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAiReply}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      {isGenerating ? 'Generating...' : 'AI Reply'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleReply}
                      disabled={isReplying || !replyText.trim()}
                      className="flex-1"
                    >
                      <Send className="h-3.5 w-3.5 mr-1" />
                      {isReplying ? 'Sending...' : 'Reply'}
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(selectedComment.id)}
                  >
                    <Archive className="h-3.5 w-3.5 mr-1" />
                    Archive
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Flag className="h-3.5 w-3.5 mr-1" />
                    Flag
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 border rounded-lg text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a comment to reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

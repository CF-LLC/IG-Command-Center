'use client'

import { useState } from 'react'
import { Sparkles, Image, Clock, Send, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { DEMO_ACCOUNTS } from '@/lib/demo-data'
import { aiContentService } from '@/services/aiContentService'
import { publishingService } from '@/services/publishingService'

export default function ComposerPage() {
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [selectedAccount, setSelectedAccount] = useState(DEMO_ACCOUNTS[0].id)
  const [postType, setPostType] = useState<'feed' | 'reel' | 'story' | 'carousel'>('feed')
  const [scheduledAt, setScheduledAt] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [mediaUrls] = useState([
    'https://picsum.photos/seed/composer1/800/800',
    'https://picsum.photos/seed/composer2/800/800',
  ])

  const handleGenerateCaption = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: 'Enter a prompt first', variant: 'destructive' })
      return
    }
    setIsGenerating(true)
    try {
      const result = await aiContentService.generateCaption({
        prompt: aiPrompt,
        accountId: selectedAccount,
        includeHashtags: true,
        includeEmojis: true,
      })
      setCaption(result.caption)
      setHashtags(result.hashtags.join(' '))
      toast({ title: 'Caption generated! ✨' })
    } catch {
      toast({ title: 'Failed to generate caption', variant: 'destructive' })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    try {
      await publishingService.createPost({
        accountId: selectedAccount,
        caption,
        hashtags: hashtags.split(' ').filter(Boolean),
        media: [{ id: 'tmp', url: mediaUrls[0], type: 'image', thumbnail: mediaUrls[0] }],
        postType,
        status: 'draft',
        aiGenerated: false,
      })
      toast({ title: 'Draft saved successfully!' })
    } catch {
      toast({ title: 'Failed to save draft', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSchedule = async () => {
    if (!scheduledAt) {
      toast({ title: 'Select a scheduled time', variant: 'destructive' })
      return
    }
    setIsSaving(true)
    try {
      await publishingService.createPost({
        accountId: selectedAccount,
        caption,
        hashtags: hashtags.split(' ').filter(Boolean),
        media: [{ id: 'tmp', url: mediaUrls[0], type: 'image', thumbnail: mediaUrls[0] }],
        postType,
        status: 'scheduled',
        scheduledAt: new Date(scheduledAt).toISOString(),
      })
      toast({ title: 'Post scheduled! 🗓️' })
    } catch {
      toast({ title: 'Failed to schedule post', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const characterCount = caption.length + hashtags.length
  const maxChars = 2200

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Post Composer</h1>
        <p className="text-muted-foreground">Create and schedule Instagram content</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main composer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Account & Type selector */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEMO_ACCOUNTS.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          @{acc.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Post Type</Label>
                  <Select value={postType} onValueChange={(v) => setPostType(v as typeof postType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feed">Feed Post</SelectItem>
                      <SelectItem value="reel">Reel</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Caption */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Caption</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Write your caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <Textarea
                placeholder="#hashtags #here #separated #by #spaces"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="min-h-[60px] resize-none text-primary"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {characterCount}/{maxChars} characters
                </p>
                {characterCount > maxChars && (
                  <Badge variant="destructive" className="text-xs">Too long</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Caption Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Describe what you want to post about... e.g., 'New summer collection launch with bright colors'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <Button
                onClick={handleGenerateCaption}
                disabled={isGenerating}
                className="w-full"
                variant="outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Caption with AI'}
              </Button>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Scheduled Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleSchedule} disabled={isSaving} className="flex-1">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="feed">
                <TabsList className="w-full">
                  <TabsTrigger value="feed" className="flex-1">Feed</TabsTrigger>
                  <TabsTrigger value="story" className="flex-1">Story</TabsTrigger>
                </TabsList>

                <TabsContent value="feed">
                  <div className="border rounded-lg overflow-hidden mt-3">
                    {/* Header */}
                    <div className="flex items-center gap-2 p-3 border-b">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        {DEMO_ACCOUNTS.find((a) => a.id === selectedAccount)?.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">
                          {DEMO_ACCOUNTS.find((a) => a.id === selectedAccount)?.username}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Just now</p>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="aspect-square bg-muted">
                      <img
                        src={mediaUrls[0]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Caption preview */}
                    <div className="p-3">
                      <p className="text-xs line-clamp-3">
                        <span className="font-semibold">
                          {DEMO_ACCOUNTS.find((a) => a.id === selectedAccount)?.username}
                        </span>{' '}
                        {caption || 'Your caption will appear here...'}
                      </p>
                      {hashtags && (
                        <p className="text-xs text-blue-500 mt-1 line-clamp-2">{hashtags}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="story">
                  <div className="border rounded-lg overflow-hidden mt-3 aspect-[9/16] relative">
                    <img
                      src={mediaUrls[0]}
                      alt="Story preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-0 right-0 px-4">
                      <p className="text-white text-xs text-center drop-shadow-lg">
                        {caption.substring(0, 100) || 'Story preview'}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

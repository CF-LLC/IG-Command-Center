'use client'

import { useState } from 'react'
import { Upload, Search, Grid, List, Filter, Image, Video, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEMO_ASSETS } from '@/lib/demo-data'
import type { LibraryAsset } from '@/types'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function LibraryPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])

  const filteredAssets = DEMO_ASSETS.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.tags.some((t) => t.includes(search.toLowerCase()))
    const matchesType = typeFilter === 'all' || asset.type === typeFilter
    return matchesSearch && matchesType
  })

  const toggleSelect = (id: string) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">{DEMO_ASSETS.length} assets total</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Assets
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border rounded-md overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            className="rounded-none"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            className="rounded-none"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {selectedAssets.length > 0 && (
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete ({selectedAssets.length})
          </Button>
        )}
      </div>

      {/* Asset stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Image className="h-4 w-4" />
          {DEMO_ASSETS.filter((a) => a.type === 'image').length} images
        </span>
        <span className="flex items-center gap-1">
          <Video className="h-4 w-4" />
          {DEMO_ASSETS.filter((a) => a.type === 'video').length} videos
        </span>
        <span>{filteredAssets.length} showing</span>
      </div>

      {/* Grid view */}
      {viewMode === 'grid' ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className={`relative rounded-lg overflow-hidden border cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                selectedAssets.includes(asset.id) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => toggleSelect(asset.id)}
            >
              <div className="aspect-square">
                <img
                  src={asset.thumbnail || asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {asset.type === 'video' && (
                <div className="absolute top-1 right-1">
                  <Badge variant="secondary" className="text-[10px] h-4 px-1">
                    <Video className="h-2.5 w-2.5" />
                  </Badge>
                </div>
              )}
              <div className="p-1.5">
                <p className="text-[10px] truncate font-medium">{asset.name}</p>
                <p className="text-[10px] text-muted-foreground">{formatBytes(asset.size)}</p>
              </div>
              {selectedAssets.includes(asset.id) && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-2">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              className={`cursor-pointer transition-all hover:ring-1 hover:ring-primary ${
                selectedAssets.includes(asset.id) ? 'ring-1 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => toggleSelect(asset.id)}
            >
              <CardContent className="flex items-center gap-4 p-3">
                <div className="h-14 w-14 rounded-md overflow-hidden shrink-0">
                  <img
                    src={asset.thumbnail || asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{asset.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs h-4 px-1 capitalize">{asset.type}</Badge>
                    <span className="text-xs text-muted-foreground">{formatBytes(asset.size)}</span>
                    {asset.width && <span className="text-xs text-muted-foreground">{asset.width}×{asset.height}</span>}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {asset.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground shrink-0">
                  <p>Used in {asset.usedInPosts} posts</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredAssets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No assets found matching your filters
        </div>
      )}
    </div>
  )
}

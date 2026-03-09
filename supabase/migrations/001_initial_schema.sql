-- IG Command Center - Initial Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Accounts ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  avatar TEXT,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  posts INTEGER DEFAULT 0,
  bio TEXT,
  category TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  access_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Team Members ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_accounts UUID[] DEFAULT '{}'
);

-- ─── Posts ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  media JSONB DEFAULT '[]',
  post_type TEXT NOT NULL DEFAULT 'feed' CHECK (post_type IN ('feed', 'reel', 'story', 'carousel')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed', 'pending_approval')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES team_members(id),
  approved_by UUID REFERENCES team_members(id),
  likes INTEGER,
  comments INTEGER,
  saves INTEGER,
  reach INTEGER,
  impressions INTEGER,
  ai_generated BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- ─── Comments ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_avatar TEXT,
  text TEXT NOT NULL,
  sentiment TEXT DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'archived', 'flagged')),
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  replies JSONB DEFAULT '[]',
  is_high_priority BOOLEAN DEFAULT FALSE
);

-- ─── Media Assets ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'carousel')),
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  tags TEXT[] DEFAULT '{}',
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES team_members(id),
  used_in_posts INTEGER DEFAULT 0
);

-- ─── Daily Metrics ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  followers INTEGER DEFAULT 0,
  followers_gain INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  website_clicks INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  UNIQUE (account_id, date)
);

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  related_id UUID,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE
);

-- ─── Approval Requests ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES team_members(id),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID REFERENCES team_members(id),
  reviewed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested')),
  notes TEXT
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_posts_account_id ON posts(account_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_account_id ON comments(account_id);
CREATE INDEX IF NOT EXISTS idx_comments_sentiment ON comments(sentiment);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_account_date ON daily_metrics(account_id, date);
CREATE INDEX IF NOT EXISTS idx_notifications_account_id ON notifications(account_id);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Basic policy: authenticated users can read everything in their workspace
-- (You would customize this with workspace isolation in production)
CREATE POLICY "Authenticated users can view accounts" ON accounts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view posts" ON posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage posts" ON posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view comments" ON comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage comments" ON comments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view media" ON media_assets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view metrics" ON daily_metrics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view notifications" ON notifications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view team" ON team_members FOR SELECT USING (auth.role() = 'authenticated');

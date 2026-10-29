-- Supabase Migration: 001_initial_schema.sql
-- SkillSwap Tables with Row Level Security (RLS) policies

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT NOT NULL,
  headline TEXT DEFAULT 'SkillSwap enthusiast',
  bio TEXT DEFAULT '',
  location TEXT DEFAULT 'Remote / Worldwide',
  credits INTEGER DEFAULT 100,
  rating TEXT DEFAULT '5.0',
  review_count INTEGER DEFAULT 0,
  instagram_handle TEXT DEFAULT '',
  github_handle TEXT DEFAULT '',
  twitter_handle TEXT DEFAULT '',
  is_online BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are readable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid()::text = id);

-- 2. USER SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.user_skills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'offering' | 'wanted'
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  description TEXT DEFAULT '',
  years_experience INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skills are readable by everyone" ON public.user_skills FOR SELECT USING (true);
CREATE POLICY "Users can insert their own skills" ON public.user_skills FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own skills" ON public.user_skills FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own skills" ON public.user_skills FOR DELETE USING (auth.uid()::text = user_id);

-- 3. SWAP PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS public.swap_proposals (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  offered_skill TEXT NOT NULL,
  wanted_skill TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  duration_minutes INTEGER DEFAULT 45,
  proposed_date TEXT NOT NULL,
  match_score INTEGER DEFAULT 85,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.swap_proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view proposals they are involved in" ON public.swap_proposals
  FOR SELECT USING (auth.uid()::text = sender_id OR auth.uid()::text = receiver_id);
CREATE POLICY "Users can create proposals" ON public.swap_proposals
  FOR INSERT WITH CHECK (auth.uid()::text = sender_id);
CREATE POLICY "Participants can update proposal status" ON public.swap_proposals
  FOR UPDATE USING (auth.uid()::text = sender_id OR auth.uid()::text = receiver_id);

-- 4. SWAP SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.swap_sessions (
  id TEXT PRIMARY KEY,
  proposal_id TEXT REFERENCES public.swap_proposals(id) ON DELETE SET NULL,
  host_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  participant_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  skill_taught_by_host TEXT NOT NULL,
  skill_taught_by_participant TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 45,
  status TEXT DEFAULT 'upcoming',
  meeting_link TEXT DEFAULT 'https://meet.jit.si/skillswap-room',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.swap_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view sessions they are involved in" ON public.swap_sessions
  FOR SELECT USING (auth.uid()::text = host_id OR auth.uid()::text = participant_id);
CREATE POLICY "Users can manage sessions they are involved in" ON public.swap_sessions
  FOR UPDATE USING (auth.uid()::text = host_id OR auth.uid()::text = participant_id);

-- 5. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid()::text = sender_id OR auth.uid()::text = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid()::text = sender_id);

-- 6. FOLLOWS TABLE (Instagram Style)
CREATE TABLE IF NOT EXISTS public.follows (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(follower_id, following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can see follow relationships" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.follows FOR INSERT WITH CHECK (auth.uid()::text = follower_id);
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE USING (auth.uid()::text = follower_id);

-- 7. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid()::text = author_id);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  actor_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only read their notifications" ON public.notifications
  FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (auth.uid()::text = user_id);

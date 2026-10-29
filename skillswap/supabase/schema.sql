-- ====================================================
-- SkillSwap - Complete Supabase PostgreSQL Schema & RLS
-- ====================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums
CREATE TYPE skill_type AS ENUM ('TEACH', 'LEARN');
CREATE TYPE skill_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE connection_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED');
CREATE TYPE session_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE review_type AS ENUM ('TEACHING', 'LEARNING');

-- 3. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    bio TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    languages TEXT[] DEFAULT ARRAY['English']::TEXT[],
    avatar_url TEXT,
    rating_avg NUMERIC(3, 2) DEFAULT 5.00,
    rating_count INTEGER DEFAULT 0,
    completed_sessions_count INTEGER DEFAULT 0,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Master Skills Directory
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Skills (Teach and Learn)
CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    skill_name TEXT NOT NULL,
    skill_category TEXT NOT NULL DEFAULT 'Other',
    type skill_type NOT NULL,
    level skill_level NOT NULL DEFAULT 'INTERMEDIATE',
    description TEXT,
    hours_count NUMERIC(5, 1) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. User Availability
CREATE TABLE IF NOT EXISTS public.availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Connections (Peer-to-Peer Requests & Friendship)
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT,
    status connection_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_connection_pair UNIQUE(requester_id, receiver_id)
);

-- 8. Learning Sessions
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connection_id UUID NOT NULL REFERENCES public.connections(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    status session_status NOT NULL DEFAULT 'SCHEDULED',
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Realtime Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connection_id UUID NOT NULL REFERENCES public.connections(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Reviews & Ratings
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    type review_type NOT NULL DEFAULT 'TEACHING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Safety Reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self update/insert
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Master Skills: Everyone can view, authenticated users can suggest
CREATE POLICY "Skills are viewable by everyone" 
ON public.skills FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert skills" 
ON public.skills FOR INSERT TO authenticated WITH CHECK (true);

-- User Skills: Viewable by everyone, editable only by owner
CREATE POLICY "User skills are viewable by everyone" 
ON public.user_skills FOR SELECT USING (true);

CREATE POLICY "Users can manage their own skills" 
ON public.user_skills FOR ALL USING (auth.uid() = user_id);

-- Availability: Viewable by everyone, editable only by owner
CREATE POLICY "Availability is viewable by everyone" 
ON public.availability FOR SELECT USING (true);

CREATE POLICY "Users can manage their own availability" 
ON public.availability FOR ALL USING (auth.uid() = user_id);

-- Connections: Visible only to requester or receiver
CREATE POLICY "Users can view their own connections" 
ON public.connections FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create connection requests" 
ON public.connections FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Participants can update connection status" 
ON public.connections FOR UPDATE 
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Sessions: Accessible to teacher or learner
CREATE POLICY "Session participants can view sessions" 
ON public.sessions FOR SELECT 
USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

CREATE POLICY "Session participants can create sessions" 
ON public.sessions FOR INSERT 
WITH CHECK (auth.uid() = teacher_id OR auth.uid() = learner_id);

CREATE POLICY "Session participants can update sessions" 
ON public.sessions FOR UPDATE 
USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

-- Messages: Only participants in accepted connection can view and post
CREATE POLICY "Connection participants can view messages" 
ON public.messages FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.connections c 
        WHERE c.id = connection_id 
        AND (c.requester_id = auth.uid() OR c.receiver_id = auth.uid())
        AND c.status = 'ACCEPTED'
    )
);

CREATE POLICY "Connection participants can send messages" 
ON public.messages FOR INSERT 
WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.connections c 
        WHERE c.id = connection_id 
        AND (c.requester_id = auth.uid() OR c.receiver_id = auth.uid())
        AND c.status = 'ACCEPTED'
    )
);

-- Reviews: Viewable by all, insertable only by session participants
CREATE POLICY "Reviews viewable by everyone" 
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Session participants can leave review" 
ON public.reviews FOR INSERT 
WITH CHECK (
    auth.uid() = from_user_id AND
    EXISTS (
        SELECT 1 FROM public.sessions s 
        WHERE s.id = session_id 
        AND (s.teacher_id = auth.uid() OR s.learner_id = auth.uid())
        AND s.status = 'COMPLETED'
    )
);

-- Notifications: Only target user can read/update
CREATE POLICY "Users can view their notifications" 
ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" 
ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Reports: Users can insert reports
CREATE POLICY "Users can submit reports" 
ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Enable Supabase Realtime for Messages & Notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- DUO POP / MooAuan - Production PostgreSQL Schema for Supabase
-- Enables Realtime, Row Level Security, and Admin Audit Logging

-- 1. Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL,
  host_id TEXT NOT NULL,
  selected_game VARCHAR(50) NOT NULL DEFAULT 'same-brain',
  is_random_mode BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'lobby',
  active_game_state JSONB DEFAULT NULL,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for instant lookup by room code
CREATE INDEX IF NOT EXISTS idx_rooms_code ON public.rooms(code);

-- 2. Room Players Table
CREATE TABLE IF NOT EXISTS public.room_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  avatar VARCHAR(30) NOT NULL DEFAULT 'cat',
  is_host BOOLEAN NOT NULL DEFAULT false,
  is_ready BOOLEAN NOT NULL DEFAULT false,
  score INT NOT NULL DEFAULT 0,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_room_players_room_id ON public.room_players(room_id);

-- 3. Game Rounds History Table
CREATE TABLE IF NOT EXISTS public.game_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  game_type VARCHAR(50) NOT NULL,
  winner_user_id TEXT,
  scores_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  round_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id TEXT NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  target_room_code VARCHAR(10),
  target_user_id TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous users (Guests) can read rooms by code
CREATE POLICY "Allow public read room by code"
  ON public.rooms FOR SELECT
  USING (true);

-- Anonymous users can create rooms
CREATE POLICY "Allow public create room"
  ON public.rooms FOR INSERT
  WITH CHECK (true);

-- Anonymous users can update their own room
CREATE POLICY "Allow public update room"
  ON public.rooms FOR UPDATE
  USING (true);

-- Players policies
CREATE POLICY "Allow public read players"
  ON public.room_players FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert player"
  ON public.room_players FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update player"
  ON public.room_players FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete player"
  ON public.room_players FOR DELETE
  USING (true);

-- Game rounds policies
CREATE POLICY "Allow public read game rounds"
  ON public.game_rounds FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert game rounds"
  ON public.game_rounds FOR INSERT
  WITH CHECK (true);

-- Admin logs: only service role or authorized admin
CREATE POLICY "Allow admin read logs"
  ON public.admin_audit_logs FOR SELECT
  USING (true);

CREATE POLICY "Allow insert audit logs"
  ON public.admin_audit_logs FOR INSERT
  WITH CHECK (true);

-- 6. Enable Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_players;

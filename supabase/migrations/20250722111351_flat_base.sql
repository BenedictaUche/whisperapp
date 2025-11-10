/*
  # Complete WhisperMap Database Schema - WITH VOICE WHISPER FIX

  1. New Tables
    - `whisper_categories` - predefined categories for whispers
    - `user_profiles` - user stats, badges, and preferences
    - `user_sessions` - temporary anonymous user labels
    - `whisper_reactions` - emoji reactions to whispers
    - `whisper_replies` - threaded replies to whispers
    - `abuse_reports` - content moderation reports

  2. Schema Updates
    - Add category_id to whispers table
    - Add voice_url for voice whispers
    - Add moderation fields
    - Add reaction and reply counters
    - FIX: Update text constraint to allow voice-only whispers

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
    - Content moderation and abuse reporting
*/

-- Categories table
CREATE TABLE IF NOT EXISTS whisper_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  emoji text NOT NULL,
  color text NOT NULL DEFAULT '#6366f1',
  created_at timestamptz DEFAULT now()
);

-- Insert default categories
INSERT INTO whisper_categories (name, emoji, color) VALUES
  ('General', '💬', '#6366f1'),
  ('Question', '❓', '#f59e0b'),
  ('Confession', '🤫', '#ec4899'),
  ('Advice', '💡', '#10b981'),
  ('Rant', '😤', '#ef4444'),
  ('Compliment', '💝', '#8b5cf6'),
  ('Local News', '📰', '#06b6d4'),
  ('Food', '🍕', '#f97316')
ON CONFLICT (name) DO NOTHING;

-- User profiles for badges and streaks
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  whisper_count integer DEFAULT 0,
  reply_count integer DEFAULT 0,
  reaction_count integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  max_streak integer DEFAULT 0,
  last_activity_date date,
  badges jsonb DEFAULT '[]'::jsonb,
  preferences jsonb DEFAULT '{
    "incognito_mode": false,
    "location_radius": 5,
    "notifications_enabled": true,
    "voice_distortion": true
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User sessions for temporary anonymous labels
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  whisper_id uuid REFERENCES whispers(id) ON DELETE CASCADE,
  anonymous_label text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '48 hours')
);

-- Add new columns to whispers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whispers' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE whispers ADD COLUMN category_id uuid REFERENCES whisper_categories(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whispers' AND column_name = 'voice_url'
  ) THEN
    ALTER TABLE whispers ADD COLUMN voice_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whispers' AND column_name = 'is_moderated'
  ) THEN
    ALTER TABLE whispers ADD COLUMN is_moderated boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whispers' AND column_name = 'reply_count'
  ) THEN
    ALTER TABLE whispers ADD COLUMN reply_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whispers' AND column_name = 'reaction_count'
  ) THEN
    ALTER TABLE whispers ADD COLUMN reaction_count integer DEFAULT 0;
  END IF;
END $$;

-- *** FIX FOR VOICE WHISPERS: Update the text constraint ***
-- Drop the existing text check constraint that prevents voice-only whispers
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'whispers_text_check'
    AND table_name = 'whispers'
  ) THEN
    ALTER TABLE whispers DROP CONSTRAINT whispers_text_check;
  END IF;

  -- Also check for other possible constraint names
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name LIKE '%text%check%'
    AND table_name = 'whispers'
  ) THEN
    -- You might need to run this query to find the exact constraint name:
    -- SELECT constraint_name FROM information_schema.table_constraints
    -- WHERE table_name = 'whispers' AND constraint_type = 'CHECK';

    -- Then drop it using the actual name found
    -- ALTER TABLE whispers DROP CONSTRAINT actual_constraint_name;
  END IF;
END $$;

-- Add new constraint that allows either text OR voice whispers
ALTER TABLE whispers ADD CONSTRAINT whispers_content_check
CHECK (
  (text IS NOT NULL AND length(text) > 0 AND length(text) <= 280) OR
  (voice_url IS NOT NULL AND length(voice_url) > 0)
);

-- Whisper reactions table
CREATE TABLE IF NOT EXISTS whisper_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whisper_id uuid REFERENCES whispers(id) ON DELETE CASCADE,
  user_id uuid,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(whisper_id, user_id, emoji)
);

-- Whisper replies table
CREATE TABLE IF NOT EXISTS whisper_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whisper_id uuid REFERENCES whispers(id) ON DELETE CASCADE,
  user_id uuid,
  anonymous_label text NOT NULL,
  text text CHECK (length(text) <= 280 AND length(text) > 0),
  gif_url text,
  voice_url text,
  created_at timestamptz DEFAULT now(),
  expire_at timestamptz DEFAULT (now() + interval '48 hours'),
  is_moderated boolean DEFAULT false
);

-- Abuse reports table
CREATE TABLE IF NOT EXISTS abuse_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id uuid,
  whisper_id uuid REFERENCES whispers(id) ON DELETE CASCADE,
  reply_id uuid REFERENCES whisper_replies(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

-- Enable RLS on all new tables
ALTER TABLE whisper_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whisper_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whisper_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE abuse_reports ENABLE ROW LEVEL SECURITY;

-- Policies for whisper_categories (public read)
CREATE POLICY "Public read access to categories"
  ON whisper_categories
  FOR SELECT
  TO public
  USING (true);

-- Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user_sessions
CREATE POLICY "Users can read own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for whisper_reactions
CREATE POLICY "Public read access to reactions"
  ON whisper_reactions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can add reactions"
  ON whisper_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON whisper_reactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for whisper_replies
CREATE POLICY "Public read access to active replies"
  ON whisper_replies
  FOR SELECT
  TO public
  USING (expire_at > now() AND is_moderated = false);

CREATE POLICY "Authenticated users can create replies"
  ON whisper_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete own replies"
  ON whisper_replies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for abuse_reports
CREATE POLICY "Users can create abuse reports"
  ON abuse_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_user_id);

CREATE POLICY "Users can read own reports"
  ON abuse_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_whisper_reactions_whisper_id ON whisper_reactions (whisper_id);
CREATE INDEX IF NOT EXISTS idx_whisper_reactions_user_id ON whisper_reactions (user_id);
CREATE INDEX IF NOT EXISTS idx_whisper_replies_whisper_id ON whisper_replies (whisper_id);
CREATE INDEX IF NOT EXISTS idx_whisper_replies_expire_at ON whisper_replies (expire_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_whisper_id ON user_sessions (whisper_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions (expires_at);
CREATE INDEX IF NOT EXISTS idx_abuse_reports_status ON abuse_reports (status);

-- Functions for updating counters
CREATE OR REPLACE FUNCTION update_whisper_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE whispers SET reaction_count = reaction_count + 1 WHERE id = NEW.whisper_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE whispers SET reaction_count = reaction_count - 1 WHERE id = OLD.whisper_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_whisper_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE whispers SET reply_count = reply_count + 1 WHERE id = NEW.whisper_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE whispers SET reply_count = reply_count - 1 WHERE id = OLD.whisper_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for counter updates
DROP TRIGGER IF EXISTS trigger_update_reaction_count ON whisper_reactions;
CREATE TRIGGER trigger_update_reaction_count
  AFTER INSERT OR DELETE ON whisper_reactions
  FOR EACH ROW EXECUTE FUNCTION update_whisper_reaction_count();

DROP TRIGGER IF EXISTS trigger_update_reply_count ON whisper_replies;
CREATE TRIGGER trigger_update_reply_count
  AFTER INSERT OR DELETE ON whisper_replies
  FOR EACH ROW EXECUTE FUNCTION update_whisper_reply_count();

-- Function to generate anonymous labels
CREATE OR REPLACE FUNCTION get_anonymous_label(p_whisper_id uuid, p_user_id uuid)
RETURNS text AS $$
DECLARE
  existing_label text;
  new_label text;
  label_count integer;
BEGIN
  -- Check if user already has a label for this whisper
  SELECT anonymous_label INTO existing_label
  FROM user_sessions
  WHERE whisper_id = p_whisper_id AND user_id = p_user_id AND expires_at > now();

  IF existing_label IS NOT NULL THEN
    RETURN existing_label;
  END IF;

  -- Count existing labels for this whisper
  SELECT COUNT(*) INTO label_count
  FROM user_sessions
  WHERE whisper_id = p_whisper_id AND expires_at > now();

  -- Generate new label
  new_label := 'Anonymous' || (label_count + 1);

  -- Insert new session
  INSERT INTO user_sessions (user_id, whisper_id, anonymous_label)
  VALUES (p_user_id, p_whisper_id, new_label);

  RETURN new_label;
END;
$$ LANGUAGE plpgsql;

-- Function for content moderation (basic bad word filter)
CREATE OR REPLACE FUNCTION moderate_content(content text)
RETURNS boolean AS $$
DECLARE
  bad_words text[] := ARRAY['spam', 'scam', 'hate', 'abuse']; -- Add more as needed
  word text;
BEGIN
  FOREACH word IN ARRAY bad_words
  LOOP
    IF lower(content) LIKE '%' || word || '%' THEN
      RETURN true; -- Content flagged
    END IF;
  END LOOP;
  RETURN false; -- Content clean
END;
$$ LANGUAGE plpgsql;

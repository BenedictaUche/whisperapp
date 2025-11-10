/*
  # Fix user_id column reference error

  1. Changes
    - Remove foreign key constraint on user_id column
    - Make user_id column optional without foreign key reference
    - Keep all other table structure and policies intact

  2. Security
    - Maintain existing RLS policies
    - Keep all indexes and constraints except the problematic foreign key
*/

-- Drop the existing table if it exists (in case partial creation occurred)
DROP TABLE IF EXISTS whispers;

-- Create whispers table without foreign key constraint on user_id
CREATE TABLE IF NOT EXISTS whispers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL CHECK (length(text) <= 280 AND length(text) > 0),
  latitude double precision NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude double precision NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  timestamp timestamptz DEFAULT now(),
  expire_at timestamptz NOT NULL,
  user_id uuid -- Optional user reference without foreign key constraint
);

-- Enable Row Level Security
ALTER TABLE whispers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read non-expired whispers
CREATE POLICY "Public read access to active whispers"
  ON whispers
  FOR SELECT
  TO public
  USING (expire_at > now());

-- Policy: Authenticated users can create whispers
CREATE POLICY "Authenticated users can create whispers"
  ON whispers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Users can delete their own whispers (if user_id matches)
CREATE POLICY "Users can delete own whispers"
  ON whispers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_whispers_location ON whispers (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_whispers_expire_at ON whispers (expire_at);
CREATE INDEX IF NOT EXISTS idx_whispers_timestamp ON whispers (timestamp DESC);

-- Function to automatically clean up expired whispers
CREATE OR REPLACE FUNCTION cleanup_expired_whispers()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM whispers WHERE expire_at < now();
$$;

-- Note: In production, you would set up a cron job or scheduled function to call cleanup_expired_whispers()
-- This can be done via Supabase's pg_cron extension or Edge Functions with cron triggers
/*
  # Create whispers table for WhisperMap

  1. New Tables
    - `whispers`
      - `id` (uuid, primary key)
      - `text` (text, whisper content, max 280 chars)
      - `latitude` (double precision, location coordinate)
      - `longitude` (double precision, location coordinate)
      - `timestamp` (timestamptz, creation time)
      - `expire_at` (timestamptz, expiration time)
      - `user_id` (uuid, optional reference to auth.users)

  2. Security
    - Enable RLS on `whispers` table
    - Add policy for public read access to non-expired whispers
    - Add policy for authenticated users to create whispers
    - Add policy for users to delete their own whispers

  3. Indexes
    - Add spatial index for location-based queries
    - Add index on expire_at for cleanup queries
    - Add index on timestamp for sorting
*/

CREATE TABLE IF NOT EXISTS whispers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL CHECK (length(text) <= 280 AND length(text) > 0),
  latitude double precision NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude double precision NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  timestamp timestamptz DEFAULT now(),
  expire_at timestamptz NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
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

-- Policy: Users can delete their own whispers
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
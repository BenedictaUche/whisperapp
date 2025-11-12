/*
  # Add avatar support to user profiles

  1. Schema Updates
    - Add avatar_url column to user_profiles table
    - Optional field for storing anonymous avatar image URLs

  2. Security
    - Maintain existing RLS policies
*/

-- Add avatar_url column to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN avatar_url text;
  END IF;
END $$;

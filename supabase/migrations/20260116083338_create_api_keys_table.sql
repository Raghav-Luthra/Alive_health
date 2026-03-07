/*
  # Create API Keys Table

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `key_name` (text) - identifier for the API key
      - `key_value` (text) - encrypted API key value
      - `provider` (text) - which service (e.g., 'gemini')
      - `is_active` (boolean) - whether key is in use
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `api_keys` table
    - Add policy to allow only service role to access (for Edge Functions)
*/

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name text NOT NULL,
  key_value text NOT NULL,
  provider text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can access all API keys"
  ON api_keys FOR SELECT
  TO service_role
  USING (true);

CREATE INDEX IF NOT EXISTS idx_api_keys_provider ON api_keys(provider);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

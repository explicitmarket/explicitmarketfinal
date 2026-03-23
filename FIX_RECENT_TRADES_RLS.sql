-- COMPLETE FIX: Drop and recreate recent_trades table with correct schema
-- Problem: Table was missing 'close_price' column and user_id was wrong type (UUID vs TEXT)
-- Solution: Drop old table and create with correct columns
-- user_id must be TEXT not UUID because app uses custom string user IDs, not Supabase auth UUIDs

-- DROP existing table and policies
DROP TABLE IF EXISTS public.recent_trades CASCADE;

-- CREATE the table with CORRECT columns matching code expectations
CREATE TABLE public.recent_trades (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('BUY', 'SELL')),
  volume DECIMAL(15, 2) NOT NULL DEFAULT 0,
  entry_price DECIMAL(20, 8) NOT NULL,
  close_price DECIMAL(20, 8) NOT NULL,
  profit DECIMAL(15, 2) NOT NULL,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'CLOSED' CHECK (status IN ('OPEN', 'CLOSED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_recent_trades_user_id ON public.recent_trades(user_id);
CREATE INDEX idx_recent_trades_closed_at ON public.recent_trades(closed_at DESC);
CREATE INDEX idx_recent_trades_status ON public.recent_trades(status);
CREATE INDEX idx_recent_trades_symbol ON public.recent_trades(symbol);

-- Enable RLS but with PERMISSIVE policies (not restrictive)
ALTER TABLE public.recent_trades ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies (allow inserts from authenticated users)
CREATE POLICY "Allow authenticated insert" ON public.recent_trades
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all reads" ON public.recent_trades
  FOR SELECT USING (true);

CREATE POLICY "Allow all updates" ON public.recent_trades
  FOR UPDATE USING (true);

-- Grant permissions to both authenticated and anon (for testing)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recent_trades TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recent_trades TO anon;

-- Add comment
COMMENT ON TABLE public.recent_trades IS 'Stores closed trading history for cross-device sync';

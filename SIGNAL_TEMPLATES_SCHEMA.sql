DROP TABLE IF EXISTS signal_templates CASCADE;

CREATE TABLE signal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  description TEXT NOT NULL,
  symbol TEXT NOT NULL,
  confidence DECIMAL(5, 2) NOT NULL,
  followers INTEGER NOT NULL DEFAULT 0,
  cost DECIMAL(10, 2) NOT NULL,
  win_rate DECIMAL(5, 2) NOT NULL,
  trades INTEGER NOT NULL DEFAULT 0,
  avg_return DECIMAL(5, 2) NOT NULL,
  created_by TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE signal_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active signal templates"
  ON signal_templates FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage signal templates"
  ON signal_templates FOR ALL
  USING (
    auth.uid()::text = 'admin-1' OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE INDEX idx_signal_templates_active ON signal_templates(is_active);
CREATE INDEX idx_signal_templates_symbol ON signal_templates(symbol);
CREATE INDEX idx_signal_templates_confidence ON signal_templates(confidence);

-- Mido PDF Tools Database Schema
-- Run this script to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile with subscription info
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'weekly', 'monthly', 'yearly')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'pending')),
  subscription_start TIMESTAMPTZ,
  subscription_end TIMESTAMPTZ,
  daily_usage_count INT DEFAULT 0,
  last_usage_date DATE,
  is_admin BOOLEAN DEFAULT false,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount_cents INT NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'binance', 'vodafone_cash')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_reference TEXT,
  subscription_plan TEXT CHECK (subscription_plan IN ('weekly', 'monthly', 'yearly')),
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File processing history
CREATE TABLE IF NOT EXISTS file_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  operation_type TEXT NOT NULL,
  file_name TEXT,
  file_size_mb DECIMAL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  admin_notes TEXT,
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin chat commands log
CREATE TABLE IF NOT EXISTS admin_chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id),
  command TEXT NOT NULL,
  response TEXT,
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API keys for developers
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  name TEXT,
  permissions TEXT[],
  rate_limit INT DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (admin-controlled)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update all payments" ON payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for file_operations
CREATE POLICY "Users can view own operations" ON file_operations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own operations" ON file_operations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all operations" ON file_operations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for support_tickets
CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON support_tickets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all tickets" ON support_tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update all tickets" ON support_tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for admin_chat_logs (admin only)
CREATE POLICY "Admins can view chat logs" ON admin_chat_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can insert chat logs" ON admin_chat_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for api_keys
CREATE POLICY "Users can view own api keys" ON api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own api keys" ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own api keys" ON api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own api keys" ON api_keys FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for site_settings (admin only)
CREATE POLICY "Anyone can view site settings" ON site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can update site settings" ON site_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can insert site settings" ON site_settings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_file_operations_user_id ON file_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_file_operations_created_at ON file_operations(created_at);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES 
  ('pricing', '{"weekly": 100, "monthly": 400, "yearly": 3000}'::jsonb),
  ('limits', '{"free_files_per_day": 2, "free_max_size_mb": 5, "weekly_max_size_mb": 50, "monthly_max_size_mb": 100, "yearly_max_size_mb": 200}'::jsonb),
  ('maintenance_mode', 'false'::jsonb),
  ('features', '{"ai_enabled": true, "api_enabled": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

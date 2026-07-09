-- Audit Logs — Append-Only Table
-- Run this in the Supabase SQL Editor AFTER schema.sql and trading-schema.sql
--
-- Purpose: Immutable audit trail for all data mutations.
-- The cyber team will demand this — every UPDATE/DELETE is logged.

-- 1. Audit Logs Table (append-only)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES auth.users,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Index for fast lookups by table and record
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record
    ON public.audit_logs (table_name, record_id);

-- Index for temporal queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at
    ON public.audit_logs (changed_at DESC);

-- 2. RLS — read-only for authenticated users, no public access
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read audit logs (but not modify)
CREATE POLICY "Authenticated users can read audit logs"
    ON public.audit_logs FOR SELECT
    USING (auth.role() = 'authenticated');

-- Only service role can insert (via API routes, not direct client)
-- This is enforced by NOT having an INSERT policy for 'authenticated' role

-- 3. Trigger function to auto-log changes to key tables
CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        table_name,
        record_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id::TEXT, OLD.id::TEXT, 'unknown'),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
        now()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Attach triggers to critical tables
CREATE TRIGGER audit_certificates
    AFTER INSERT OR UPDATE OR DELETE ON public.certificates
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_market_orders
    AFTER INSERT OR UPDATE OR DELETE ON public.market_orders
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_trades
    AFTER INSERT OR UPDATE OR DELETE ON public.trades
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_wallets
    AFTER INSERT OR UPDATE OR DELETE ON public.wallets
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_retirements
    AFTER INSERT OR UPDATE OR DELETE ON public.retirements
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_pilot_verification_jobs
    AFTER INSERT OR UPDATE OR DELETE ON public.pilot_verification_jobs
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_pilot_certificates
    AFTER INSERT OR UPDATE OR DELETE ON public.pilot_certificates
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

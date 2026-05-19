-- Trading & Market Schema for Carbon UPI
-- Run this in the Supabase SQL Editor

-- 1. Wallets (Fiat and Asset balances)
create table public.wallets (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references public.entities on delete cascade not null unique,
  fiat_balance numeric not null default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Wallets
alter table public.wallets enable row level security;
create policy "Users can view own wallets" on public.wallets for select using (
  exists (select 1 from public.entities where entities.id = wallets.entity_id and entities.user_id = auth.uid())
);

-- 2. Market Orders (Order Book for I-RECs and Carbon Credits)
create table public.market_orders (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references public.entities on delete cascade not null, -- The seller or buyer
  certificate_id uuid references public.certificates on delete cascade, -- Null if buying, specific ID if selling a specific certificate
  asset_type text not null, -- 'I_REC', 'CARBON_CREDIT'
  order_type text not null, -- 'BUY', 'SELL'
  quantity numeric not null,
  price_per_unit numeric not null,
  status text not null default 'OPEN', -- 'OPEN', 'FILLED', 'CANCELLED'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Market Orders
alter table public.market_orders enable row level security;
create policy "Anyone can view open market orders" on public.market_orders for select using (status = 'OPEN' or 
  exists (select 1 from public.entities where entities.id = market_orders.entity_id and entities.user_id = auth.uid())
);
create policy "Users can insert own market orders" on public.market_orders for insert with check (
  exists (select 1 from public.entities where entities.id = market_orders.entity_id and entities.user_id = auth.uid())
);
create policy "Users can update own market orders" on public.market_orders for update using (
  exists (select 1 from public.entities where entities.id = market_orders.entity_id and entities.user_id = auth.uid())
);

-- 3. Trades (Completed Transactions)
create table public.trades (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references public.entities on delete cascade not null,
  seller_id uuid references public.entities on delete cascade not null,
  order_id uuid references public.market_orders on delete set null,
  certificate_id uuid references public.certificates on delete set null,
  asset_type text not null,
  quantity numeric not null,
  price_per_unit numeric not null,
  total_amount numeric not null,
  trade_date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Trades
alter table public.trades enable row level security;
create policy "Users can view own trades" on public.trades for select using (
  exists (select 1 from public.entities where (entities.id = trades.buyer_id or entities.id = trades.seller_id) and entities.user_id = auth.uid())
);

-- 4. Retirements (Burned Credits)
create table public.retirements (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references public.entities on delete cascade not null,
  certificate_id uuid references public.certificates on delete set null,
  asset_type text not null,
  quantity numeric not null,
  retirement_reason text not null,
  retired_date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Retirements
alter table public.retirements enable row level security;
create policy "Users can view own retirements" on public.retirements for select using (
  exists (select 1 from public.entities where entities.id = retirements.entity_id and entities.user_id = auth.uid())
);
create policy "Users can insert own retirements" on public.retirements for insert with check (
  exists (select 1 from public.entities where entities.id = retirements.entity_id and entities.user_id = auth.uid())
);

-- Optional: Update Certificates table to support ownership transfer and Trading
-- Add owner_id to certificates to track current owner, originally same as entity_id (generator)
alter table public.certificates add column current_owner_id uuid references public.entities on delete cascade;
update public.certificates set current_owner_id = entity_id;

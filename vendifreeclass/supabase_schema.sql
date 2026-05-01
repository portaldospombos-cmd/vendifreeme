-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user',
  plan_type text default 'free',
  phone text,
  location text,
  bio text,
  last_login timestamptz default now(),
  status text default 'active',
  referral_code text unique,
  referred_by_id uuid references profiles(id),
  commission_balance decimal default 0,
  created_at timestamptz default now()
);

-- Listings table
create table listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  price decimal not null,
  category text,
  category_data jsonb,
  location text,
  images text[],
  status text default 'active',
  promotion_type text default 'normal', -- 'normal', 'top', 'urgent', 'premium'
  fair_price_status text, -- 'below', 'within', 'above'
  is_negotiable boolean default false,
  contact_phone text,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '30 days')
);

-- Messages table for internal chat
create table messages (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references listings(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  receiver_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Transactions table (for platform monetization)
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  listing_id uuid references listings(id),
  amount decimal not null,
  type text not null, -- 'ad_limit', 'promotion', 'plan'
  status text default 'pending',
  stripe_payment_intent_id text,
  created_at timestamptz default now()
);

-- Commissions table
create table commissions (
  id uuid default gen_random_uuid() primary key,
  transaction_id uuid references transactions(id) on delete cascade,
  ambassador_id uuid references profiles(id) on delete cascade,
  buyer_id uuid references profiles(id), -- Who made the purchase
  amount decimal not null,
  level integer not null, -- 1 or 2
  status text default 'pending', -- 'pending', 'validated', 'forfeited'
  available_at timestamptz default (now() + interval '7 days'), -- 7-day validation
  created_at timestamptz default now()
);

-- Withdrawal requests table
create table withdrawal_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  amount decimal not null,
  method text not null, -- 'paypal', 'bank'
  details text,
  status text default 'pending', -- 'pending', 'completed', 'rejected'
  created_at timestamptz default now()
);

-- Enable RLS
alter table withdrawal_requests enable row level security;

-- Policies
create policy "Users can manage own withdrawal requests" on withdrawal_requests for all using (auth.uid() = user_id);

-- Enable RLS
alter table profiles enable row level security;
alter table listings enable row level security;
alter table messages enable row level security;
alter table transactions enable row level security;
alter table commissions enable row level security;

-- RPC function to safely increment balance
create or replace function increment_commission_balance(row_id uuid, inc_amount decimal)
returns void as $$
begin
  update profiles
  set commission_balance = commission_balance + inc_amount
  where id = row_id;
end;
$$ language plpgsql security definer;

-- Function to validate pending commissions after 7 days
create or replace function validate_pending_commissions()
returns void as $$
declare
  r record;
begin
  for r in 
    select id, ambassador_id, amount 
    from commissions 
    where status = 'pending' 
    and available_at <= now()
  loop
    -- Update commission status
    update commissions set status = 'validated' where id = r.id;
    
    -- Increment user balance
    perform increment_commission_balance(r.ambassador_id, r.amount);
  end loop;
end;
$$ language plpgsql security definer;

-- Function to check and update inactivity
create or replace function update_inactive_users()
returns void as $$
begin
  update profiles
  set status = 'inactive'
  where last_login < (now() - interval '60 days')
  and status = 'active';
end;
$$ language plpgsql security definer;

-- RLS Policies
-- ... (rest of policies)

create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Listings: Everyone can read active, owners can manage
create policy "Active listings are viewable by everyone" on listings for select using (status = 'active');
create policy "Users can manage own listings" on listings for all using (auth.uid() = user_id);

-- Messages: Users can see messages they sent or received
create policy "Users can see own messages" on messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can send messages" on messages for insert with check (auth.uid() = sender_id);

-- Transactions & Commissions: Only owners or admins
create policy "Users can see own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can see own commissions" on commissions for select using (auth.uid() = ambassador_id);

-- Community Tables
create table community_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  content text not null,
  category text default 'general',
  likes_count integer default 0,
  created_at timestamptz default now()
);

create table community_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references community_posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table post_reports (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references community_posts(id) on delete cascade,
  reporter_id uuid references profiles(id) on delete cascade,
  reason text,
  created_at timestamptz default now()
);

-- Community RLS
alter table community_posts enable row level security;
alter table community_comments enable row level security;
alter table post_reports enable row level security;

create policy "Community posts are viewable by everyone" on community_posts for select using (true);
create policy "Users can create community posts" on community_posts for insert with check (auth.uid() = user_id);
create policy "Users can delete own community posts" on community_posts for delete using (auth.uid() = user_id);

create policy "Comments are viewable by everyone" on community_comments for select using (true);
create policy "Users can create comments" on community_comments for insert with check (auth.uid() = user_id);

create policy "Users can manage own reports" on post_reports for all using (auth.uid() = reporter_id);

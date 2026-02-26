-- ============================================
-- AIDLA APPLICATION DATABASE SETUP
-- ============================================

-- 1. CREATE SEQUENCE FOR TRANSACTION NUMBERS
create sequence IF not exists txn_seq start 1000 increment 1;

-- ============================================
-- 2. USERS_TRANSACTIONS TABLE
-- ============================================
create table IF not exists public.users_transactions (
  id bigint not null default nextval('txn_seq'::regclass),
  txn_no text not null,
  user_id uuid not null,
  user_email text not null,
  txn_type text not null,
  direction text not null,
  amount numeric(18, 5) not null,
  balance_before numeric(18, 5) not null,
  balance_after numeric(18, 5) not null,
  note text null,
  created_at timestamp with time zone not null default now(),
  constraint users_transactions_pkey primary key (id),
  constraint users_transactions_txn_no_key unique (txn_no),
  constraint users_transactions_user_id_fkey foreign key (user_id) references auth.users (id) on delete CASCADE,
  constraint users_transactions_amount_check check ((amount > (0)::numeric))
) TABLESPACE pg_default;

create index IF not exists users_transactions_user_id_idx on public.users_transactions using btree (user_id) TABLESPACE pg_default;
create index IF not exists users_transactions_created_at_idx on public.users_transactions using btree (created_at) TABLESPACE pg_default;

-- ============================================
-- 3. ADMIN_POOL TABLE
-- ============================================
create table IF not exists public.admin_pool (
  id integer not null default 1,
  total_aidla_coins numeric(18, 5) not null default 100000000.00000,
  updated_at timestamp with time zone not null default now(),
  constraint admin_pool_pkey primary key (id),
  constraint admin_pool_single_row check ((id = 1))
) TABLESPACE pg_default;

-- ============================================
-- 4. ADMIN_POOL_TRANSACTIONS TABLE
-- ============================================
create table IF not exists public.admin_pool_transactions (
  id bigint not null default nextval('txn_seq'::regclass),
  txn_no text not null,
  txn_type text not null,
  direction text not null,
  amount numeric(18, 5) not null,
  admin_email text not null,
  target_user_id uuid null,
  target_user_email text null,
  target_user_name text null,
  pool_balance_before numeric(18, 5) not null,
  pool_balance_after numeric(18, 5) not null,
  user_balance_before numeric(18, 5) null,
  user_balance_after numeric(18, 5) null,
  note text null,
  created_at timestamp with time zone not null default now(),
  constraint admin_pool_transactions_pkey primary key (id),
  constraint admin_pool_transactions_txn_no_key unique (txn_no),
  constraint admin_pool_transactions_amount_check check ((amount > (0)::numeric))
) TABLESPACE pg_default;

create index IF not exists admin_pool_transactions_created_at_idx on public.admin_pool_transactions using btree (created_at) TABLESPACE pg_default;

-- ============================================
-- 5. USERS_PROFILES TABLE (with additions)
-- ============================================
create table IF not exists public.users_profiles (
  user_id uuid not null,
  full_name text not null,
  email text not null,
  referral_code_used text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  avatar_url text null,
  date_of_birth date null,
  phone text null,
  city text null,
  country text null,
  educational_level text null,
  profession text null,
  institute_company text null,
  interests text[] null,
  bio text null,
  total_aidla_coins numeric(18, 5) not null default 0,
  coins_earned_from_LW numeric(18, 5) not null default 0,
  my_refer_code text null,
  my_referals integer null default 0,
  constraint users_profiles_pkey primary key (user_id),
  constraint users_profiles_email_key unique (email),
  constraint users_profiles_user_id_fkey foreign key (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists users_profiles_country_idx on public.users_profiles using btree (country) TABLESPACE pg_default;
create index IF not exists users_profiles_city_idx on public.users_profiles using btree (city) TABLESPACE pg_default;

-- ============================================
-- 6. LUCKY_WHEEL_CONFIG TABLE (Admin Configuration)
-- ============================================
create table IF not exists public.lucky_wheel_config (
  id integer not null default 1,
  max_spins_per_day integer not null default 1,
  entry_fee numeric(18, 5) not null default 0,
  is_entry_free boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint lucky_wheel_config_pkey primary key (id),
  constraint lucky_wheel_config_single_row check ((id = 1))
) TABLESPACE pg_default;

-- ============================================
-- 7. LUCKY_WHEEL_SLICES TABLE (Wheel Pieces/Slices)
-- ============================================
create table IF not exists public.lucky_wheel_slices (
  id bigint not null default nextval('txn_seq'::regclass),
  position integer not null,
  label text not null,
  reward_type text not null,
  reward_value text not null,
  probability numeric(5, 2) not null default 0,
  is_guaranteed boolean not null default false,
  created_at timestamp with time zone not null default now(),
  constraint lucky_wheel_slices_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists lucky_wheel_slices_guaranteed_idx on public.lucky_wheel_slices using btree (is_guaranteed) TABLESPACE pg_default;

-- ============================================
-- 8. LUCKY_WHEEL_SPINS TABLE (User Spin History)
-- ============================================
create table IF not exists public.lucky_wheel_spins (
  id bigint not null default nextval('txn_seq'::regclass),
  user_id uuid not null,
  slice_id bigint not null,
  result_message text not null,
  reward_type text not null,
  reward_value text not null,
  coins_won numeric(18, 5) null,
  is_claimed boolean not null default false,
  claimed_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  constraint lucky_wheel_spins_pkey primary key (id),
  constraint lucky_wheel_spins_user_id_fkey foreign key (user_id) references auth.users (id) on delete CASCADE,
  constraint lucky_wheel_spins_slice_id_fkey foreign key (slice_id) references public.lucky_wheel_slices (id) on delete SET null
) TABLESPACE pg_default;

create index IF not exists lucky_wheel_spins_user_id_idx on public.lucky_wheel_spins using btree (user_id) TABLESPACE pg_default;
create index IF not exists lucky_wheel_spins_created_at_idx on public.lucky_wheel_spins using btree (created_at) TABLESPACE pg_default;

-- ============================================
-- 9. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to block user coin edits
create or replace function block_user_coin_edits()
returns trigger as $$
begin
  if NEW.total_aidla_coins != OLD.total_aidla_coins then
    raise exception 'Users cannot edit their own coin balance directly. Use transactions.';
  end if;
  return NEW;
end;
$$ language plpgsql;

-- Function to set updated_at timestamp
create or replace function set_updated_at()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

-- Function to increment referral count
create or replace function fn_increment_referral_count()
returns trigger as $$
begin
  if NEW.referral_code_used != OLD.referral_code_used and NEW.referral_code_used is not null then
    update users_profiles
    set my_referals = my_referals + 1
    where my_refer_code = NEW.referral_code_used;
  end if;
  return NEW;
end;
$$ language plpgsql;

-- Function to generate unique referral code
create or replace function generate_unique_referral_code()
returns text as $$
declare
  new_code text;
  code_exists boolean;
begin
  loop
    new_code := 'AIDLA-' || upper(substring(md5(random()::text), 1, 6));
    select exists(select 1 from users_profiles where my_refer_code = new_code) into code_exists;
    exit when not code_exists;
  end loop;
  return new_code;
end;
$$ language plpgsql;

-- Function to spin lucky wheel
create or replace function spin_lucky_wheel(user_id_param uuid)
returns table(reward text, result_message text, reward_type text, reward_value text, spin_id bigint) as $$
declare
  v_slice record;
  v_random numeric;
  v_cumulative numeric := 0;
  v_spin_id bigint;
  v_coins_won numeric;
  v_user_balance numeric;
  v_pool_balance numeric;
  v_txn_no text;
  v_pool_txn_no text;
begin
  -- Check if user can spin (daily limit)
  if (select count(*) from lucky_wheel_spins where user_id = user_id_param and date(created_at) = current_date) >= 
     (select max_spins_per_day from lucky_wheel_config limit 1) then
    raise exception 'No spins left for today!';
  end if;

  -- Get random number for slice selection
  v_random := random();

  -- Select the winning slice
  select * into v_slice
  from lucky_wheel_slices
  where is_guaranteed = true
  limit 1;

  -- If no guaranteed slice, select based on probability
  if v_slice is null then
    for v_slice in
      select * from lucky_wheel_slices
      order by position
    loop
      v_cumulative := v_cumulative + (v_slice.probability / 100);
      if v_random <= v_cumulative then
        exit;
      end if;
    end loop;
  end if;

  -- Create spin record
  insert into lucky_wheel_spins (user_id, slice_id, result_message, reward_type, reward_value)
  values (user_id_param, v_slice.id, v_slice.label, v_slice.reward_type, v_slice.reward_value)
  returning id, lucky_wheel_spins.reward_value into v_spin_id, v_coins_won;

  -- If reward is coins, update user profile
  if v_slice.reward_type = 'coins' then
    v_coins_won := (v_slice.reward_value::numeric);
    
    update users_profiles
    set coins_earned_from_LW = coins_earned_from_LW + v_coins_won
    where user_id = user_id_param;

    -- Deduct from admin pool
    update admin_pool
    set total_aidla_coins = total_aidla_coins - v_coins_won
    where id = 1;
  end if;

  return query
  select 
    v_slice.label::text as reward,
    ('You won ' || v_slice.label)::text as result_message,
    v_slice.reward_type,
    v_slice.reward_value,
    v_spin_id;
end;
$$ language plpgsql;

-- Function to claim lucky wheel coins
create or replace function claim_lucky_wheel_coins(user_id_param uuid)
returns table(message text, coins_claimed numeric) as $$
declare
  v_coins_earned numeric;
  v_current_balance numeric;
  v_new_balance numeric;
  v_txn_no text;
begin
  -- Get user's earned coins
  select coins_earned_from_LW, total_aidla_coins
  into v_coins_earned, v_current_balance
  from users_profiles
  where user_id = user_id_param;

  if v_coins_earned <= 0 then
    raise exception 'No coins to claim!';
  end if;

  v_new_balance := v_current_balance + v_coins_earned;
  v_txn_no := 'TXN-' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || substring(gen_random_uuid()::text, 1, 8);

  -- Create transaction record
  insert into users_transactions (
    txn_no, user_id, user_email, txn_type, direction, amount,
    balance_before, balance_after, note
  )
  select
    v_txn_no, user_id, email, 'lucky_wheel', 'in', v_coins_earned,
    v_current_balance, v_new_balance, 'Claimed coins from Lucky Wheel'
  from users_profiles
  where user_id = user_id_param;

  -- Update user coins and reset earned coins
  update users_profiles
  set total_aidla_coins = v_new_balance, coins_earned_from_LW = 0
  where user_id = user_id_param;

  return query select
    ('Claimed ' || v_coins_earned::text || ' coins successfully!')::text as message,
    v_coins_earned;
end;
$$ language plpgsql;

-- ============================================
-- 10. TRIGGERS
-- ============================================

create trigger trg_block_user_coin_edits before update on users_profiles
for each row execute function block_user_coin_edits();

create trigger trg_users_profiles_updated_at before update on users_profiles
for each row execute function set_updated_at();

create trigger trg_increment_referral after update on users_profiles
for each row execute function fn_increment_referral_count();

-- ============================================
-- 11. INSERT DEFAULT DATA
-- ============================================

-- Insert admin pool if not exists
insert into admin_pool (id, total_aidla_coins) values (1, 100000000.00000)
on conflict (id) do nothing;

-- Insert lucky wheel config if not exists
insert into lucky_wheel_config (id, max_spins_per_day, is_entry_free) values (1, 1, true)
on conflict (id) do nothing;

-- Insert sample lucky wheel slices (8 pieces)
insert into lucky_wheel_slices (position, label, reward_type, reward_value, probability, is_guaranteed)
values
  (1, '🎉 500 Coins', 'coins', '500', 15, false),
  (2, '💎 1000 Coins', 'coins', '1000', 10, false),
  (3, '🎁 Gift Card', 'gift', 'gift_100', 8, false),
  (4, '⭐ Try Again!', 'try_again', 'try_again', 20, false),
  (5, '🚀 2000 Coins', 'coins', '2000', 5, false),
  (6, '🛍️ Shop Voucher', 'gift', 'voucher_50', 12, false),
  (7, '🔥 +1 Chance', 'extra_chance', 'extra_chance', 18, false),
  (8, '💰 100 Coins', 'coins', '100', 12, false)
on conflict do nothing;

-- ============================================
-- 12. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

alter table public.users_transactions enable row level security;
alter table public.lucky_wheel_spins enable row level security;

-- RLS Policy: Users can only see their own transactions
create policy "Users can view own transactions" on users_transactions
  for select using (auth.uid() = user_id);

-- RLS Policy: Users can only see their own spins
create policy "Users can view own spins" on lucky_wheel_spins
  for select using (auth.uid() = user_id);

-- RLS Policy: Admins can view all transactions
create policy "Admins can view all transactions" on users_transactions
  for select using (auth.jwt() ->> 'role' = 'authenticated');

-- ============================================
-- 13. GRANT PERMISSIONS
-- ============================================

grant usage on schema public to authenticated;
grant execute on all functions in schema public to authenticated;
grant select, insert on public.users_transactions to authenticated;
grant select, insert on public.lucky_wheel_spins to authenticated;
grant select on public.lucky_wheel_config to authenticated;
grant select on public.lucky_wheel_slices to authenticated;
grant select, update on public.users_profiles to authenticated;

-- ============================================
-- END OF SETUP
-- ============================================

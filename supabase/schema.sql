create table if not exists public.owner_data (
  owner_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.owner_data enable row level security;

revoke all on public.owner_data from anon;
grant select, insert, update on public.owner_data to authenticated;

drop policy if exists "Owner can read own data" on public.owner_data;
create policy "Owner can read own data"
  on public.owner_data for select
  to authenticated
  using (auth.uid() = owner_id and (auth.jwt() ->> 'email') = 'kost.pakgunawan@gmail.com');

drop policy if exists "Owner can insert own data" on public.owner_data;
create policy "Owner can insert own data"
  on public.owner_data for insert
  to authenticated
  with check (auth.uid() = owner_id and (auth.jwt() ->> 'email') = 'kost.pakgunawan@gmail.com');

drop policy if exists "Owner can update own data" on public.owner_data;
create policy "Owner can update own data"
  on public.owner_data for update
  to authenticated
  using (auth.uid() = owner_id and (auth.jwt() ->> 'email') = 'kost.pakgunawan@gmail.com')
  with check (auth.uid() = owner_id and (auth.jwt() ->> 'email') = 'kost.pakgunawan@gmail.com');

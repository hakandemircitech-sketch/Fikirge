-- ══════════════════════════════════════════════════════
-- Fikirge — Veritabanı Şeması
-- Supabase SQL Editor'da çalıştır
-- ══════════════════════════════════════════════════════

-- UUID extension
create extension if not exists "uuid-ossp";

-- ─── USERS ───────────────────────────────────────────
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  plan text not null default 'starter' check (plan in ('starter', 'builder', 'studio')),
  credits integer not null default 2,
  stripe_customer_id text unique,
  subscription_id text,
  subscription_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── PROJECTS ────────────────────────────────────────
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  idea text not null,
  status text not null default 'processing' check (status in ('processing', 'completed', 'draft')),
  output jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── CREDIT LOGS ─────────────────────────────────────
create table public.credit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  amount integer not null,
  type text not null check (type in ('generate', 'refund', 'bonus', 'purchase')),
  created_at timestamptz not null default now()
);

-- ─── EXPORTS ─────────────────────────────────────────
create table public.exports (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  format text not null check (format in ('pdf', 'notion', 'zip', 'link')),
  token text unique,
  url text,
  created_at timestamptz not null default now()
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.credit_logs enable row level security;
alter table public.exports enable row level security;

-- Users: sadece kendi profilini görebilir
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- Projects: sadece kendi projelerini görebilir ve yönetebilir
create policy "projects_select_own" on public.projects
  for select using (auth.uid() = user_id);

create policy "projects_insert_own" on public.projects
  for insert with check (auth.uid() = user_id);

create policy "projects_update_own" on public.projects
  for update using (auth.uid() = user_id);

create policy "projects_delete_own" on public.projects
  for delete using (auth.uid() = user_id);

-- Credit logs: sadece kendi loglarını görebilir
create policy "credit_logs_select_own" on public.credit_logs
  for select using (auth.uid() = user_id);

-- Exports: proje sahibi görebilir
create policy "exports_select_own" on public.exports
  for select using (
    exists (
      select 1 from public.projects
      where id = exports.project_id and user_id = auth.uid()
    )
  );

-- ─── TRIGGER: Yeni kullanıcı kayıt olduğunda users tablosuna ekle
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── TRIGGER: updated_at otomatik güncelle
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger projects_updated_at before update on public.projects
  for each row execute procedure public.handle_updated_at();

-- ─── INDEX'LER ───────────────────────────────────────
create index projects_user_id_idx on public.projects(user_id);
create index projects_created_at_idx on public.projects(created_at desc);
create index credit_logs_user_id_idx on public.credit_logs(user_id);

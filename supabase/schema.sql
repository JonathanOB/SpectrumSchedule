-- ============================================================
-- Spectrum Schedule — Supabase Schema
-- Run this in the Supabase SQL editor for your project.
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────────────────────
create table if not exists profiles (
  id            uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  display_name  text,
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- user_preferences
-- ─────────────────────────────────────────────────────────────
create table if not exists user_preferences (
  id                  uuid primary key default gen_random_uuid(),
  clerk_user_id       text not null unique references profiles(clerk_user_id) on delete cascade,
  color_theme         text not null default 'calm-blue',
  text_size           text not null default 'medium',
  font_family         text not null default 'inter',
  letter_spacing      text not null default 'normal',
  line_height         text not null default 'comfortable',
  border_radius       text not null default 'rounded',
  motion_preference   text not null default 'normal',
  updated_at          timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- schedules
-- ─────────────────────────────────────────────────────────────
create table if not exists schedules (
  id            uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references profiles(clerk_user_id) on delete cascade,
  title         text not null,
  description   text,
  color         text not null default 'blue',
  archived      boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists schedules_user_idx on schedules(clerk_user_id);

-- ─────────────────────────────────────────────────────────────
-- schedule_items
-- ─────────────────────────────────────────────────────────────
create table if not exists schedule_items (
  id            uuid primary key default gen_random_uuid(),
  schedule_id   uuid not null references schedules(id) on delete cascade,
  title         text not null,
  description   text,
  icon          text,
  start_time    text,
  end_time      text,
  completed     boolean not null default false,
  sort_order    integer not null default 0
);

create index if not exists schedule_items_schedule_idx on schedule_items(schedule_id);

-- ─────────────────────────────────────────────────────────────
-- routine_templates
-- ─────────────────────────────────────────────────────────────
create table if not exists routine_templates (
  id            uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references profiles(clerk_user_id) on delete cascade,
  title         text not null,
  description   text,
  created_at    timestamptz not null default now()
);

create index if not exists routines_user_idx on routine_templates(clerk_user_id);

-- ─────────────────────────────────────────────────────────────
-- routine_items
-- ─────────────────────────────────────────────────────────────
create table if not exists routine_items (
  id          uuid primary key default gen_random_uuid(),
  routine_id  uuid not null references routine_templates(id) on delete cascade,
  title       text not null,
  icon        text,
  sort_order  integer not null default 0
);

create index if not exists routine_items_routine_idx on routine_items(routine_id);

-- ─────────────────────────────────────────────────────────────
-- share_links  (caregiver read-only access)
-- ─────────────────────────────────────────────────────────────
create table if not exists share_links (
  id          uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references schedules(id) on delete cascade,
  token       text not null unique default encode(gen_random_bytes(16), 'hex'),
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists share_links_token_idx on share_links(token);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- (We use service role server-side, so RLS is a safety net for
--  any accidental direct anon/authenticated usage.)
-- ─────────────────────────────────────────────────────────────
alter table profiles          enable row level security;
alter table user_preferences  enable row level security;
alter table schedules         enable row level security;
alter table schedule_items    enable row level security;
alter table routine_templates enable row level security;
alter table routine_items     enable row level security;
alter table share_links       enable row level security;

-- share_links: public read via token (no auth required)
create policy "share_links_read" on share_links
  for select using (true);

-- Migration: Initial Schema Setup
-- Description: Creates the initial database schema for the Monity App
-- Tables: categories, expenses, reporting_periods
-- Functions: get_reporting_periods, format_period_date, get_period_boundaries
-- Security: RLS policies for all tables
-- Author: AI Assistant
-- Date: 2024-03-20

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create categories table
create table public.categories (
    id uuid primary key default uuid_generate_v4(),
    name varchar not null,
    description text,
    color varchar not null,
    is_default boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create expenses table
create table public.expenses (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    category_id uuid not null references public.categories(id) on delete restrict,
    amount decimal(10,2) not null check (amount > 0),
    description text,
    date date not null default current_date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create reporting_periods table
create table public.reporting_periods (
    id varchar primary key,
    name_pl varchar not null,
    name_en varchar not null,
    format_pl varchar not null,
    format_en varchar not null,
    interval_value interval not null,
    display_order integer not null
);

-- Create indexes for better query performance
create index idx_expenses_user_id on public.expenses(user_id);
create index idx_expenses_category_id on public.expenses(category_id);
create index idx_expenses_date on public.expenses(date);
create index idx_categories_is_default on public.categories(is_default);

-- Enable Row Level Security
alter table public.categories enable row level security;
alter table public.expenses enable row level security;
alter table public.reporting_periods enable row level security;

-- RLS Policies for categories
-- Categories are public for reading but only authenticated users can modify them
create policy "Categories are viewable by everyone"
    on public.categories for select
    to anon, authenticated
    using (true);

create policy "Categories can be created by authenticated users"
    on public.categories for insert
    to authenticated
    with check (true);

create policy "Categories can be updated by authenticated users"
    on public.categories for update
    to authenticated
    using (true);

create policy "Categories can be deleted by authenticated users"
    on public.categories for delete
    to authenticated
    using (true);

-- RLS Policies for expenses
-- Expenses are only accessible by their owners
create policy "Users can view their own expenses"
    on public.expenses for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can create their own expenses"
    on public.expenses for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
    on public.expenses for update
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can delete their own expenses"
    on public.expenses for delete
    to authenticated
    using (auth.uid() = user_id);

-- RLS Policies for reporting_periods
-- Reporting periods are public and read-only
create policy "Reporting periods are viewable by everyone"
    on public.reporting_periods for select
    to anon, authenticated
    using (true);

-- Insert default reporting periods
insert into public.reporting_periods (id, name_pl, name_en, format_pl, format_en, interval_value, display_order) values
    ('day', 'Dzień', 'Day', 'DD.MM.YYYY', 'YYYY-MM-DD', '1 day'::interval, 1),
    ('week', 'Tydzień', 'Week', 'WW.YYYY', 'YYYY-WW', '7 days'::interval, 2),
    ('month', 'Miesiąc', 'Month', 'MM.YYYY', 'YYYY-MM', '1 month'::interval, 3),
    ('year', 'Rok', 'Year', 'YYYY', 'YYYY', '1 year'::interval, 4);

-- Helper functions for reporting periods
create or replace function public.get_reporting_periods()
returns table (
    id varchar,
    name_pl varchar,
    name_en varchar,
    format_pl varchar,
    format_en varchar,
    interval_value interval,
    display_order integer
) language sql security definer as $$
    select * from public.reporting_periods order by display_order;
$$;

create or replace function public.format_period_date(
    p_date date,
    p_period_id varchar,
    p_locale varchar default 'pl'
)
returns varchar language plpgsql security definer as $$
declare
    v_format varchar;
begin
    select case p_locale
        when 'pl' then format_pl
        when 'en' then format_en
        else format_pl
    end into v_format
    from public.reporting_periods
    where id = p_period_id;

    return to_char(p_date, v_format);
end;
$$;

create or replace function public.get_period_boundaries(
    p_date date,
    p_period_id varchar
)
returns table (
    start_date date,
    end_date date
) language plpgsql security definer as $$
declare
    v_interval interval;
begin
    select interval_value into v_interval
    from public.reporting_periods
    where id = p_period_id;

    return query
    select
        case p_period_id
            when 'day' then p_date
            when 'week' then date_trunc('week', p_date)::date
            when 'month' then date_trunc('month', p_date)::date
            when 'year' then date_trunc('year', p_date)::date
        end as start_date,
        case p_period_id
            when 'day' then p_date
            when 'week' then (date_trunc('week', p_date) + interval '6 days')::date
            when 'month' then (date_trunc('month', p_date) + interval '1 month - 1 day')::date
            when 'year' then (date_trunc('year', p_date) + interval '1 year - 1 day')::date
        end as end_date;
end;
$$;

-- Create trigger for updating updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger set_updated_at
    before update on public.categories
    for each row
    execute function public.handle_updated_at();

create trigger set_updated_at
    before update on public.expenses
    for each row
    execute function public.handle_updated_at(); 
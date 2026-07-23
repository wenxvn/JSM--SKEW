create table public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  listing_url text not null unique,
  parser_config jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete restrict,
  url text not null unique,
  canonical_url text,
  title text not null,
  excerpt text,
  content text not null,
  author text,
  category text,
  image_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.article_analyses (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null unique references public.articles(id) on delete cascade,
  summary text not null,
  sentiment text not null check (sentiment in ('positive', 'neutral', 'negative', 'mixed')),
  framing jsonb not null default '{}'::jsonb,
  bias_left smallint not null check (bias_left between 0 and 100),
  bias_center smallint not null check (bias_center between 0 and 100),
  bias_right smallint not null check (bias_right between 0 and 100),
  analyzed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (bias_left + bias_center + bias_right = 100)
);

create table public.logs (
  id uuid primary key default gen_random_uuid(),
  level text not null check (level in ('debug', 'info', 'warn', 'error')),
  event text not null,
  message text not null,
  run_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.oxylabs_schedules (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  name text not null unique,
  schedule_expression text not null,
  oxylabs_schedule_id text unique,
  enabled boolean not null default true,
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.oxylabs_schedule_runs (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references public.oxylabs_schedules(id) on delete cascade,
  status text not null check (status in ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  oxylabs_run_id text unique,
  started_at timestamptz,
  finished_at timestamptz,
  output jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  check (finished_at is null or started_at is null or finished_at >= started_at)
);

create index articles_published_at_idx on public.articles (published_at desc nulls last);
create index articles_source_id_idx on public.articles (source_id);
create index article_analyses_article_id_idx on public.article_analyses (article_id);
create index logs_created_at_idx on public.logs (created_at desc);
create index logs_run_id_idx on public.logs (run_id);
create index oxylabs_schedules_source_id_idx on public.oxylabs_schedules (source_id);
create index oxylabs_schedule_runs_schedule_id_idx on public.oxylabs_schedule_runs (schedule_id);
create index oxylabs_schedule_runs_created_at_idx on public.oxylabs_schedule_runs (created_at desc);

alter table public.sources enable row level security;
alter table public.articles enable row level security;
alter table public.article_analyses enable row level security;
alter table public.logs enable row level security;
alter table public.oxylabs_schedules enable row level security;
alter table public.oxylabs_schedule_runs enable row level security;

comment on table public.sources is '配置的新闻来源。实际来源仅能经受控数据库配置写入。';
comment on table public.articles is '经过验证的文章详情，url 用于全局去重。';
comment on table public.article_analyses is '每篇文章的结构化分析结果。';
comment on table public.logs is '管道和应用运行日志。';

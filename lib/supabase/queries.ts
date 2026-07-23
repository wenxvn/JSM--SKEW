import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  mapArticleDetail,
  mapArticleListItem,
  type ArticleDetail,
  type ArticleListItem,
} from "@/lib/supabase/mappers";
import type { Json, LogLevel } from "@/lib/supabase/types";

const articleListSelect = `
  id,
  title,
  category,
  published_at,
  source:sources!inner(name),
  analysis:article_analyses!inner(summary, sentiment)
`;

const articleDetailSelect = `
  id,
  title,
  category,
  published_at,
  author,
  content,
  url,
  source:sources!inner(name, listing_url),
  analysis:article_analyses!inner(summary, sentiment, framing, bias_left, bias_center, bias_right)
`;

function ensureQuerySucceeded(error: { message: string } | null) {
  if (error) {
    throw new Error(`Supabase 查询失败：${error.message}`);
  }
}

export async function getAnalyzedArticles(): Promise<ArticleListItem[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select(articleListSelect)
    .order("published_at", { ascending: false, nullsFirst: false });

  ensureQuerySucceeded(error);
  return (data ?? [])
    .map((article) => mapArticleListItem(article))
    .filter((article): article is ArticleListItem => article !== null);
}

export async function getAnalyzedArticleById(
  id: string,
): Promise<ArticleDetail | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select(articleDetailSelect)
    .eq("id", id)
    .maybeSingle();

  ensureQuerySucceeded(error);
  return data ? mapArticleDetail(data) : null;
}

export async function getEnabledSources() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("sources")
    .select("id, name, enabled")
    .eq("enabled", true)
    .order("name");

  ensureQuerySucceeded(error);
  return data ?? [];
}

export async function writeLog(input: {
  event: string;
  level: LogLevel;
  message: string;
  metadata?: Json;
  runId?: string;
}) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("logs").insert({
    event: input.event,
    level: input.level,
    message: input.message,
    metadata: input.metadata ?? {},
    run_id: input.runId ?? null,
  });

  ensureQuerySucceeded(error);
}

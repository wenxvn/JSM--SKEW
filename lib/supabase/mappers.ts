import type { Sentiment } from "@/lib/supabase/types";

export type ArticleListItem = {
  category: string | null;
  id: string;
  publishedAt: string | null;
  sentiment: Sentiment;
  sourceName: string;
  summary: string;
  title: string;
};

export type ArticleDetail = ArticleListItem & {
  author: string | null;
  content: string;
  framing: Record<string, unknown>;
  sourceUrl: string;
  url: string;
  bias: {
    center: number;
    left: number;
    right: number;
  };
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSentiment(value: unknown): value is Sentiment {
  return (
    value === "positive" ||
    value === "neutral" ||
    value === "negative" ||
    value === "mixed"
  );
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function requiredString(record: UnknownRecord, field: string): string | null {
  const value = record[field];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function percentage(value: unknown): number | null {
  return typeof value === "number" && value >= 0 && value <= 100 ? value : null;
}

function firstRecord(value: unknown): UnknownRecord | null {
  if (isRecord(value)) {
    return value;
  }

  return Array.isArray(value) && isRecord(value[0]) ? value[0] : null;
}

function framing(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

export function mapArticleListItem(value: unknown): ArticleListItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const source = firstRecord(value.source);
  const analysis = firstRecord(value.analysis);
  const id = requiredString(value, "id");
  const title = requiredString(value, "title");
  const sourceName = source ? requiredString(source, "name") : null;
  const summary = analysis ? requiredString(analysis, "summary") : null;
  const sentiment = analysis?.sentiment;

  if (!id || !title || !sourceName || !summary || !isSentiment(sentiment)) {
    return null;
  }

  return {
    category: stringOrNull(value.category),
    id,
    publishedAt: stringOrNull(value.published_at),
    sentiment,
    sourceName,
    summary,
    title,
  };
}

export function mapArticleDetail(value: unknown): ArticleDetail | null {
  const listItem = mapArticleListItem(value);

  if (!listItem || !isRecord(value)) {
    return null;
  }

  const source = firstRecord(value.source);
  const analysis = firstRecord(value.analysis);
  const content = requiredString(value, "content");
  const url = requiredString(value, "url");
  const sourceUrl = source ? requiredString(source, "listing_url") : null;
  const left = analysis ? percentage(analysis.bias_left) : null;
  const center = analysis ? percentage(analysis.bias_center) : null;
  const right = analysis ? percentage(analysis.bias_right) : null;

  if (!content || !url || !sourceUrl || left === null || center === null || right === null) {
    return null;
  }

  return {
    ...listItem,
    author: stringOrNull(value.author),
    bias: { center, left, right },
    content,
    framing: framing(analysis?.framing),
    sourceUrl,
    url,
  };
}

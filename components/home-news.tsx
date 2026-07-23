"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { ArticleListItem } from "@/lib/supabase/mappers";
import HomeNewsPreview from "./home-news-preview";

type HomeNewsProps = {
  articles: ArticleListItem[];
};

const sentimentLabels = {
  mixed: "观点交错",
  negative: "情绪偏负面",
  neutral: "情绪中性",
  positive: "情绪偏正面",
} as const;

function formatPublishedAt(value: string | null) {
  if (!value) {
    return "发布时间待补充";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "发布时间待补充";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
  }).format(date);
}

export default function HomeNews({ articles }: HomeNewsProps) {
  const categories = useMemo(
    () => ["全部", ...new Set(articles.flatMap((article) => article.category ? [article.category] : []))],
    [articles],
  );
  const [activeCategory, setActiveCategory] = useState("全部");
  const visibleArticles = useMemo(
    () =>
      activeCategory === "全部"
        ? articles
        : articles.filter((article) => article.category === activeCategory),
    [activeCategory, articles],
  );

  if (articles.length === 0) {
    return <HomeNewsPreview />;
  }

  return (
    <div className="skew-page">
      <div className="skew-utility-bar">
        <div className="skew-container skew-utility-inner">
          <p>已保存新闻分析</p>
          <p>仅展示已入库内容</p>
        </div>
      </div>

      <header className="skew-header">
        <div className="skew-container skew-header-inner">
          <Link className="skew-brand" href="/" aria-label="SKEW 首页">
            SKEW
            <span className="skew-brand-subtitle">新闻视角</span>
          </Link>
          <p className="skew-header-context">中文新闻分析</p>
        </div>
      </header>

      {articles.length > 0 && (
        <div className="skew-category-bar">
          <div className="skew-container">
            <nav className="skew-category-scroll" aria-label="新闻分类筛选">
              {categories.map((category) => (
                <button
                  aria-pressed={activeCategory === category}
                  className={`skew-category-chip ${activeCategory === category ? "is-current" : ""}`}
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="skew-container skew-main" aria-labelledby="top-news-title">
        <section className="skew-results" aria-labelledby="top-news-title">
          <div className="skew-results-heading">
            <div>
              <p className="skew-kicker">已完成分析</p>
              <h1 id="top-news-title" className="skew-results-title">
                头条新闻
              </h1>
            </div>
            <p className="skew-results-meta" aria-live="polite">
              {visibleArticles.length} 篇已保存文章
            </p>
          </div>

          <div className="skew-news-grid" aria-live="polite">
            {visibleArticles.map((article) => (
              <article className="skew-article-card" key={article.id}>
                <div className="skew-article-meta">
                  <span>{article.sourceName}</span>
                  <span>{formatPublishedAt(article.publishedAt)}</span>
                </div>
                <h2 className="skew-article-title">
                  <Link className="skew-article-link" href={`/news/${article.id}`}>
                    {article.title}
                  </Link>
                </h2>
                <p className="skew-article-summary">{article.summary}</p>
                <p className="skew-article-frame">{sentimentLabels[article.sentiment]}</p>
              </article>
            ))}

            {visibleArticles.length === 0 && (
              <div className="skew-empty-state">
                <div>
                  <p className="skew-empty-label">暂无已保存文章</p>
                  <h2 className="skew-empty-title">分析结果将在入库后显示</h2>
                  <p className="skew-empty-copy">
                    当前没有可展示的已分析文章。新闻完成抓取、校验与分析并保存后，会出现在这里。
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="skew-footer">
        <div className="skew-container skew-footer-inner">
          <div>
            <p className="skew-footer-brand">SKEW</p>
            <p className="skew-footer-copy">以已保存的新闻分析帮助读者理解不同视角。</p>
          </div>
          <p className="skew-footer-copy">数据以入库状态为准</p>
        </div>
      </footer>
    </div>
  );
}

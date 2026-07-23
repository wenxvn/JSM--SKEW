"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  previewArticles,
  previewCategories,
  type PreviewArticle,
} from "@/lib/preview-articles";
import {
  previewNavigationItems,
  PreviewSiteFooter,
  PreviewSiteHeader,
} from "./preview-site-chrome";

type PreviewNavigationItem = (typeof previewNavigationItems)[number];
type PreviewCategory = (typeof previewCategories)[number];

const sectionDescriptions: Record<PreviewNavigationItem, string> = {
  首页: "首页界面预览",
  我的关注: "我的关注界面预览",
  本地: "本地新闻界面预览",
  盲点: "盲点分析界面预览",
};

function PreviewBiasBar({ article }: { article: PreviewArticle }) {
  return (
    <span
      aria-label={`预览偏左 ${article.bias.left}%，预览中立 ${article.bias.center}%，预览偏右 ${article.bias.right}%`}
      className="skew-preview-bias"
      style={{
        gridTemplateColumns: `${article.bias.left}fr ${article.bias.center}fr ${article.bias.right}fr`,
      }}
    >
      <span className="skew-preview-bias-left">偏左 {article.bias.left}%</span>
      <span className="skew-preview-bias-center">中立 {article.bias.center}%</span>
      <span className="skew-preview-bias-right">偏右 {article.bias.right}%</span>
    </span>
  );
}

export default function HomeNewsPreview() {
  const [activeNavigation, setActiveNavigation] =
    useState<PreviewNavigationItem>("首页");
  const [activeCategory, setActiveCategory] = useState<PreviewCategory>("全部");

  const visibleArticles = useMemo(
    () =>
      activeCategory === "全部"
        ? previewArticles
        : previewArticles.filter((article) => article.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="skew-page">
      <PreviewSiteHeader
        activeNavigation={activeNavigation}
        context="中文新闻分析"
        onNavigationChange={setActiveNavigation}
      />

      <div className="skew-category-bar">
        <div className="skew-container">
          <nav className="skew-category-scroll" aria-label="新闻分类筛选">
            {previewCategories.map((category) => (
              <button
                aria-pressed={activeCategory === category}
                className={`skew-category-chip ${
                  activeCategory === category ? "is-current" : ""
                }`}
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

      <main
        id="main-content"
        className="skew-container skew-main"
        aria-labelledby="top-news-title"
      >
        <section className="skew-results" aria-labelledby="top-news-title">
          <div className="skew-results-heading">
            <div>
              <p className="skew-kicker">{sectionDescriptions[activeNavigation]}</p>
              <h1 id="top-news-title" className="skew-results-title">
                头条新闻
              </h1>
            </div>
            <p className="skew-results-meta" aria-live="polite">
              界面预览，共 {visibleArticles.length} 篇
            </p>
          </div>

          <p className="skew-preview-notice">
            以下为本地界面预览。封面图和内容用于验证视觉与交互，不是已保存新闻或真实分析。
          </p>

          <div className="skew-news-grid" aria-live="polite">
            {visibleArticles.map((article, index) => (
              <article className="skew-preview-card" key={article.id}>
                <Link
                  aria-label={`打开界面预览：${article.title}`}
                  className="skew-preview-card-link"
                  href={`/news/${article.id}`}
                >
                  <span className="skew-preview-media">
                    <Image
                      alt={article.imageAlt}
                      className="skew-preview-image"
                      fill
                      priority={index < 3}
                      sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
                      src={article.imageSrc}
                    />
                    <span className="skew-preview-media-tag">界面预览</span>
                  </span>
                  <span className="skew-preview-card-content">
                    <span className="skew-preview-meta">
                      <span>
                        {article.category} · {article.region}
                      </span>
                      <span>{article.readTime}</span>
                    </span>
                    <span className="skew-preview-title">{article.title}</span>
                    <span className="skew-preview-summary">{article.summary}</span>
                    <PreviewBiasBar article={article} />
                    <span className="skew-preview-card-footer">
                      <span>{article.sourceCount} 个预览来源</span>
                      <span className="skew-preview-open">阅读预览</span>
                    </span>
                  </span>
                </Link>
              </article>
            ))}

            {visibleArticles.length === 0 && (
              <div className="skew-empty-state">
                <div>
                  <p className="skew-empty-label">没有匹配的界面预览</p>
                  <h2 className="skew-empty-title">尝试查看全部新闻</h2>
                  <p className="skew-empty-copy">
                    当前分类下没有预览卡片。你可以恢复完整列表继续查看布局效果。
                  </p>
                  <button
                    className="skew-reset-button"
                    onClick={() => setActiveCategory("全部")}
                    type="button"
                  >
                    显示全部预览
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <PreviewSiteFooter />
    </div>
  );
}

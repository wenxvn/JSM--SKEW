import Image from "next/image";
import Link from "next/link";
import type { PreviewArticle } from "@/lib/preview-articles";
import { PreviewSiteFooter, PreviewSiteHeader } from "./preview-site-chrome";

type NewsDetailPreviewProps = {
  article: PreviewArticle;
  relatedArticles: PreviewArticle[];
};

function BiasBar({ article }: { article: PreviewArticle }) {
  return (
    <div
      aria-label={`预览偏左 ${article.bias.left}%，预览中立 ${article.bias.center}%，预览偏右 ${article.bias.right}%`}
      className="skew-preview-bias skew-detail-bias"
      style={{
        gridTemplateColumns: `${article.bias.left}fr ${article.bias.center}fr ${article.bias.right}fr`,
      }}
    >
      <span className="skew-preview-bias-left">偏左 {article.bias.left}%</span>
      <span className="skew-preview-bias-center">中立 {article.bias.center}%</span>
      <span className="skew-preview-bias-right">偏右 {article.bias.right}%</span>
    </div>
  );
}

export default function NewsDetailPreview({
  article,
  relatedArticles,
}: NewsDetailPreviewProps) {
  return (
    <div className="skew-page">
      <PreviewSiteHeader context="新闻详情预览" />

      <main id="main-content" className="skew-container skew-news-detail-main">
        <Link className="skew-back-link" href="/">
          返回头条新闻
        </Link>
        <div className="skew-news-detail-layout">
          <article className="skew-news-article">
            <header className="skew-news-article-header">
              <div className="skew-preview-meta">
                <span className="skew-preview-tag">界面预览</span>
                <span>
                  {article.category} · {article.region}
                </span>
              </div>
              <h1>{article.title}</h1>
              <p className="skew-news-article-deck">{article.summary}</p>
              <p className="skew-news-article-meta">
                合成阅读样例 · {article.readTime} · {article.sourceCount} 个预览来源
              </p>
            </header>

            <figure className="skew-news-hero">
              <div className="skew-news-hero-image">
                <Image
                  alt={article.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 760px"
                  src={article.imageSrc}
                />
                <span className="skew-preview-media-tag">界面预览</span>
              </div>
              <figcaption>预览封面图，仅用于验证新闻阅读页面的视觉效果。</figcaption>
            </figure>

            <section className="skew-article-bias-section" aria-labelledby="bias-title">
              <div className="skew-section-heading-row">
                <div>
                  <p className="skew-section-eyebrow">分析预览</p>
                  <h2 id="bias-title">视角分布</h2>
                </div>
                <span>{article.sourceCount} 个预览来源</span>
              </div>
              <BiasBar article={article} />
            </section>

            <div className="skew-news-article-body">
              {article.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <section className="skew-related-stories" aria-labelledby="related-stories-title">
              <div className="skew-section-heading-row">
                <div>
                  <p className="skew-section-eyebrow">继续阅读</p>
                  <h2 id="related-stories-title">相关新闻预览</h2>
                </div>
                <span>本地样例</span>
              </div>
              <ul className="skew-related-stories-grid">
                {relatedArticles.map((relatedArticle) => (
                  <li key={relatedArticle.id}>
                    <Link
                      aria-label={`打开界面预览：${relatedArticle.title}`}
                      className="skew-related-story"
                      href={`/news/${relatedArticle.id}`}
                    >
                      <Image
                        alt=""
                        className="skew-related-story-image"
                        height={112}
                        sizes="112px"
                        src={relatedArticle.imageSrc}
                        width={112}
                      />
                      <span>
                        <span className="skew-related-story-meta">
                          {relatedArticle.category} · {relatedArticle.region}
                        </span>
                        <strong>{relatedArticle.title}</strong>
                        <span className="skew-related-story-time">
                          {relatedArticle.readTime}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="skew-news-analysis-sidebar" aria-label="文章分析预览">
            <section className="skew-analysis-panel" aria-labelledby="analysis-title">
              <p className="skew-section-eyebrow">界面预览</p>
              <h2 id="analysis-title">视角分析</h2>
              <p className="skew-analysis-lead">{article.framing}</p>
              <BiasBar article={article} />
              <p className="skew-analysis-copy">
                此模块用于展示已保存分析结果的结构。当前百分比为本地样例，不代表媒体或事实判断。
              </p>
            </section>

            <section className="skew-analysis-panel" aria-labelledby="summary-title">
              <p className="skew-section-eyebrow">界面预览</p>
              <h2 id="summary-title">摘要</h2>
              <ul className="skew-analysis-list">
                {article.summaryPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="skew-analysis-note">仅用于界面验证，不对应真实报道。</p>
            </section>

            <section className="skew-analysis-panel" aria-labelledby="sources-title">
              <p className="skew-section-eyebrow">界面预览</p>
              <h2 id="sources-title">来源构成</h2>
              <p className="skew-analysis-source-count">{article.sourceCount} 个预览来源</p>
              <ul className="skew-source-list">
                {article.sources.map((source) => (
                  <li key={source.name}>
                    <span>{source.name}</span>
                    <strong className={`is-${source.leaning}`}>{source.leaning}</strong>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        <section className="skew-newsletter-band" aria-labelledby="newsletter-title">
          <div>
            <p className="skew-section-eyebrow">SKEW 预览</p>
            <h2 id="newsletter-title">保持知情，保持平衡。</h2>
          </div>
          <p>订阅功能尚未接入。本区域仅用于验证详情页底部的内容节奏。</p>
        </section>
      </main>

      <PreviewSiteFooter />
    </div>
  );
}

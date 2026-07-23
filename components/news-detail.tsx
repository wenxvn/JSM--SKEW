import Link from "next/link";

import type { ArticleDetail } from "@/lib/supabase/mappers";

type NewsDetailProps = {
  article: ArticleDetail;
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
  return Number.isNaN(date.getTime())
    ? "发布时间待补充"
    : new Intl.DateTimeFormat("zh-CN", { dateStyle: "long" }).format(date);
}

export default function NewsDetail({ article }: NewsDetailProps) {
  return (
    <div className="skew-page">
      <div className="skew-utility-bar">
        <div className="skew-container skew-utility-inner">
          <p>已保存新闻分析</p>
          <Link href="/">返回新闻列表</Link>
        </div>
      </div>

      <main className="skew-container skew-main">
        <article className="skew-detail-layout">
          <header className="skew-detail-header">
            <p className="skew-kicker">{article.sourceName}</p>
            <h1 className="skew-title">{article.title}</h1>
            <p className="skew-lead">{article.summary}</p>
            <p className="skew-article-meta">
              <span>{formatPublishedAt(article.publishedAt)}</span>
              {article.author && <span>{article.author}</span>}
              {article.category && <span>{article.category}</span>}
            </p>
          </header>

          <div className="skew-detail-content">
            <div className="skew-detail-body">
              {article.content.split(/\n{2,}/).map((paragraph, index) => (
                <p key={`${article.id}-${index}`}>{paragraph}</p>
              ))}
            </div>

            <aside className="skew-detail-analysis" aria-label="文章分析">
              <section className="skew-panel">
                <h2 className="skew-panel-heading">情绪与视角</h2>
                <div className="skew-bias-content">
                  <p className="skew-article-frame">{sentimentLabels[article.sentiment]}</p>
                  <div
                    className="skew-bias-meter"
                    style={{
                      gridTemplateColumns: `${article.bias.left}fr ${article.bias.center}fr ${article.bias.right}fr`,
                    }}
                  >
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="skew-bias-labels">
                    <span>偏左 {article.bias.left}%</span>
                    <span>中立 {article.bias.center}%</span>
                    <span>偏右 {article.bias.right}%</span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </article>
      </main>
    </div>
  );
}

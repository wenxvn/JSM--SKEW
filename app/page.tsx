import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  return (
    <div className="skew-page">
      <header className="skew-header">
        <div className="skew-container skew-header-inner">
          <Link className="skew-brand" href="/" aria-label="SKEW 首页">
            SKEW
            <span className="skew-brand-subtitle">新闻视角</span>
          </Link>
          <p className="skew-header-context">中文新闻分析</p>
        </div>
      </header>

      <main className="skew-container skew-main" aria-labelledby="page-title">
        <p className="skew-kicker">新闻浏览</p>
        <h1 id="page-title" className="skew-title">
          从不同角度，理解新闻。
        </h1>
        <p className="skew-lead">
          SKEW 将已保存的新闻与分析结果放在同一阅读界面中，帮助你识别报道的情绪与叙事框架。
        </p>

        <div className="skew-overview">
          <section className="skew-panel" aria-labelledby="filter-title">
            <h2 id="filter-title" className="skew-panel-heading">
              浏览范围
              <span className="skew-panel-hint">文章接入后可用</span>
            </h2>
            <div className="skew-filter-list" aria-label="待启用的新闻分类">
              <span className="skew-chip" aria-disabled="true">
                全部新闻
              </span>
              <span className="skew-chip" aria-disabled="true">
                国内
              </span>
              <span className="skew-chip" aria-disabled="true">
                国际
              </span>
              <span className="skew-chip" aria-disabled="true">
                商业与市场
              </span>
            </div>
          </section>

          <aside className="skew-panel" aria-labelledby="bias-title">
            <h2 id="bias-title" className="skew-panel-heading">
              视角标尺
            </h2>
            <div className="skew-bias-content">
              <div
                className="skew-bias-meter"
                aria-label="偏左、中立、偏右的视角标尺"
              >
                <span />
                <span />
                <span />
              </div>
              <div className="skew-bias-labels" aria-hidden="true">
                <span>偏左</span>
                <span>中立</span>
                <span>偏右</span>
              </div>
              <p className="skew-bias-description">
                色彩仅用于辅助解读文章分析，不代表事实判断或媒体立场定论。
              </p>
            </div>
          </aside>
        </div>

        <section className="skew-results" aria-labelledby="results-title">
          <div className="skew-results-heading">
            <h2 id="results-title" className="skew-results-title">
              最新分析
            </h2>
            <p className="skew-results-meta">仅展示已保存的分析结果</p>
          </div>

          <div className="skew-empty-state">
            <div>
              <p className="skew-empty-label">当前没有可读内容</p>
              <h3 className="skew-empty-title">暂无已分析文章</h3>
              <p className="skew-empty-copy">
                新闻完成保存与分析后，会以清晰的来源、摘要和视角信息呈现在这里。
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

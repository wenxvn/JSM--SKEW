"use client";

import Link from "next/link";
import {
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ArticlePreview = {
  id: string;
  category: string;
  region: string;
  title: string;
  summary: string;
  detail: string;
  sourceCount: number;
  visual: string;
  bias: {
    left: number;
    center: number;
    right: number;
  };
};

const navigationItems = ["首页", "我的关注", "本地", "盲点"] as const;
const categories = [
  "全部",
  "国内",
  "国际",
  "商业与市场",
  "科技",
  "社会",
  "健康与医学",
  "体育",
  "气候与环境",
] as const;

const sectionDescriptions: Record<(typeof navigationItems)[number], string> = {
  首页: "全部界面预览",
  我的关注: "我的关注界面预览",
  本地: "本地新闻界面预览",
  盲点: "盲点分析界面预览",
};

const previewArticles: ArticlePreview[] = [
  {
    id: "preview-urban",
    category: "国内",
    region: "城市观察",
    title: "公共空间的更新如何改变日常通勤体验",
    summary: "用于展示国内新闻卡片在首页网格中的标题、摘要与视角信息布局。",
    detail: "这是一条界面预览内容。未来这里将由经过保存与分析的文章详情替换。",
    sourceCount: 12,
    visual: "urban",
    bias: { left: 28, center: 46, right: 26 },
  },
  {
    id: "preview-harvest",
    category: "商业与市场",
    region: "市场观察",
    title: "新的消费节奏正在重塑季节性市场预期",
    summary: "用于验证商业类别在不同视角比例下的卡片信息密度。",
    detail: "这是一条界面预览内容。未来卡片将显示来自 API 的已保存分析字段。",
    sourceCount: 9,
    visual: "harvest",
    bias: { left: 20, center: 51, right: 29 },
  },
  {
    id: "preview-lab",
    category: "科技",
    region: "研究前沿",
    title: "实验室协作模式推动跨领域研究的公开讨论",
    summary: "用于展示技术主题的大图比例、长标题换行与底部标尺。",
    detail: "这是一条界面预览内容。它只服务于交互和视觉测试，不代表真实研究报道。",
    sourceCount: 8,
    visual: "lab",
    bias: { left: 18, center: 55, right: 27 },
  },
  {
    id: "preview-community",
    category: "社会",
    region: "社区议题",
    title: "社区服务的协同机制成为新的公共讨论焦点",
    summary: "用于展示社会议题卡片在三列阅读节奏中的样式效果。",
    detail: "这是一条界面预览内容。未来真实文章的摘要和框架标签将在同一位置展示。",
    sourceCount: 14,
    visual: "community",
    bias: { left: 34, center: 39, right: 27 },
  },
  {
    id: "preview-world",
    category: "国际",
    region: "全球观察",
    title: "多边协作议题在全球公共讨论中持续升温",
    summary: "用于验证国际分类筛选与不同长度中文标题的排版表现。",
    detail: "这是一条界面预览内容。它没有对应的真实来源、新闻链接或外部数据。",
    sourceCount: 11,
    visual: "world",
    bias: { left: 24, center: 48, right: 28 },
  },
  {
    id: "preview-health",
    category: "健康与医学",
    region: "健康观察",
    title: "日常健康信息的可读性成为服务设计的新重点",
    summary: "用于展示健康类别卡片的摘要长度与中立视角标尺。",
    detail: "这是一条界面预览内容。未来将替换为真实文章的已保存分析结果。",
    sourceCount: 7,
    visual: "health",
    bias: { left: 19, center: 59, right: 22 },
  },
  {
    id: "preview-sport",
    category: "体育",
    region: "赛事观察",
    title: "训练方法的公开讨论带来新的赛事观察角度",
    summary: "用于展示体育新闻卡片的视觉主题和可点击详情入口。",
    detail: "这是一条界面预览内容。卡片点击、弹窗与焦点管理可在 API 接入前验证。",
    sourceCount: 10,
    visual: "sport",
    bias: { left: 22, center: 44, right: 34 },
  },
  {
    id: "preview-climate",
    category: "气候与环境",
    region: "环境观察",
    title: "城市气候适应方案进入更细致的评估阶段",
    summary: "用于验证环境主题的卡片比例、颜色节制与响应式布局。",
    detail: "这是一条界面预览内容。它不描述真实政策或真实环境事件。",
    sourceCount: 13,
    visual: "climate",
    bias: { left: 29, center: 43, right: 28 },
  },
  {
    id: "preview-culture",
    category: "国内",
    region: "文化观察",
    title: "城市文化活动如何连接不同年龄层的公共生活",
    summary: "用于补足首页三列网格的第九张卡片，验证完整列表浏览体验。",
    detail: "这是一条界面预览内容。未来 API 返回的数据可直接映射为相同的卡片字段。",
    sourceCount: 6,
    visual: "culture",
    bias: { left: 26, center: 50, right: 24 },
  },
];

export default function HomeNewsPreview() {
  const [activeNavigation, setActiveNavigation] =
    useState<(typeof navigationItems)[number]>("首页");
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("全部");
  const [selectedArticle, setSelectedArticle] = useState<ArticlePreview | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const visibleArticles = useMemo(
    () =>
      activeCategory === "全部"
        ? previewArticles
        : previewArticles.filter((article) => article.category === activeCategory),
    [activeCategory],
  );

  useEffect(() => {
    if (!selectedArticle) {
      return;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedArticle(null);
        requestAnimationFrame(() => triggerRef.current?.focus());
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      const focusable = Array.from(focusableElements);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedArticle]);

  const closeDialog = () => {
    setSelectedArticle(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const openArticle = (
    article: ArticlePreview,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    triggerRef.current = event.currentTarget;
    setSelectedArticle(article);
  };

  return (
    <div className="skew-page">
      <div className="skew-utility-bar">
        <div className="skew-container skew-utility-inner">
          <p>界面预览模式</p>
          <p>本地交互演示</p>
        </div>
      </div>

      <header className="skew-header">
        <div className="skew-container skew-header-inner">
          <Link className="skew-brand" href="/" aria-label="SKEW 首页">
            SKEW
            <span className="skew-brand-subtitle">新闻视角</span>
          </Link>
          <nav className="skew-primary-nav" aria-label="主导航">
            {navigationItems.map((item) => (
              <button
                aria-pressed={activeNavigation === item}
                className={`skew-primary-nav-item ${
                  activeNavigation === item ? "is-current" : ""
                }`}
                key={item}
                onClick={() => setActiveNavigation(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </nav>
          <p className="skew-header-context">中文新闻分析</p>
        </div>
      </header>

      <div className="skew-category-bar">
        <div className="skew-container">
          <nav className="skew-category-scroll" aria-label="新闻分类筛选">
            {categories.map((category) => (
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

      <main className="skew-container skew-main" aria-labelledby="top-news-title">
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
            以下内容只用于验证页面视觉与交互，不是已保存新闻或真实分析。
          </p>

          <div className="skew-news-grid" aria-live="polite">
            {visibleArticles.map((article) => (
              <article className="skew-preview-card" key={article.id}>
                <button
                  aria-haspopup="dialog"
                  aria-label={`查看界面预览：${article.title}`}
                  className="skew-preview-card-button"
                  onClick={(event) => openArticle(article, event)}
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className={`skew-preview-visual skew-preview-visual-${article.visual}`}
                  />
                  <span className="skew-preview-card-content">
                    <span className="skew-preview-meta">
                      <span className="skew-preview-tag">界面预览</span>
                      <span>
                        {article.category} · {article.region}
                      </span>
                    </span>
                    <span className="skew-preview-title">{article.title}</span>
                    <span className="skew-preview-summary">{article.summary}</span>
                    <span
                      className="skew-preview-bias"
                      style={{
                        gridTemplateColumns: `${article.bias.left}fr ${article.bias.center}fr ${article.bias.right}fr`,
                      }}
                    >
                      <span className="skew-preview-bias-left">
                        预览偏左 {article.bias.left}%
                      </span>
                      <span className="skew-preview-bias-center">
                        预览中立 {article.bias.center}%
                      </span>
                      <span className="skew-preview-bias-right">
                        预览偏右 {article.bias.right}%
                      </span>
                    </span>
                    <span className="skew-preview-card-footer">
                      <span>{article.sourceCount} 个预览来源</span>
                      <span className="skew-preview-open">查看预览</span>
                    </span>
                  </span>
                </button>
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

      <footer className="skew-footer">
        <div className="skew-container skew-footer-inner">
          <div>
            <p className="skew-footer-brand">SKEW</p>
            <p className="skew-footer-copy">从不同角度，理解新闻。</p>
          </div>
          <p className="skew-footer-copy">界面预览，不含真实新闻数据</p>
        </div>
      </footer>

      {selectedArticle && (
        <div
          className="skew-preview-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDialog();
            }
          }}
        >
          <div
            aria-describedby="preview-dialog-description"
            aria-labelledby="preview-dialog-title"
            aria-modal="true"
            className="skew-preview-dialog"
            ref={dialogRef}
            role="dialog"
          >
            <div className="skew-preview-dialog-header">
              <span className="skew-preview-tag">界面预览</span>
              <button
                className="skew-dialog-close"
                onClick={closeDialog}
                ref={closeButtonRef}
                type="button"
              >
                关闭
              </button>
            </div>
            <div
              aria-hidden="true"
              className={`skew-preview-dialog-visual skew-preview-visual-${selectedArticle.visual}`}
            />
            <div className="skew-preview-dialog-content">
              <p className="skew-preview-meta-text">
                {selectedArticle.category} · {selectedArticle.region}
              </p>
              <h2 id="preview-dialog-title">{selectedArticle.title}</h2>
              <p id="preview-dialog-description">{selectedArticle.detail}</p>
              <div
                className="skew-preview-bias"
                style={{
                  gridTemplateColumns: `${selectedArticle.bias.left}fr ${selectedArticle.bias.center}fr ${selectedArticle.bias.right}fr`,
                }}
              >
                <span className="skew-preview-bias-left">
                  预览偏左 {selectedArticle.bias.left}%
                </span>
                <span className="skew-preview-bias-center">
                  预览中立 {selectedArticle.bias.center}%
                </span>
                <span className="skew-preview-bias-right">
                  预览偏右 {selectedArticle.bias.right}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

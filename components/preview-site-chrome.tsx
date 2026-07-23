import Link from "next/link";

export const previewNavigationItems = ["首页", "我的关注", "本地", "盲点"] as const;

type PreviewNavigationItem = (typeof previewNavigationItems)[number];

type PreviewSiteHeaderProps = {
  activeNavigation?: PreviewNavigationItem;
  context?: string;
  onNavigationChange?: (item: PreviewNavigationItem) => void;
};

export function PreviewSiteHeader({
  activeNavigation,
  context = "新闻分析预览",
  onNavigationChange,
}: PreviewSiteHeaderProps) {
  return (
    <>
      <a className="skew-skip-link" href="#main-content">
        跳到主要内容
      </a>
      <div className="skew-utility-bar">
        <div className="skew-container skew-utility-inner">
          <p>界面预览模式</p>
          <p>本地展示数据</p>
        </div>
      </div>

      <header className="skew-header">
        <div className="skew-container skew-header-inner">
          <Link className="skew-brand" href="/" aria-label="SKEW 首页">
            SKEW
            <span className="skew-brand-subtitle">新闻视角</span>
          </Link>
          <nav className="skew-primary-nav" aria-label="主导航">
            {previewNavigationItems.map((item) =>
              onNavigationChange ? (
                <button
                  aria-pressed={activeNavigation === item}
                  className={`skew-primary-nav-item ${
                    activeNavigation === item ? "is-current" : ""
                  }`}
                  key={item}
                  onClick={() => onNavigationChange(item)}
                  type="button"
                >
                  {item}
                </button>
              ) : (
                <span
                  aria-current={item === "首页" ? "page" : undefined}
                  className={`skew-primary-nav-item skew-primary-nav-label ${
                    item === "首页" ? "is-current" : ""
                  }`}
                  key={item}
                >
                  {item}
                </span>
              ),
            )}
          </nav>
          <p className="skew-header-context">{context}</p>
        </div>
      </header>
    </>
  );
}

export function PreviewSiteFooter() {
  return (
    <footer className="skew-footer">
      <div className="skew-container skew-footer-inner">
        <div>
          <p className="skew-footer-brand">SKEW</p>
          <p className="skew-footer-copy">从不同角度，理解新闻。</p>
        </div>
        <p className="skew-footer-copy">界面预览，不含真实新闻数据</p>
      </div>
    </footer>
  );
}

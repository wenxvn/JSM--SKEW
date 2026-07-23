# 新闻预览素材与详情页变更记录

## 时间与环境

2026 年 7 月 23 日，Asia/Shanghai。本次操作仅在本地工作区执行，没有触碰开发、预发布或生产数据库。

## 操作

在用户明确授权后，从 Unsplash 下载九张允许网站使用的通用编辑图片，并保存到 `public/preview-news/`，用于本地“界面预览”新闻卡片和详情页封面。图片在下载后逐张检查，未使用参考截图、新闻人物、政治人物、旗帜、新闻机构标志或运行时外部图片链接。

本地素材文件为：

- `urban-transit.jpg`
- `vineyard.jpg`
- `research-lab.jpg`
- `community-library.jpg`
- `global-network.jpg`
- `health-service.jpg`
- `sport-field.jpg`
- `climate-city.jpg`
- `culture-gallery.jpg`

同时新增本地预览数据、首页无已保存文章时的预览回退、预览详情路由与响应式详情布局。已有 Supabase 已保存文章路径保持原样，预览数据不写入 Supabase。

## 结果

`npm run lint`、`git diff --check` 和 `npm run build` 均通过。详情路由 `/news/[id]` 会优先处理本地预览 ID，其他 UUID 保持通过既有 Supabase 查询读取已保存文章。

## 外部服务与回滚

本次只发生一次性图片下载，不调用 Supabase、Clerk 管理接口、Oxylabs、AI、PostHog 或 Vercel。页面运行时仅加载项目内图片文件。

回滚时移除 `public/preview-news/` 内本次素材，并撤销预览数据、预览详情组件和首页回退逻辑即可；不需要恢复外部服务或业务数据。

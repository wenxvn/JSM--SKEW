# Supabase 数据库与数据访问层

## 目标

按教程所示建立 SKEW 的基础 Supabase 数据层，并将受保护的首页与新闻详情页改为仅读取已保存的数据。范围包括六张核心表、可审阅的迁移、手写 TypeScript 类型、服务端 Supabase 管理客户端、类型化读取查询、日志写入器，以及真实数据为空时的页面状态。

不包含抓取、Scheduler、AI 分析、pgvector、相关报道推荐、PostHog 新事件、Clerk 控制台互信或部署操作。

## 已阅读的技能

- `skills/architect/SKILL.md`
- `skills/develop/SKILL.md`
- `.agents/skills/supabase/SKILL.md`

## 已检查的代码与记录

- `AGENTS.md`
- `design.md`
- `app/page.tsx`
- `components/home-news-preview.tsx`
- `lib/env/public.ts`
- `lib/env/server.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `package.json`
- `prompts/news-details-page-ui.md`
- `docs/changes/2026-07-22-supabase-readonly-connectivity-check.md`

## 决策与假设

- 使用仓库内可审阅的 Supabase SQL 迁移，而不是仅在控制台手工建表。迁移文件名必须由 `supabase migration new` 生成。
- 当前没有 `supabase/` 目录，因此采用命令式迁移流程。首次实施前先通过 `supabase --help` 确认已安装 CLI 的实际命令和版本。
- 六张表固定为 `sources`、`articles`、`article_analyses`、`logs`、`oxylabs_schedules` 与 `oxylabs_schedule_runs`。
- `articles.url` 作为全局去重键。文章只代表详情页，不能保存来源首页、列表页或分类页。
- `article_analyses` 与 `articles` 为一对一关系，并保存用于页面阅读的摘要、情绪、框架、偏向数值与分析时间。嵌入向量字段在后续 pgvector 任务中单独加入。
- 新闻源 URL 不能硬编码在 SQL、TypeScript、提示词或文档中。教程中的五个来源仅作为数据模型示例；本次不写入实际来源，后续只能经批准向数据库的 `sources` 表配置。
- 网站页面只能通过服务端读取查询访问数据库。浏览器不使用 Secret Key，也不直接读取或写入业务数据。
- 首页以已分析文章为数据源，按发布时间倒序。详情页根据文章主键读取文章与分析，找不到时使用 `notFound()`。
- 首次无数据时展示符合 `design.md` 的中文空状态，移除真实数据页面中的本地预览文章、虚构统计、虚构来源与预览标记。
- 迁移默认不直接应用到远程 Supabase。若实施后需要应用迁移或写入种子数据，必须在操作前获得用户对目标环境、数据库项目和写入影响的明确批准。

## 预计变更的文件

- `supabase/config.toml`，仅在 CLI 初始化流程确认需要时创建，且不包含凭证。
- `supabase/migrations/<CLI 生成的时间戳>_create_core_data_layer.sql`
- `supabase/seed.sql`，只保留安全的空结构或注释，不含任何来源 URL 或实际种子数据。
- `lib/supabase/types.ts`
- `lib/supabase/admin.ts`
- `lib/supabase/queries.ts`
- `lib/supabase/mappers.ts`
- `app/page.tsx`
- `components/home-news-preview.tsx`，改名或替换为真实数据展示组件。
- `app/news/[id]/page.tsx` 与必要的详情展示组件。
- `app/globals.css`，仅为真实数据空状态、卡片与详情页复用已有设计令牌的必要调整。
- `design.md`，仅当组件状态规则需要长期补充时同步更新。
- `docs/changes/<日期>-supabase-data-layer.md`

## 实施要求

1. 使用 Supabase CLI 创建迁移，建立六张表、主键、外键、非空约束、时间字段与索引。每个 exposed schema 表均启用 RLS。
2. 公开读取策略仅限已认证的 Clerk 用户所需的页面读取范围。若 Clerk 与 Supabase JWT 互信尚未配置，不创建猜测性的用户身份策略，也不放宽为匿名读写。服务端管理客户端承担当前应用查询。
3. 为 `articles.url`、常用发布日期排序、分析关联与运行日志查询建立适当索引。不要建立 pgvector 扩展、列或索引。
4. 使用 `SUPABASE_SECRET_KEY` 创建 server only 管理客户端。浏览器与普通服务端会话客户端继续只使用 Publishable Key。
5. 定义手写 `Database`、行类型、插入类型和页面查询结果类型，不使用 `any` 或未校验的 JSON 直接传给组件。
6. 创建数据访问函数，包括首页已分析文章列表、单篇文章详情、来源列表和小型日志写入器。读取函数返回可被页面组件直接映射的稳定领域对象。
7. 将首页改为服务端获取存储文章，保留真正可用的分类交互时只在已加载数据上筛选。无数据时显示诚实的空状态。
8. 新增或接通 `/news/[id]` 详情页。访问无效或无分析文章时返回 404，不回退到任意示例文章。
9. 不执行真实抓取、AI 调用、Scheduler 创建、数据库写入或远程迁移应用。任何真正的数据库写入另行获得目标环境批准。
10. 在变更记录中用中文记录时间、操作者、目标环境、本地代码和迁移产物、未执行的远程操作、验证结果、回滚方法与后续事项，不记录任何凭证或来源 URL。

## 安全要求

- `SUPABASE_SECRET_KEY` 只能在 `server-only` 模块中读取，绝不能导入客户端组件、公开环境变量或日志。
- 所有数据库响应都按不可信数据处理，映射到组件前验证可空字段、枚举值、数值范围和日期。
- 不向页面发送文章全文以外的密钥、Cookie、令牌、用户标识或运行日志敏感上下文。
- 不创建匿名写入、宽泛 `TO authenticated` 无所有权约束的写策略，或 `SECURITY DEFINER` 作为权限问题的替代方案。
- 不在版本控制文件中写入真实来源 URL、密钥或种子业务数据。

## 验收标准

- 六张表和约束均存在于可审阅迁移中，且迁移具备清晰回滚说明。
- 当前代码具备服务端管理客户端、类型化读取查询、日志写入边界和页面映射层。
- 首页与详情页不再显示本地预览数据，且只从已保存的数据库结果渲染。
- 数据为空时首页显示中文空状态，详情页对无效记录返回 404。
- 客户端构建产物和客户端模块不引用 Secret Key。
- 不存在硬编码来源 URL、实际新闻源种子、远程数据库写入或控制台改动。
- 静态检查与生产构建通过。

## 需运行的检查

- `supabase --version` 与关联命令的 `--help`。
- SQL 静态审查，核对六张表、外键、索引、RLS 与策略。
- 对查询映射和空状态运行针对性测试，或在项目既有测试框架不可用时运行 TypeScript 与构建检查。
- `npm run lint`
- `npm run build`
- 脱敏检查，确认 Secret Key 未出现在客户端导入图、Git 差异、迁移、种子或文档中。

## 实施后的精确手动测试步骤

1. 在不应用迁移的本地环境启动应用，确认不存在对 Supabase 的写入请求。
2. 使用已认证会话访问首页，确认无文章时显示中文空状态，不显示任何预览文章或虚构统计。
3. 在受控开发数据库应用迁移并手动插入一条最小有效文章和分析记录后，确认首页显示该记录，且点击进入对应详情页。
4. 访问不存在的 `/news/<id>`，确认返回 404。
5. 在 1280px、390px 和 320px 视口检查卡片、空状态和详情阅读布局，确认没有横向滚动、重叠或文字裁切。
6. 检查浏览器网络请求和构建产物，确认没有 Secret Key、远程抓取、AI 调用或数据库写入。

## 回滚说明

- 代码层回滚为当前本地预览页面和原有组件。
- 远程迁移默认不执行。若未来经批准应用，回滚需要先备份目标环境数据，再按迁移中定义的逆序删除依赖对象；此操作必须单独批准。

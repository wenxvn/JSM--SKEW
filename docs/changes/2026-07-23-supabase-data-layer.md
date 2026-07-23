# 2026-07-23 Supabase 数据层实现与手工迁移记录

## 时间与操作者

- 时间：2026-07-23
- 本地实现操作者：Codex
- 远程迁移操作者：用户，通过 Supabase 控制台 SQL Editor
- 目标环境：控制台显示为 Production。用户将其用于学习验证，该用途不改变平台环境标签。

## 本次变更

- 新增六张核心表的 SQL 迁移：`sources`、`articles`、`article_analyses`、`logs`、`oxylabs_schedules`、`oxylabs_schedule_runs`。
- 为所有公开 schema 表启用 RLS，未创建匿名策略或宽泛读写策略。
- 新增空的 `supabase/seed.sql`，不包含新闻源 URL 或实际业务种子数据。
- 新增 server only Supabase 管理客户端、数据库类型、运行时映射与类型化读取查询。
- 首页改为展示已保存且带分析的文章。数据为空时显示明确空状态。
- 新增受保护的 `/news/[id]` 详情页。不存在或不完整的记录返回 404。

## 外部操作与结果

- 用户在 Supabase 控制台执行了 `supabase/migrations/20260723090000_create_core_data_layer.sql`。
- 用户提供的 Table Editor 截图确认六张核心表已经出现，且 `logs` 表当时没有记录。
- 未写入 `sources`、`articles` 或 `article_analyses` 业务数据，未创建调度任务，也未执行抓取、AI 分析、Scheduler 或部署操作。
- 截图仅确认表存在性。索引与 RLS 的远程状态未逐项读取验证，后续变更前必须补做针对性只读检查。

## 验证结果

- `npm run lint`、`npx tsc --noEmit` 与 `npm run build` 在本地实现阶段通过。
- 用户截图确认迁移后的六张表可在控制台中查看。
- 本地检查确认客户端模块不导入 `SUPABASE_SECRET_KEY`，该变量只在 `server-only` 模块中使用。

## 回滚方法

- 本地代码回滚可恢复原首页组件并移除本次新增的数据访问、详情路由和样式。
- 远程迁移已经应用。撤销表、索引或 RLS 规则属于破坏性操作，必须先确认目标环境、备份策略和精确逆向 SQL，并获得单独批准。

## 后续事项

- 在下一次数据库变更前，对已应用迁移补做表关系、索引与 RLS 的只读验证。
- 来源必须经受控数据库流程配置，不能从代码、种子或文档硬编码写入。
- 手工测试文章必须先写入来源、再写入文章和一对一分析记录；写入前确认当前 Production 标签项目和影响范围。
- 抓取、AI 分析、pgvector 与调度功能应作为独立任务实施。

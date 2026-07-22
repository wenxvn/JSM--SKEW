# SKEW 开发环境服务配置

本指南只配置开发环境。不要把密钥、密码、Cookie、令牌或完整连接字符串发送到聊天，也不要提交 `.env.local`。

## 1. 创建本地环境文件

在仓库根目录复制 `.env.example` 为 `.env.local`，再在本机填写值。`.env.local` 已被 Git 忽略。

`AI_PROVIDER` 支持 `openai` 与 `dashscope`。模型可用性、价格和区域限制以对应 Provider 的开发者控制台为准。

## 2. Clerk 开发实例

1. 登录 Clerk Dashboard，创建或选择开发实例，框架选择 Next.js。
2. 在 API Keys 页面复制开发环境的 Publishable key 到 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`，复制 Secret key 到 `CLERK_SECRET_KEY`。
3. 在开发实例中允许本地地址 `http://localhost:3000`，并选择一种测试登录方式。
4. 不创建生产用户、组织、角色、Webhook，也不修改生产重定向 URL。

## 3. Supabase 开发项目

1. 创建或选择隔离的 Supabase 开发项目。
2. 点击 Dashboard 顶部的 `Connect`，或进入 `Settings → General`，复制 Project URL 到 `NEXT_PUBLIC_SUPABASE_URL`。API Keys 页面只提供 key，不显示该 URL。
3. 在 API Keys 页面复制 publishable key 到 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`。
4. 当前不需要填写 `SUPABASE_SECRET_KEY`。该值只供后续经批准的服务端后台任务使用，不能进入浏览器。
5. 截图中 `main` 标记为 `PRODUCTION`。推荐为本地开发创建独立项目；若本地开发必须连接生产项目，限定为只读验证，不创建表、迁移、RLS 策略、函数、pgvector 索引或 Clerk JWT 信任配置。

## 4. Oxylabs 开发凭证

1. 在 Oxylabs Dashboard 确认 Web Scraper API 产品可用于开发测试。
2. 将用户名填入 `OXYLABS_USERNAME`，密码填入 `OXYLABS_PASSWORD`。
3. 不在控制台发起抓取，不创建或修改 Scheduler，不设置真实新闻源。

## 5. OpenAI 或 DashScope 模型密钥

1. 如使用 OpenAI，设置 `AI_PROVIDER=openai`，在 OpenAI 开发者控制台创建受限的开发项目 API Key 并填入 `OPENAI_API_KEY`。
2. 如使用阿里云百炼 DashScope，设置 `AI_PROVIDER=dashscope`，把同一地域与计费方案的 API Key 填入 `DASHSCOPE_API_KEY`。
3. 华北 2（北京）的 DashScope OpenAI 兼容地址为 `https://dashscope.aliyuncs.com/compatible-mode/v1`，填入 `AI_BASE_URL`。不得把 DashScope Key 填入 `OPENAI_API_KEY`。
4. 选择已开通的模型并填入 `AI_MODEL`，例如 `qwen3.7-plus`；当前代码不会调用模型，也不会发送文章内容。

## 6. 本地验证

1. 执行 `npm run dev` 并访问 `http://localhost:3000`。
2. 未登录时应进入 Clerk 登录流程，登录成功后才显示首页。
3. 在浏览器开发工具中确认没有服务端密钥、Oxylabs 密码或 OpenAI API Key。
4. 确认 Supabase、Oxylabs 和 OpenAI 控制台没有新增数据、抓取运行或模型调用。

## 7. PostHog 开发观测

1. 为本地开发使用独立的 PostHog 项目。不要把开发、预发布或生产项目令牌混用。
2. 在该开发项目的设置页面取得浏览器公开项目令牌，并确认其所属区域的采集端点。只将两者填入本机 `.env.local` 的 `NEXT_PUBLIC_POSTHOG_KEY` 和 `NEXT_PUBLIC_POSTHOG_HOST`，不要提交 `.env.local`，也不要把值发送到聊天、日志或提示词。
3. 重启 `npm run dev`。缺少 `NEXT_PUBLIC_POSTHOG_KEY` 时，应用不会初始化 PostHog，也不会发送 PostHog 请求。
4. 当前版本只允许匿名 `$pageview` 与 `$pageleave` 事件。事件只保留清理后的路径和 SDK 运行所需的匿名技术字段。不会发送查询参数、片段、来源页、页面标题、文章内容、文章 URL、来源名称、搜索词、表单输入、Clerk 用户资料、认证状态、邮箱、Cookie、令牌或服务端密钥。
5. 代码已禁用自动点击采集、rage click、Session Replay、自动异常采集、性能采集、调查、实验、Feature Flags、用户识别和 person profile 处理。不要在 PostHog 控制台以更宽松的项目设置绕过这些代码边界。
6. 验证时在浏览器网络面板筛选 PostHog 请求，确认首次访问只出现 `$pageview`，离开页面时只出现 `$pageleave`。用含测试查询参数与片段的本地地址访问时，确认事件中只保留路径。
7. 本仓库当前没有测试运行器。属性净化逻辑位于 `lib/posthog/privacy.ts`，后续引入测试基础设施时应优先为其补充允许事件、拒绝事件、URL 净化和 `$set` 删除的单元测试。

本次未配置 PostHog 控制台、Vercel 环境变量或生产项目，也未发送真实事件。任何生产环境变量配置、生产事件收集策略变更、数据导出、保留期调整、权限变更或实际生产事件发送，都必须在执行前取得针对目标环境的明确批准。

## 后续需单独批准的工作

- Clerk 与 Supabase 的身份互信和 JWT 配置。
- Supabase 迁移、RLS、pgvector、新闻源及任何数据写入。
- Oxylabs 的真实抓取、Scheduler 创建或修改。
- OpenAI 的文章分析请求和成本控制策略。
- 新增 PostHog 自定义事件、扩大事件字段或调整隐私边界。
- PostHog 的生产环境变量配置与实际生产事件发送。

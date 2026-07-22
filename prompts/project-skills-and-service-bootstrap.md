# 配置项目技能与服务接入基础

## 目标

为 SKEW 的开发环境建立可复现的项目级 Agent Skills 与服务接入基础，覆盖 Clerk、Supabase、Oxylabs 和 Vercel AI SDK。完成后，项目能够安全读取本地环境变量，具备认证、数据库访问、服务端抓取客户端和 AI 分析客户端的最小代码边界，但不运行真实抓取、不写入真实业务数据、不创建调度任务，也不变更生产环境。

## 已阅读的技能

- `skills/architect/SKILL.md`：用于确定跨服务边界、环境变量来源和需要用户确认的架构决策。
- `skills/develop/SKILL.md`：用于按经批准的提示词进行最小实现，并确保配置完整时才启动服务。
- `skills/check/SKILL.md`：用于在实现后进行构建、静态检查和手动验证。
- `skills/test/SKILL.md`：用于按实际改动选择合适的自动化测试范围。
- `skills/sync/SKILL.md`：用于在改动完成后同步长期上下文和变更状态。
- `skill-installer`：用于采用受控、可追溯的方式安装 Codex 可用的技能；该技能仅管理用户级 Codex 技能，因此项目内的 `.agents/skills/` 仍使用 `npx skills` 安装。

## 已检查的代码与配置

- `package.json`：当前仅包含 Next.js、React、Tailwind 和 ESLint，尚未安装 Clerk、Supabase 或 AI SDK 依赖。
- `app/`：仍为 `create-next-app` 的初始页面，尚无路由保护、服务端客户端或业务数据层。
- `.gitignore`：已忽略所有 `.env*` 文件，可安全创建不含值的 `.env.example`。
- `node_modules/next/dist/docs/`：本地存在 Next.js 文档；实施时应优先查阅 Next.js 16 对 `proxy.ts`、服务端边界和 Route Handler 的说明。
- `AGENTS.md`：明确要求 Supabase、Clerk、Oxylabs、AI 和界面层分离，且任何外部服务生产性操作均需额外批准。
- `prompts/maintenance-workflow.md`：记录项目当前没有上述服务的实际集成，且仓库的本地工作流技能目录为 `skills/`。

## 决策与假设

- 目标环境暂定为开发环境。未经用户对具体操作的明确确认，不访问或修改生产环境。
- 项目级技能仅安装与当前范围直接相关的最小集合：`ai-sdk`、`clerk`、`clerk-setup`、`clerk-nextjs-patterns`、`clerk-backend-api`、`clerk-testing`、`supabase`、`supabase-postgres-best-practices`、`oxylabs-web-scraper`。不安装 `clerk-billing`、`clerk-orgs`、`clerk-webhooks`、`clerk-custom-ui` 等当前产品范围未要求的技能。
- 安装前必须通过 `npx skills` 的来源与可用包清单核实每项技能，记录实际来源和安装结果；找不到或来源不可信的项目不得安装。
- Clerk 是身份、会话与受保护路由的唯一事实来源。Supabase 是业务数据的唯一事实来源。浏览器只能使用 Supabase 的 publishable key，Supabase secret key、Clerk secret key、Oxylabs 凭证和 AI Provider 密钥只能由服务端读取。
- Oxylabs 只配置服务端调用客户端和凭证变量，不对任何新闻源发起请求，不创建、修改、启停 Scheduler 任务。
- Vercel AI SDK 只是应用层 SDK，仍需由用户选择一个 AI Provider。默认建议 OpenAI 作为首个 Provider，使用环境变量 `OPENAI_API_KEY`，模型名称通过非敏感环境变量配置；用户也可以指定 Anthropic、Google 或其他受支持 Provider。
- 此次不创建 Supabase 表、迁移、RLS、pgvector 索引或 Clerk 与 Supabase 的控制台信任配置。它们会影响数据和权限，需在后续已批准提示词中单独设计，并在实际执行前再次确认。
- 此次不配置 PostHog。虽然它是项目范围的一部分，但不在本次截图中的服务集合内，应在事件名称、字段和隐私边界确定后单独接入。

## 预计变更的文件

- `.agents/skills/`：由 `npx skills` 安装经核实的项目级技能及其元数据。
- `package.json`、锁文件：加入 `@clerk/nextjs`、`@supabase/supabase-js`、`@supabase/ssr`、`ai` 和所选 AI Provider 的最小依赖。
- `.env.example`：只列出变量名称与中文用途说明，不包含任何真实值。
- `app/layout.tsx`、`proxy.ts`：加入 Clerk Provider 和符合 Next.js 16 的路由保护骨架。
- `lib/env.ts`：在服务端与客户端边界分别校验需要的环境变量，并在缺失时给出可操作的错误信息。
- `lib/supabase/client.ts`、`lib/supabase/server.ts`：创建浏览器与服务端 Supabase 客户端，不使用 service key 访问浏览器。
- `lib/oxylabs/client.ts`：创建仅服务端可用的 Oxylabs 请求封装，不包含来源 URL、自动执行逻辑或凭证输出。
- `lib/ai/provider.ts`：创建仅服务端可用的 AI Provider 初始化入口，限制为结构化文章分析后续会调用的最小接口。
- `docs/changes/` 下的中文记录文件：仅在实际执行过外部控制台操作时记录时间、开发环境、操作者、影响、结果、链接或运行 ID 与后续事项；不得记录密钥。

## 实施要求

1. 先运行只读的技能来源发现与安装清单检查。仅在用户同意项目级安装后，使用 `npx skills` 把已核实的技能安装到 `.agents/skills/`；安装完成后列出目录名，不复制或展示技能中的密钥示例。
2. 使用项目已有的包管理器安装最小依赖。安装前检查各库的当前 Next.js 16 集成方式和项目本地 Next.js 文档，避免使用已过时的中间件命名或客户端初始化模式。
3. 新建 `.env.example`，至少包含以下变量名称和中文用途说明：
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `OXYLABS_USERNAME`
   - `OXYLABS_PASSWORD`
   - `AI_PROVIDER`
   - `AI_MODEL`
   - 所选 Provider 的服务端 API Key，例如 `OPENAI_API_KEY`
4. 不创建或读取带有真实值的 `.env.local`，除非用户明确表示已在本机自行填入，且不得输出其中任何值。
5. 配置 Clerk 的 Provider 与受保护路由骨架。公共路由必须最少化，业务 API Route 必须在服务端复核身份；在缺少 Clerk 配置时，应用需要明确失败而非悄悄绕过认证。
6. 创建 Supabase 浏览器与服务端客户端边界，避免把 `SUPABASE_SECRET_KEY` 导入客户端模块或传给浏览器。当前不得写入、删除或迁移数据库。
7. 创建 Oxylabs 服务端客户端，采用 Basic Auth 或其官方当前推荐方式从环境变量读取凭证，设置超时和错误分类，并禁止模块导入时自动发出网络请求。
8. 创建 AI SDK Provider 入口，AI 输出在后续文章分析功能中必须通过 Zod 等结构校验后才能持久化；本次不发送真实分析请求，也不向遥测传递文章全文或密钥。
9. 只给出以下控制台的中文、逐步人工配置清单，不代替用户在控制台进行写操作：
   - Clerk 开发实例：创建或选择应用，取得 publishable key 与 secret key，添加本地开发 URL，确认测试用户方式。
   - Supabase 开发项目：取得 Project URL、publishable key 和仅服务端使用的 secret key。不要把旧版 `anon` 或 `service_role` 值当作新项目的默认选择。
   - Oxylabs：确认 Web Scraper API 产品已启用，创建或更新最小权限凭证；不点击执行抓取或 Scheduler。
   - AI Provider：创建受限项目 API key，设置可接受的成本上限，并把 key 保存在本机 `.env.local`。
10. 若用户要求设置 Clerk 与 Supabase 的 JWT 或第三方身份集成，先输出将变更的控制台字段、RLS 影响、回滚方式和目标环境，并等待针对该操作的单独批准。

## 安全要求

- 不接收、打印、提交、记录、截图保存或回显任何密钥、密码、Cookie、访问令牌或完整连接字符串。
- 不操作生产环境，不创建真实用户，不改动重定向 URL、Webhook、组织、角色、RLS、JWT、数据库 schema 或 API key。
- 不执行 Oxylabs 抓取、Scheduler 操作或任何可能产生费用的请求。
- 不将 `SUPABASE_SECRET_KEY`、`CLERK_SECRET_KEY`、`OXYLABS_PASSWORD` 或 AI Provider 密钥标记为 `NEXT_PUBLIC_`，也不从客户端代码导入。
- 所有外部响应、请求参数和未来 AI 输出都按不可信输入处理，并在服务端进行校验。
- 遇到旧版 Supabase Key 与新版 publishable/secret key 并存时，先确认项目控制台实际提供的凭证类型，不做猜测性替换。

## 验收标准

- `.agents/skills/` 中只包含当前范围相关、来源可核实的技能，且安装过程可复现。
- 所有新增包均在锁文件中固定，`npm run lint` 和 `npm run build` 通过。
- `.env.example` 不含真实凭证，`.env.local` 继续被 Git 忽略。
- Clerk、Supabase、Oxylabs 和 AI SDK 代码均有明确的服务端或客户端边界，敏感变量不能进入浏览器构建产物。
- 应用在缺少必要配置时给出明确错误，不会自动改用生产环境或执行外部请求。
- 没有数据库 schema、RLS、Clerk 控制台、Oxylabs Scheduler、新闻源数据、AI 费用或生产环境发生变更。

## 需运行的检查

1. `git diff --check`。
2. `npm run lint`。
3. `npm run build`。
4. 搜索 `NEXT_PUBLIC_` 与服务端密钥变量，确认敏感变量未出现在客户端可导入模块中。
5. 检查 `.env.example`、`git status --short` 与 `.gitignore`，确认没有真实 `.env.local` 被纳入版本控制。
6. 在不含凭证的环境运行配置校验，确认报错不包含变量值、密钥或连接字符串。

## 实施后的精确手动测试步骤

1. 在 Clerk、Supabase、Oxylabs 和 AI Provider 分别创建或选择开发环境的凭证，不要把值发送给代理；仅将它们填入本机 `.env.local`。
2. 启动 `npm run dev`，打开本地首页，确认未登录用户会按 Clerk 的配置进入登录流程，且没有可访问的受保护业务页面。
3. 使用 Clerk 开发测试用户完成登录，确认会话在浏览器刷新后保持有效。
4. 在浏览器开发工具的网络与源代码搜索中确认没有 `SUPABASE_SECRET_KEY`、`CLERK_SECRET_KEY`、`OXYLABS_PASSWORD` 或 Provider API key。
5. 不触发任何抓取或 AI 分析请求；只验证服务端客户端模块在项目内可被安全导入。
6. 在 Supabase、Clerk 和 Oxylabs 控制台确认没有新增数据库数据、权限改动、用户生产变更、Scheduler 任务或抓取运行。
7. 如需继续配置 Clerk 与 Supabase 的身份互信、建表/RLS、新闻源或 Oxylabs 调度，分别创建新的中文实施提示词并在实际控制台操作前取得明确批准。

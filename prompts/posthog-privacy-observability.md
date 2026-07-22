# PostHog 隐私合规观测实施提示词

## 目标

为 SKEW 的 Next.js 应用接入 PostHog 浏览器 SDK，建立最小、可审计且默认匿名的产品观测基础。首个切片只记录页面访问与离开，不伪造当前尚未存在的文章、筛选或分析交互事件。实现必须支持开发、预发布和生产环境使用各自隔离的公开 PostHog 项目令牌，并在未配置令牌时完全不发送请求。

## 已阅读的技能

- `skills/develop/SKILL.md` 与 `skills/develop/logical-guide.md`：确认本次属于已有 Next.js 应用的第三方客户端集成，客户端初始化、环境变量和外部响应边界必须明确。
- `skills/test/SKILL.md`：确认测试应覆盖初始化开关和事件属性净化，而非把真实 PostHog 项目作为测试依赖。
- `skills/check/SKILL.md`：确认实施完成后应按运行验证模式核对已批准提示词中的验收条件。
- `skills/sync/SKILL.md`：确认完成后应仅在有确切代码事实时同步长期上下文。
- `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`：确认浏览器可读取的配置必须使用 `NEXT_PUBLIC_` 前缀，且其值在构建时内联。
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation-client.md`：确认 `instrumentation-client.ts` 可在 React hydration 前执行轻量客户端观测初始化。
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`：确认 PostHog SDK 只能放在客户端边界，不能由服务端页面或服务端密钥初始化。

## 已检查的代码与记录

- `AGENTS.md`：PostHog 仅用于匿名化产品分析和运行观测，不能作为业务数据、认证或授权来源；文章全文、密钥、Cookie、访问令牌、邮箱与其他直接标识信息不得发送。生产环境的事件收集策略或控制台配置变更需单独取得明确批准。
- `package.json`：项目为 Next.js 16、React 19 和 TypeScript，尚未安装 `posthog-js`，现有脚本为 `lint`、`build` 与开发服务器。
- `app/layout.tsx`：根布局只包裹 `ClerkProvider`，适合作为后续客户端初始化之外的服务端布局，不把 Clerk 用户资料传给 PostHog。
- `app/page.tsx`：首页由服务端 `auth()` 保护，当前只有静态新闻浏览外壳与空状态，没有真实文章、筛选、详情或管道操作。
- `.gitignore`：所有 `.env*` 文件被忽略，只有 `.env.example` 可提交；当前仓库没有 `.env.example`。
- `docs/setup/development-services.md`：已说明开发环境隔离和 PostHog 事件设计需单独批准。
- 用户提供的 PostHog 项目设置截图：确认用户已有 US Cloud 项目，但本提示词不记录、复制或使用截图中的项目令牌。

## 决策与假设

- 使用官方浏览器 SDK `posthog-js`，不增加服务端 SDK、数据库表、Route Handler 或外部代理。这样不会让观测层承担业务写入、身份判断或授权责任。
- 使用根目录 `instrumentation-client.ts` 初始化 SDK。它在 hydration 前运行，且比在服务端布局中调用浏览器 SDK 更符合 Next.js App Router 的客户端边界。
- 只在 `NEXT_PUBLIC_POSTHOG_KEY` 存在时初始化。缺失、空值或初始化异常必须静默降级，不阻断页面渲染，也不得在控制台打印令牌或事件属性。
- 新增可提交的 `.env.example`，仅列出变量名和中文注释，绝不包含真实值。使用 `NEXT_PUBLIC_POSTHOG_KEY` 作为浏览器 SDK 的公开项目令牌，使用 `NEXT_PUBLIC_POSTHOG_HOST` 指向所属云区域的采集端点。生产、预发布和开发必须各自提供独立值。
- 默认收集策略为：页面浏览 `$pageview` 与页面离开 `$pageleave`。当前没有真实的用户操作，因此不定义点击、筛选、文章阅读、抓取、AI 分析或认证事件；这些事件只能在相应功能实际交付后，以新的提示词先定义目的、字段和保留边界。
- 禁用 `autocapture`，避免自动上传元素文本或未经审核的交互属性。禁用 Session Replay 与自动异常采集，避免捕获页面内容、错误消息或可能包含的未可信新闻文本。关闭匿名 person profile 创建，且不调用 `identify`、`alias`、`setPersonProperties` 或任何 Clerk 用户资料读取逻辑。
- 在 SDK 的发送前钩子中删除 URL 的查询参数与片段、来源页与可能的页面标题等高风险字段，只保留无查询字符串的路径。事件不添加文章标题、摘要、全文、来源 URL、用户 ID、邮箱、IP、Cookie、令牌或认证状态。
- 本次不修改 PostHog 控制台、Vercel 环境变量或生产部署。代码完成后，环境管理员需在目标环境中手动配置对应的公开变量。任何生产环境配置或实际生产事件发送，必须在当时获得针对目标环境的再次明确批准。

## 事件与数据边界

| 事件 | 用途 | 允许字段 | 禁止字段 | 保留边界 |
| --- | --- | --- | --- | --- |
| `$pageview` | 了解匿名页面到达量与页面路径 | 清理后的路径、SDK 自动生成的匿名会话技术字段 | 查询参数、片段、来源 URL、页面标题、文章内容、Clerk 信息、直接标识信息与所有凭证 | 遵循目标 PostHog 项目既有保留设置，本次不修改 |
| `$pageleave` | 了解匿名页面停留结束 | 与 `$pageview` 相同的清理后路径与匿名技术字段 | 与 `$pageview` 相同 | 遵循目标 PostHog 项目既有保留设置，本次不修改 |

## 预计变更的文件

- `package.json` 与 `package-lock.json`：增加并锁定 `posthog-js`。
- `instrumentation-client.ts`：实现受环境变量控制的客户端初始化、最小事件策略和属性净化。
- `.env.example`：增加不含真实值的 PostHog 公开变量模板，并保留现有服务所需变量的变量名与中文说明。
- `docs/setup/development-services.md`：补充开发环境的 PostHog 配置步骤、事件清单、数据边界、验证步骤和生产环境审批提示。
- 视 TypeScript API 的实际需要，新增一个很小的 `lib/posthog` 客户端辅助模块；只有在避免重复初始化或便于可测试的属性净化时才创建，不得形成新的服务端层。

## 实施要求

1. 安装当前稳定兼容版本的 `posthog-js`，不安装 PostHog 服务端 SDK、Session Replay 插件或无关依赖。
2. 初始化代码只运行于浏览器。不得把 `posthog-js` 导入服务端页面、Route Handler、Supabase 层或 Clerk 服务端模块。
3. 仅当 `NEXT_PUBLIC_POSTHOG_KEY` 是非空字符串时调用 `posthog.init`；`NEXT_PUBLIC_POSTHOG_HOST` 不存在时使用官方 US Cloud 采集端点作为代码默认值，但环境模板与文档必须要求显式填写以支持环境隔离。
4. `posthog.init` 至少设置：`capture_pageview`、`capture_pageleave`、`autocapture: false`、`disable_session_recording: true` 与禁止匿名 person profile 创建的配置。当前 SDK 没有 `capture_exceptions` 初始化字段，因此必须关闭远端 flags 请求，并用发送前事件白名单拒绝 `$exception`。使用当前 SDK 支持的准确配置名称，并在 TypeScript 中保持类型正确。
5. 通过 `before_send` 或当前 SDK 等效机制净化事件属性：解析 `$current_url` 后仅保留 `origin + pathname` 或仅保留 pathname，删除 `$referrer`、`$referring_domain`、`$pathname` 以外的 URL 衍生字段、`$title` 以及任意自定义正文。无法安全解析时丢弃该 URL 属性，不得原样发送。
6. 不调用 `identify`、`alias`、群组分析、Feature Flags、Remote Config、调查、热图、Session Replay 或错误追踪功能。
7. 不修改 `app/page.tsx` 的服务端认证保护。不得将 `isAuthenticated`、Clerk 用户 ID、会话 ID 或登录资料作为事件属性。
8. 初始化必须轻量，异常必须被隔离，SDK 加载或网络失败不可影响 Clerk 登录、页面渲染、导航或空状态展示。
9. 新增的 `.env.example` 只可包含变量名、空值或安全占位文本及中文注释。不能从截图、终端、浏览器或环境文件复制任何凭证。
10. 文档必须清楚说明：公开项目令牌仍不得写入受版本控制文件、聊天记录或日志；实际生产变量配置和实际生产事件收集要在执行时重新批准。

## 安全要求

- 不读取、输出、提交或截图记录 `.env.local` 的值、PostHog 项目令牌、Clerk 凭证、Supabase 凭证、Cookie 或访问令牌。
- 不请求或修改 PostHog、Vercel、Clerk、Supabase、Oxylabs 或 AI Provider 控制台。
- 不发起部署、数据库写入、新闻抓取、AI 分析或生产环境事件发送。
- 不发送新闻文章、文章分析、文章 URL、来源名称、搜索词、表单输入、用户 ID、邮箱或其他直接或可关联身份信息。
- 不将 PostHog 用作功能开关、业务状态、认证、授权、日志唯一事实来源或故障恢复机制。
- 若 SDK 选项无法同时满足禁用自动采集、回放与异常正文采集的要求，停止并报告差异，不以较宽松配置替代。

## 验收标准

1. 依赖清单包含 `posthog-js`，生产构建、TypeScript 检查和 ESLint 均通过。
2. 未设置 `NEXT_PUBLIC_POSTHOG_KEY` 时，首页与 Clerk 登录流程正常工作，浏览器不向 PostHog 发起请求。
3. 设置隔离开发项目的公开变量后，首次页面访问只产生允许的 `$pageview`，离开页面时只产生允许的 `$pageleave`；没有未批准的自定义事件。
4. 发送事件的 URL 不含查询参数、片段或来源页信息，事件属性中不存在文章内容、Clerk 用户资料、邮箱、Cookie、令牌、认证状态或服务端密钥。
5. PostHog 不启用自动点击采集、Session Replay、自动异常采集、匿名 person profile 创建或用户识别调用。
6. 初始化失败、SDK 被拦截或网络不可用时，页面仍可渲染、导航和登录，不泄露凭证或原始错误内容。
7. `.env.example` 与开发服务文档提供完整的开发配置说明，但不含任何真实密钥或令牌。
8. 未进行任何 PostHog 控制台、Vercel 控制台、生产环境或外部服务的写操作。

## 需运行的检查

1. `npm run lint`
2. `npm run build`
3. 在未设置 `NEXT_PUBLIC_POSTHOG_KEY` 的隔离终端启动 `npm run dev`，验证首页和登录流程。
4. 仅在用户明确批准隔离开发项目实际发送事件后，设置该开发项目的公开变量并启动 `npm run dev`，使用浏览器网络面板和 PostHog 活动流验证事件。
5. 对初始化辅助模块或发送前属性净化逻辑添加与风险相称的单元测试；如现有工程尚无测试运行器，记录该缺口，不为此单独引入大型测试栈。

## 实施后的精确手动测试步骤

1. 保持 `NEXT_PUBLIC_POSTHOG_KEY` 未设置，启动本地应用并访问首页。确认没有 PostHog 请求，未登录用户仍被 Clerk 引导至登录页。
2. 在获得开发环境实际事件发送批准后，仅在本机 `.env.local` 填入隔离开发 PostHog 项目的公开变量并重启开发服务器。不要把值复制到任何受版本控制文件或聊天内容。
3. 登录开发测试账号，访问首页，在网络面板筛选 PostHog 采集请求，确认只看到 `$pageview` 与对应的匿名技术字段。
4. 使用带有测试查询参数和片段的本地地址访问页面，检查采集载荷，确认 URL 中不含该查询参数或片段，也不含来源页 URL 和页面标题。
5. 离开页面或关闭标签页，确认只出现 `$pageleave`，且事件属性仍符合相同净化规则。
6. 检查 PostHog 活动流，确认没有用户识别、person profile、自动点击、Session Replay 或异常事件。
7. 在浏览器中阻止 PostHog 端点或模拟离线后刷新，确认首页、导航和 Clerk 登录都不受影响，控制台不出现凭证或原始事件属性。
8. 不配置 Vercel 或生产环境变量。若后续准备启用生产采集，先取得针对生产目标环境、事件策略和回滚路径的明确批准。

## 回滚路径

删除 `instrumentation-client.ts` 和可选的客户端辅助模块，移除 `posthog-js` 依赖及其锁文件条目，并从 `.env.example` 与开发文档删除 PostHog 配置说明即可恢复到无客户端观测状态。由于本提示词不允许改动 PostHog 控制台、Vercel、数据库或生产数据，回滚不涉及外部数据或权限恢复。

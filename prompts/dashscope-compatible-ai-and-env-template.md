# 接入 DashScope 兼容模式并修复环境变量模板

## 目标

让 SKEW 的 AI 服务端配置支持阿里云百炼 DashScope 的 OpenAI 兼容模式，并恢复可提交的 `.env.example` 模板。同步明确 Supabase Project URL 的获取位置和开发环境与生产环境的边界。本次只修改本地代码、模板和文档，不调用任何模型、不访问 Supabase 数据库、不执行 Oxylabs 请求，也不修改任何外部控制台。

## 已阅读的技能

- `.agents/skills/ai-sdk/SKILL.md`：要求以已安装 SDK 的文档和源码为准；`@ai-sdk/openai` 的 `createOpenAI` 支持显式 `baseURL`，可用于 OpenAI 兼容 Provider。
- `.agents/skills/supabase/SKILL.md`：确认浏览器只能使用 publishable key，数据库、RLS、迁移和数据查询均不得在未获批准时执行。
- `skills/check/SKILL.md`：用于运行静态检查、构建和无敏感值的环境变量完整性检查。
- `skills/sync/SKILL.md`：用于使长期规范和实际配置保持一致。

## 已检查的代码与配置

- `lib/ai/provider.ts`：当前调用 `createOpenAI({ apiKey })`，未设置 `baseURL`，因此只能请求 OpenAI 默认 API 地址。
- `lib/env/server.ts`：当前仅允许 `AI_PROVIDER=openai`，无法表示 DashScope 兼容模式。
- `.env.local`：仅检查变量是否填写，未读取或输出任何值。Clerk、Supabase publishable key、Oxylabs 已填写；`NEXT_PUBLIC_SUPABASE_URL`、`AI_MODEL` 和 `OPENAI_API_KEY` 为空。
- `.env.example`：先前因 `.gitignore` 的 `.env*` 规则没有被版本控制；本地文件现不存在，必须恢复模板并加入精确的忽略例外。
- Supabase 截图：项目 `main` 标记为 `PRODUCTION`，API Keys 页面仅显示 publishable key 与 secret key，不是 Project URL 页面。
- DashScope 截图：华北 2（北京）的 OpenAI 兼容 Base URL 为 `https://dashscope.aliyuncs.com/compatible-mode/v1`；API Key 与 Base URL 必须使用同一地域和计费方案。

## 决策与假设

- 使用现有 `@ai-sdk/openai` 的 `createOpenAI({ apiKey, baseURL })`，不新增 Provider 依赖。
- 明确区分 Provider：`AI_PROVIDER=openai` 使用默认 OpenAI 地址；`AI_PROVIDER=dashscope` 使用必填的 `AI_BASE_URL` 和 `DASHSCOPE_API_KEY`。不再让名称为 `OPENAI_API_KEY` 的变量承载 DashScope 凭证。
- DashScope 开发环境默认填入与截图匹配的北京兼容地址，但文档必须说明用户需要确认 API Key 与地域一致；如切换地域，只修改 `.env.local` 中的 `AI_BASE_URL`，不改代码。
- DashScope 模型名称由 `AI_MODEL` 指定。用户可在当前已开通的免费额度模型中选择，例如 `qwen3.7-plus` 或 `deepseek-v4-flash`，但本次不发出请求验证额度、模型可用性或费用。
- Supabase Project URL 的格式为 `https://<project-ref>.supabase.co`。截图中项目 ref 为 `hmlotiprxngkyvzfjivd`，因此其 URL 为 `https://hmlotiprxngkyvzfjivd.supabase.co`。该项目显示为生产环境，只有在用户明确批准“本地开发连接该生产项目”后，才可把它用于本地验证；推荐创建独立的 Supabase 开发项目。
- 不读取、输出、迁移、复制、提交或回显 `.env.local` 的实际值。

## 预计变更的文件

- `.gitignore`：仅添加 `!.env.example` 例外，使无敏感值模板可被提交，同时继续忽略 `.env.local`。
- `.env.example`：恢复并补充 `AI_PROVIDER`、`AI_BASE_URL`、`DASHSCOPE_API_KEY`、`AI_MODEL` 与 OpenAI 变量说明，所有值保持为空或非敏感默认值。
- `lib/env/server.ts`：验证 `openai` 与 `dashscope` 两种 Provider 的服务端变量，拒绝未知 Provider。
- `lib/ai/provider.ts`：按 Provider 创建模型，DashScope 分支传入 `baseURL`，不在模块导入时发送请求。
- `docs/setup/development-services.md`：补充 Supabase Project URL 位置、DashScope 变量填法、地域一致性和生产环境警告。
- `prompts/dashscope-compatible-ai-and-env-template.md`：保留本实施提示词。

## 实施要求

1. 在 `.gitignore` 的 `.env*` 规则下添加精确例外 `!.env.example`，不得放宽对 `.env.local` 的忽略。
2. 创建不含任何真实值的 `.env.example`。DashScope 使用：
   - `AI_PROVIDER=dashscope`
   - `AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1`
   - `DASHSCOPE_API_KEY=`
   - `AI_MODEL=`
3. 保留 OpenAI 分支的 `OPENAI_API_KEY`，但不要要求或读取它来使用 DashScope。
4. 在 `lib/env/server.ts` 以判别联合或等价的明确分支返回 Provider 配置。未知值、缺少 Key、缺少模型或 DashScope 缺少 Base URL 时只报变量名，不输出值。
5. 在 `lib/ai/provider.ts` 采用当前安装的 `@ai-sdk/openai` 文档中 `createOpenAI({ apiKey, baseURL })` 的方式。OpenAI 分支不设置 Base URL，DashScope 分支设置环境变量中的 Base URL。
6. 更新文档：Supabase 可从 Dashboard 的 `Connect` 按钮或 `Settings → General` 复制 Project URL；API Keys 页面只提供 key。明确截图所示项目为生产环境，推荐使用独立开发项目。
7. 不执行 `generateText`、`streamText`、Oxylabs 请求、Supabase 查询、Clerk 控制台操作、迁移、RLS 改动或任何外部服务写操作。

## 安全要求

- 不输出、复制、记录或提交 `.env.local` 中的真实值。
- 不把 `DASHSCOPE_API_KEY`、`OPENAI_API_KEY`、Supabase secret key、Clerk secret key 或 Oxylabs 密码标记为 `NEXT_PUBLIC_`。
- 未获得“本地开发连接截图所示生产 Supabase 项目”的明确批准前，不对该项目运行任何网络验证。
- 不把 DashScope Key 用于 OpenAI 默认 API 地址；必须同时配置对应的兼容 Base URL。
- 不执行会产生模型调用或费用的请求。

## 验收标准

- `.env.example` 会被 Git 识别，但 `.env.local` 仍被忽略。
- DashScope 与 OpenAI 两种配置均在代码中有清晰且互斥的服务端分支。
- DashScope 分支使用 `https://dashscope.aliyuncs.com/compatible-mode/v1` 或用户在本机指定的同区域兼容地址。
- 缺少关键变量时错误只包含变量名，不包含任何值。
- `npm run lint`、`npm run build` 和 `git diff --check` 通过。
- 不发生任何 Supabase、DashScope、OpenAI、Clerk 或 Oxylabs 外部调用。

## 需运行的检查

1. `git check-ignore -v .env.local`，确认本地密钥文件被忽略。
2. `git check-ignore -v .env.example`，确认模板不再被忽略。
3. 不打印值地检查 `.env.local` 的变量名和填写状态。
4. `npm run lint`。
5. `npm run build`。
6. `git diff --check`。

## 实施后的精确手动测试步骤

1. 将 `.env.example` 复制为 `.env.local`，保留已有变量值。
2. 如使用 DashScope，在 `.env.local` 填入 `AI_PROVIDER=dashscope`、北京兼容 Base URL、`DASHSCOPE_API_KEY` 和一个已开通的 `AI_MODEL`；不要填写 `OPENAI_API_KEY`。
3. 重新启动 `npm run dev`，确认 Clerk 登录界面正常显示；此操作不得触发模型调用。
4. 确认浏览器开发工具没有 DashScope、OpenAI、Supabase secret、Clerk secret 或 Oxylabs 密码。
5. 对 Supabase，优先填入独立开发项目的 Project URL 和 publishable key。若必须连接截图所示生产项目，先取得针对该环境的明确批准，并只进行不会写入的最小验证。

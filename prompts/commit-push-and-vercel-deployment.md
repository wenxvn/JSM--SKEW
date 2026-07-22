# 提交、推送与 Vercel 部署

## 目标

将当前 SKEW 项目的已验证改动提交到 Git，推送到 GitHub 远程仓库，并部署到用户指定的 Vercel 环境。部署后验证构建和部署 URL 的基础可达性，并记录实际外部操作结果。

## 已阅读的技能

- `skills/check/SKILL.md`：发布前运行静态检查和构建验证，记录无法验证的环境边界。
- `skills/sync/SKILL.md`：确认长期规范、项目级技能锁文件和实际代码改动保持一致。

## 已检查的代码与配置

- 当前分支为 `main`，最近提交为 `331d0ac Initial Next.js setup`。
- 远程仓库为 `origin`，地址为 `https://github.com/wenxvn/JSM--SKEW.git`。
- 当前改动包含项目级技能、服务集成代码、受保护路由、环境模板、中文提示词、中文配置文档和运行记录。
- `.env.local` 被 `.gitignore` 忽略，`.env.example` 通过精确例外允许提交。
- `npm run lint` 和 `npx tsc --noEmit` 已通过。此前生产构建曾在可用网络下通过，但也曾因 Google Fonts 临时网络失败而失败。
- 未发现现有 Vercel CLI、`vercel.json`、`.vercel/` 关联配置或部署 URL。

## 决策与假设

- 提交前再次检查 Git 状态、差异和敏感文件。只提交工作区中与 SKEW 相关的已核实文件，绝不提交 `.env.local`、密钥、Cookie、令牌或构建产物。
- 提交信息使用中文，准确反映“配置项目级技能与服务接入基础”。
- 推送前从 `origin/main` 读取最新状态。若远程出现新提交，不强制推送、不覆盖远程历史，先报告冲突或需要 rebase 的情况。
- Vercel 默认建议使用 Preview 部署，先验证环境变量与登录流程。只有用户明确选择 Production 时，才运行会更新生产域名的部署命令。
- Vercel 环境变量由用户在 Vercel Dashboard 手动配置，不通过聊天、Git、命令行参数或日志传递实际值。部署目标必须设置：
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `OXYLABS_USERNAME`
  - `OXYLABS_PASSWORD`
  - `AI_PROVIDER=dashscope`
  - `AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1`
  - `AI_MODEL`
  - `DASHSCOPE_API_KEY`
- `SUPABASE_SECRET_KEY` 和 `OPENAI_API_KEY` 当前不是部署所需变量，不在 Vercel 中设置。
- 使用 `npx vercel@latest` 在需要时临时调用 Vercel CLI，不把 CLI 写入项目依赖。首次运行可能需要用户在浏览器完成 Vercel 登录和项目链接。

## 预计变更的文件

- Git 索引和 `main` 分支：暂存、提交并推送已核实的项目文件。
- `.vercel/`：仅在 Vercel CLI 创建本地项目链接时生成；其中若包含本地项目元数据，应遵循 Vercel 默认忽略规则，不提交。
- `docs/changes/`：新增中文部署操作记录，包含时间、目标环境、操作者、影响、部署 URL 或 ID、结果、回滚路径和后续事项，不包含凭证。

## 实施要求

1. 运行 `git status --short`、`git diff --check`、敏感值扫描、`npm run lint` 与 `npm run build`。若构建仅因 Google Fonts 临时网络失败，记录该环境限制，并在 Vercel 构建日志中再次确认。
2. 使用 Git 跟踪规则确认 `.env.local`、`.next/` 和 `node_modules/` 不会被暂存；审阅将要提交的文件列表后才运行 `git add`。
3. 创建一个包含全部当前 SKEW 配置改动的提交。提交后记录 commit SHA。
4. 在推送前检查 `origin/main` 是否前进。远程前进时停止并报告，不使用 force push。
5. 推送当前 `main` 到 `origin/main`。不得改写远程历史。
6. 部署前确认用户已在 Vercel Dashboard 的目标环境配置了所有必需变量，并确认是 Preview 还是 Production。
7. 首次使用 Vercel 时通过 CLI 登录或链接项目。若 CLI 要求浏览器授权，暂停等待用户完成授权，不猜测团队、项目名或组织。
8. Preview 使用不带 `--prod` 的 Vercel 部署命令。Production 只能在用户明确选择后使用 `--prod`。
9. 记录部署 URL、部署 ID、环境和结果。以不登录方式访问部署 URL，只确认 HTTP 状态和 Clerk 登录页面可达，不查询 Supabase 表、不触发 Oxylabs 或模型调用。
10. 失败时不删除部署或项目。报告 Vercel 构建日志和可恢复下一步。

## 安全要求

- 不提交 `.env.local`、密钥、密码、Cookie、访问令牌、Supabase secret key、Clerk secret key、Oxylabs 密码或 DashScope API Key。
- 不向 GitHub Actions、Vercel CLI 输出、部署日志或聊天粘贴真实环境变量值。
- 未明确选择 Production 时，不运行 `vercel --prod`，不修改生产域名、不推广预览部署。
- 不使用 `git push --force`、不重写远程历史、不删除远程分支、Vercel 项目或部署。
- 不通过部署验证发起 Supabase 写入、真实抓取或模型请求。

## 验收标准

- `main` 的新提交仅包含 SKEW 项目代码、文档、提示词、技能和锁文件，不含任何敏感文件。
- 提交已安全推送到 `origin/main`，并能报告 commit SHA。
- Vercel 部署使用用户指定环境，环境变量已由用户在 Vercel Dashboard 配置。
- 可以报告 Vercel 部署 URL 和部署状态，或清楚说明阻塞原因。
- 部署记录采用中文，包含环境、时间、结果和回滚路径，不含凭证。

## 需运行的检查

1. `git diff --check`。
2. `npm run lint`。
3. `npm run build`。
4. `git status --short` 与 Git 暂存文件列表检查。
5. 推送后读取 `git rev-parse HEAD` 和 `git ls-remote origin refs/heads/main` 对照 SHA。
6. Vercel 部署日志与部署 URL 的只读 HTTP 状态检查。

## 实施后的精确手动测试步骤

1. 在 Vercel Dashboard 创建或选择 SKEW 项目，导入 GitHub 仓库，选择目标环境。
2. 在该环境的 Vercel Environment Variables 中逐项填写本机 `.env.local` 的必需变量，绝不粘贴到聊天。
3. 若首次使用 CLI，完成浏览器登录和项目链接。
4. 打开部署 URL，确认未登录用户进入 Clerk 登录流程，登录后显示 SKEW 首页。
5. 打开 Vercel Function Logs，确认没有泄漏密钥、Supabase 写入、Oxylabs 请求或 DashScope 模型调用。
6. 如部署为 Production，确认目标域名和 Vercel 环境均为预期生产项目；若发生问题，在 Vercel Dashboard 将流量回滚到上一部署，而不删除历史部署。

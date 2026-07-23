# 提交当前工作区并推送

## 目标

将当前 SKEW 工作区中已核实的改动创建为一个 Git 提交，并安全推送到 GitHub 远程仓库 `origin` 的 `main` 分支。此次操作不部署 Vercel，不执行 Supabase、Clerk、Oxylabs、AI 或 PostHog 的外部服务写入。

## 已阅读的技能

- `skills/check/SKILL.md`：在提交前验证差异基础质量和运行时检查的边界。
- `skills/document/SKILL.md`：根据实际变更保留中文变更记录，不虚构结果。
- `skills/sync/SKILL.md`：确认长期规范与已实现范围的同步责任，避免在本次仅提交任务中作无关维护。

## 已检查的代码与配置

- 当前分支为 `main`，最近提交为 `b6f2b4e docs: improve Supabase migration workflow`。
- 远程仓库为 `origin`，地址为 `https://github.com/wenxvn/JSM--SKEW.git`。
- 工作区改动覆盖首页与新闻详情预览界面、Supabase 数据访问层及迁移、预览图片、环境变量校验、设计规则、中文实施提示词和变更记录。
- `git diff --check` 已通过。
- `.env.local`、`.next/` 和 `node_modules/` 已由 `.gitignore` 忽略。
- 针对常见私钥、AWS 密钥、OpenAI 风格令牌和 JWT 的工作区扫描未发现匹配项。
- `image copy 2.png` 是未被运行时代码引用的视觉参考文件，`prompts/news-details-page-ui.md` 明确说明其只作设计参考。本次按“提交当前文件”的请求将其与其余未跟踪文件一并暂存。

## 决策与假设

- 将当前 `git status --short` 列出的全部已修改和未跟踪项目文件作为单个原子提交的候选范围。
- 提交前重新检查暂存列表和暂存差异，确认不包含受忽略的环境文件、构建产物或意外敏感信息。
- 提交信息准确概括新闻预览界面、详情页和 Supabase 数据层的当前改动。
- 推送前获取 `origin/main` 状态。若远程已前进，停止并报告，不使用强制推送、不改写远程历史。
- 推送只在当前本地 `main` 能快速前进到 `origin/main` 时执行。

## 预计变更的文件

- Git 索引：暂存当前工作区中全部已修改和未跟踪的项目文件。
- 本地 `main`：新增一个提交。
- GitHub `origin/main`：仅通过普通 `git push` 接收该提交。
- `prompts/commit-current-worktree.md`：本实施提示词会随本次提交保存。

## 实施要求

1. 再次运行 `git status --short`、`git diff --check` 和敏感模式扫描。
2. 审阅 `git add -A` 后的暂存文件清单与 `git diff --cached --check`，确认所有文件仍在预期范围内。
3. 运行与本次界面和数据层改动相称的静态检查，至少包括 `npm run lint` 和 `npx tsc --noEmit`；若失败，停止提交并报告。
4. 使用一个中文提交信息创建提交，提交后记录完整 SHA。
5. 获取远端 `origin/main`，比较本地与远端提交关系。若远端领先或分叉，停止并报告。
6. 使用普通 `git push origin main` 推送，不使用 `--force`、不删除分支、不修改远端仓库设置。
7. 推送后对照本地 `HEAD` 与 `git ls-remote origin refs/heads/main` 的 SHA，确认远端已指向新提交。

## 安全要求

- 不提交 `.env.local`、任何 `.env*` 私密文件、密钥、密码、Cookie、访问令牌或构建产物。
- 不在命令输出、提交信息、记录或聊天中显示凭证。
- 不执行 Supabase 写入、真实抓取、模型调用、认证配置变更或部署。
- 不使用强制推送、历史重写、分支删除或远端仓库设置变更。
- 若推送被远端保护规则、认证或非快进状态阻止，保留本地提交并报告可恢复的下一步。

## 验收标准

- 新提交只包含当前 SKEW 项目工作区的预期改动和本提示词，不含受忽略文件或敏感信息。
- `git diff --cached --check`、`npm run lint` 与 `npx tsc --noEmit` 均通过。
- 本地 `HEAD` 和 `origin/main` 引用同一新提交 SHA。
- 可以报告提交 SHA、推送目标和验证结果。

## 需运行的检查

1. `git status --short`。
2. `git diff --check` 与 `git diff --cached --check`。
3. 受版本控制候选文件的敏感模式扫描。
4. `npm run lint`。
5. `npx tsc --noEmit`。
6. `git rev-parse HEAD` 与 `git ls-remote origin refs/heads/main`。

## 实施后的精确手动测试步骤

1. 在 GitHub 仓库的 `main` 分支打开最新提交，确认提交标题与本次新闻预览、详情页和数据层改动相符。
2. 打开提交文件列表，确认未出现 `.env.local`、私密 `.env` 文件、`.next/` 或 `node_modules/`。
3. 确认 `prompts/commit-current-worktree.md`、中文变更记录、迁移文件和预览资源均可在提交中查看。
4. 如需部署或执行真实管道，另行确认目标环境与外部操作范围。

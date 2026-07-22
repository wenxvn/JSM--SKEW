# Vercel Production 部署记录

## 时间

2026 年 7 月 22 日，Asia/Shanghai。

## 环境与操作者

目标环境为 Vercel Production。操作者为 Codex，使用已登录的 `wenxvns-projects` 团队。

## 操作与影响

创建 Vercel 项目 `jsm-skew`，连接 GitHub 仓库 `wenxvn/JSM--SKEW`，并从 `main` 分支的提交 `ecb584691bc99b5c1c7bdabf93d92a1c1e342be5` 创建 Production 部署。未修改 Supabase、Clerk、Oxylabs 或 DashScope 的外部配置，也未读取或记录任何凭证。

## 结果

部署 ID 为 `dpl_5L3TooUajS4XFGarV7NsdqekFwp9`，Vercel 状态为 `Ready`。生产地址为 `https://jsm-skew.vercel.app`。

首次部署时，项目的 Vercel Production 环境变量列表为空。部署构建成功，但在用户将运行所需变量配置到 Vercel 前，无法确认首页与 Clerk 登录页可正常使用。本地执行环境对生产地址的无登录 HTTP 检查在 10 秒后超时，未读取业务数据。

## 环境变量配置后的重新部署

用户已在 Vercel Dashboard 为 Production 配置运行所需变量后，执行第二次 Production 部署。新部署 ID 为 `dpl_HyRn2YL7o4onAwbQZJhQsEc8Uu2f`，Vercel 状态为 `Ready`，并已将 `https://jsm-skew.vercel.app` 指向该部署。

仅核对了变量名称与目标环境，未读取或记录任何变量值。当前执行环境再次对正式域名进行无登录 HTTP 检查，连接在 10 秒后超时，未读取业务数据。因此页面功能仍需在用户的浏览器中完成登录和首页验收。

## 链接与运行 ID

- Vercel Inspect: `https://vercel.com/wenxvns-projects/jsm-skew/5L3TooUajS4XFGarV7NsdqekFwp9`
- Production: `https://jsm-skew.vercel.app`
- 最新 Vercel Inspect: `https://vercel.com/wenxvns-projects/jsm-skew/HyRn2YL7o4onAwbQZJhQsEc8Uu2f`

## 回滚路径

在 Vercel Dashboard 的 Deployments 页面将流量切换到上一个可用 Production 部署。不要删除当前部署，以保留构建与诊断记录。

## 后续事项

用户需在 Vercel Dashboard 的 Project Settings → Environment Variables 中为 Production 配置 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`、`CLERK_SECRET_KEY`、`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`、`OXYLABS_USERNAME`、`OXYLABS_PASSWORD`、`AI_PROVIDER`、`AI_BASE_URL`、`AI_MODEL` 和 `DASHSCOPE_API_KEY`。配置完成后，重新部署并在浏览器确认登录和首页。

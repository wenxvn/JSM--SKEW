import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <main className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950">
        <p className="text-sm font-medium text-zinc-500">SKEW</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          开发环境已准备就绪
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          已启用 Clerk 路由保护，并建立 Supabase、Oxylabs 与 OpenAI 的服务端接入边界。
        </p>
      </main>
    </div>
  );
}

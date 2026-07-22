function requirePublicEnvironmentVariable(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`缺少必需的公开环境变量：${name}`);
  }

  return value;
}

export function getPublicEnvironment() {
  return {
    clerkPublishableKey: requirePublicEnvironmentVariable(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    ),
    supabasePublishableKey: requirePublicEnvironmentVariable(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
    supabaseUrl: requirePublicEnvironmentVariable(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
  };
}

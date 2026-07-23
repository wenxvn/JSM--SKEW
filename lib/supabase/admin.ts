import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getPublicEnvironment } from "@/lib/env/public";
import { getSupabaseServerEnvironment } from "@/lib/env/server";

import type { Database } from "@/lib/supabase/types";

export function createSupabaseAdminClient() {
  const { supabasePublishableKey, supabaseUrl } = getPublicEnvironment();
  const { secretKey } = getSupabaseServerEnvironment();

  if (!supabaseUrl || !supabasePublishableKey || !secretKey) {
    throw new Error("Supabase 服务端环境变量未正确配置。");
  }

  return createClient<Database>(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getPublicEnvironment } from "@/lib/env/public";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { supabasePublishableKey, supabaseUrl } = getPublicEnvironment();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });
}

import { createBrowserClient } from "@supabase/ssr";

import { getPublicEnvironment } from "@/lib/env/public";

export function createSupabaseBrowserClient() {
  const { supabasePublishableKey, supabaseUrl } = getPublicEnvironment();

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}

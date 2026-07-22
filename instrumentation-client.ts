import posthog from "posthog-js";

import { sanitizePostHogEvent } from "@/lib/posthog/privacy";

const posthogProjectKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim();

if (posthogProjectKey && !posthog.__loaded) {
  try {
    posthog.init(posthogProjectKey, {
      advanced_disable_flags: true,
      autocapture: false,
      before_send: sanitizePostHogEvent,
      capture_pageleave: true,
      capture_pageview: "history_change",
      capture_performance: false,
      disable_capture_url_hashes: true,
      disable_session_recording: true,
      disable_surveys: true,
      disable_surveys_automatic_display: true,
      disable_web_experiments: true,
      enable_recording_console_log: false,
      error_tracking: { captureExtensionExceptions: false },
      person_profiles: "never",
      persistence: "memory",
      rageclick: false,
      save_campaign_params: false,
      save_referrer: false,
      api_host: posthogHost || "https://us.i.posthog.com",
    });
  } catch {
    // 浏览器观测不可影响应用启动、认证或页面渲染。
  }
}

import type { CaptureResult, Properties } from "posthog-js";

const ALLOWED_EVENT_NAMES = new Set(["$pageleave", "$pageview"]);

const ALLOWED_TECHNICAL_PROPERTY_NAMES = new Set([
  "$browser",
  "$browser_version",
  "$device_id",
  "$device_type",
  "$insert_id",
  "$language",
  "$lib",
  "$lib_version",
  "$os",
  "$screen_height",
  "$screen_width",
  "$session_id",
  "$time",
  "$timezone",
  "$timezone_offset",
  "$viewport_height",
  "$viewport_width",
  "$window_id",
  "distinct_id",
  "token",
]);

function getPathname(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  try {
    return new URL(value, "https://skew.invalid").pathname || "/";
  } catch {
    return undefined;
  }
}

function copyAllowedTechnicalProperties(properties: Properties) {
  const sanitized: Properties = {};

  for (const name of ALLOWED_TECHNICAL_PROPERTY_NAMES) {
    const value = properties[name];

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      sanitized[name] = value;
    }
  }

  return sanitized;
}

export function sanitizePostHogEvent(
  event: CaptureResult | null,
): CaptureResult | null {
  if (!event || !ALLOWED_EVENT_NAMES.has(event.event)) {
    return null;
  }

  const properties = copyAllowedTechnicalProperties(event.properties);
  const pathname = getPathname(event.properties.$current_url);

  if (pathname) {
    properties.$current_url = pathname;
    properties.$pathname = pathname;
  }

  return {
    ...event,
    properties,
    $set: undefined,
    $set_once: undefined,
    $unset: undefined,
  };
}

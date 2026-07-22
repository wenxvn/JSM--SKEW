import "server-only";

import { getOxylabsEnvironment } from "@/lib/env/server";

const realtimeEndpoint = "https://realtime.oxylabs.io/v1/queries";
const requestTimeoutMilliseconds = 180_000;

export type OxylabsRealtimeRequest = {
  parse?: boolean;
  render?: "html" | "png";
  source: string;
  url: string;
};

export class OxylabsRequestError extends Error {
  constructor(public readonly status: number) {
    super(`Oxylabs 请求失败，状态码：${status}`);
    this.name = "OxylabsRequestError";
  }
}

function validateRequest(request: OxylabsRealtimeRequest) {
  if (!request.source.trim()) {
    throw new Error("Oxylabs 请求必须包含 source。");
  }

  const articleUrl = new URL(request.url);

  if (articleUrl.protocol !== "http:" && articleUrl.protocol !== "https:") {
    throw new Error("Oxylabs 请求 URL 必须使用 HTTP 或 HTTPS 协议。");
  }
}

export async function requestOxylabsRealtime(
  request: OxylabsRealtimeRequest,
): Promise<unknown> {
  validateRequest(request);

  const { password, username } = getOxylabsEnvironment();
  const authorization = Buffer.from(`${username}:${password}`).toString("base64");
  const response = await fetch(realtimeEndpoint, {
    body: JSON.stringify(request),
    cache: "no-store",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    signal: AbortSignal.timeout(requestTimeoutMilliseconds),
  });

  if (!response.ok) {
    throw new OxylabsRequestError(response.status);
  }

  return response.json();
}

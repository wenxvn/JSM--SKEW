import "server-only";

import { createOpenAI } from "@ai-sdk/openai";

import { getAiEnvironment } from "@/lib/env/server";

export function createConfiguredOpenAiModel() {
  const environment = getAiEnvironment();
  const openai = createOpenAI({
    apiKey: environment.apiKey,
    ...(environment.provider === "dashscope"
      ? { baseURL: environment.baseUrl }
      : {}),
  });

  return openai(environment.model);
}

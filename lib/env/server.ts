import "server-only";

function requireServerEnvironmentVariable(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`缺少必需的服务端环境变量：${name}`);
  }

  return value;
}

export function getOxylabsEnvironment() {
  return {
    password: requireServerEnvironmentVariable(
      "OXYLABS_PASSWORD",
      process.env.OXYLABS_PASSWORD,
    ),
    username: requireServerEnvironmentVariable(
      "OXYLABS_USERNAME",
      process.env.OXYLABS_USERNAME,
    ),
  };
}

type AiEnvironment =
  | {
      apiKey: string;
      model: string;
      provider: "openai";
    }
  | {
      apiKey: string;
      baseUrl: string;
      model: string;
      provider: "dashscope";
    };

export function getAiEnvironment(): AiEnvironment {
  const provider = requireServerEnvironmentVariable(
    "AI_PROVIDER",
    process.env.AI_PROVIDER,
  );

  const model = requireServerEnvironmentVariable("AI_MODEL", process.env.AI_MODEL);

  if (provider === "openai") {
    return {
      apiKey: requireServerEnvironmentVariable(
        "OPENAI_API_KEY",
        process.env.OPENAI_API_KEY,
      ),
      model,
      provider,
    };
  }

  if (provider === "dashscope") {
    const baseUrl = requireServerEnvironmentVariable(
      "AI_BASE_URL",
      process.env.AI_BASE_URL,
    );

    try {
      new URL(baseUrl);
    } catch {
      throw new Error("AI_BASE_URL 必须是有效的 URL。");
    }

    return {
      apiKey: requireServerEnvironmentVariable(
        "DASHSCOPE_API_KEY",
        process.env.DASHSCOPE_API_KEY,
      ),
      baseUrl,
      model,
      provider,
    };
  }

  throw new Error("AI_PROVIDER 仅支持 openai 或 dashscope。");
}

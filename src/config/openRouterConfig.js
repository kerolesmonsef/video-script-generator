

export const OPENROUTER_CONFIG = {
  apiKey: "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", // Get from https://openrouter.ai/keys
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",
  defaultModel: "arcee-ai/trinity-large-preview:free", // Recommended for Arabic


  models: [
    { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (موصى به)" },
    { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
    { id: "google/gemini-pro", name: "Gemini Pro" },
    { id: "stepfun/step-3.5-flash:free", name: "stepfun/step-3.5-flash:free" },
    { id: "meta-llama/llama-3.3-70b-instruct:free", name: "meta-llama/llama-3.3-70b-instruct:free" },
    { id: "tngtech/deepseek-r1t2-chimera:free", name: "tngtech/deepseek-r1t2-chimera:free" },
    { id: "arcee-ai/trinity-large-preview:free", name: "arcee-ai/trinity-large-preview:free" },
  ]
};


export const isOpenRouterConfigured = OPENROUTER_CONFIG.apiKey !== "YOUR_OPENROUTER_API_KEY" &&
  OPENROUTER_CONFIG.apiKey.startsWith("sk-or-");

if (!isOpenRouterConfigured) {
  console.warn('⚠️ OpenRouter API key not configured. Please update src/config/openRouterConfig.js');
  console.warn('Get your API key from: https://openrouter.ai/keys');
  console.warn('See SETUP_INSTRUCTIONS.md for detailed setup guide.');
}


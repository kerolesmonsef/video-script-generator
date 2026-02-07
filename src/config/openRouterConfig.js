

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


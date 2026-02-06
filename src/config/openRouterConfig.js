

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
    { id: "nvidia/nemotron-3-nano-30b-a3b:free", name: "nvidia/nemotron-3-nano-30b-a3b:free" },
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


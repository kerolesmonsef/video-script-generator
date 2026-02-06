// OpenRouter API Configuration
// IMPORTANT: Replace YOUR_OPENROUTER_API_KEY with your actual API key from https://openrouter.ai/

export const OPENROUTER_CONFIG = {
  apiKey: "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", // Get from https://openrouter.ai/keys
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",
  defaultModel: "meta-llama/llama-3.3-70b-instruct:free", // Recommended for Arabic

  // Alternative models you can use:
  models: [
    { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (موصى به)" },
    { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
    { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    { id: "google/gemini-pro", name: "Gemini Pro" },
    { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
    { id: "stepfun/step-3.5-flash:free", name: "stepfun/step-3.5-flash:free" },
    { id: "meta-llama/llama-3.3-70b-instruct:free", name: "meta-llama/llama-3.3-70b-instruct:free" },
    { id: "nvidia/nemotron-3-nano-30b-a3b:free", name: "nvidia/nemotron-3-nano-30b-a3b:free" },
  ]
};

// Check if OpenRouter is configured
export const isOpenRouterConfigured = OPENROUTER_CONFIG.apiKey !== "YOUR_OPENROUTER_API_KEY" &&
                                      OPENROUTER_CONFIG.apiKey.startsWith("sk-or-");

if (!isOpenRouterConfigured) {
  console.warn('⚠️ OpenRouter API key not configured. Please update src/config/openRouterConfig.js');
  console.warn('Get your API key from: https://openrouter.ai/keys');
  console.warn('See SETUP_INSTRUCTIONS.md for detailed setup guide.');
}


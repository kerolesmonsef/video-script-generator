import {getConfig} from "../services/firebaseService";

export const OPENROUTER_CONFIG = {
  apiKey: null,
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",
  defaultModel: "arcee-ai/trinity-large-preview:free", 


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

(async () => {
    OPENROUTER_CONFIG.apiKey = await getConfig("openRouterToken");
  console.log(OPENROUTER_CONFIG);
})();


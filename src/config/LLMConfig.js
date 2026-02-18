import { getConfig } from "../services/firebaseService";

export const LLM_PROVIDERS = {
    OPENROUTER: 'openrouter',
    CHATANYWHERE: 'chatanywhere'
};

export const LLM_CONFIG = {
    defaultProvider: LLM_PROVIDERS.OPENROUTER,

    providers: {
        [LLM_PROVIDERS.OPENROUTER]: {
            name: "OpenRouter",
            apiUrl: "https://openrouter.ai/api/v1",
            apiKey: null,
            defaultModel: "arcee-ai/trinity-large-preview:free",
            models: [
                { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (موصى به)" },
                { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
                { id: "google/gemini-pro", name: "Gemini Pro" },
                { id: "stepfun/step-3.5-flash:free", name: "stepfun/step-3.5-flash:free" },
                { id: "meta-llama/llama-3.3-70b-instruct:free", name: "meta-llama/llama-3.3-70b-instruct:free" },
                { id: "tngtech/deepseek-r1t2-chimera:free", name: "tngtech/deepseek-r1t2-chimera:free" },
                { id: "arcee-ai/trinity-large-preview:free", name: "arcee-ai/trinity-large-preview:free" },
                { id: "gpt-5.2", name: "gpt-5.2" },
            ]
        },

        [LLM_PROVIDERS.CHATANYWHERE]: {
            name: "ChatAnywhere",
            apiUrl: "https://api.chatanywhere.tech/v1",
            apiKey: null,
            defaultModel: "gpt-4o-ca",
            models: [
                { id: "gpt-5-ca", name: "GPT-5 CA" },
                { id: "gpt-5-chat-latest-ca", name: "GPT-5 Chat Latest CA" },
                { id: "gpt-4.1-ca", name: "GPT-4.1 CA" },
                { id: "gpt-4.1-mini-ca", name: "GPT-4.1 Mini CA" },
                { id: "gpt-5.2-chat-latest-ca", name: "GPT-5.2 Chat Latest CA" },
                { id: "gpt-4o-ca", name: "GPT-4o CA" },
                { id: "gpt-4o-mini-ca", name: "GPT-4o Mini CA" },
                { id: "gpt-5.1-chat-latest-ca", name: "GPT-5.1 Chat Latest CA" },
                { id: "deepseek-v3.1-think-250821", name: "DeepSeek v3.1 Think 250821" },
                { id: "deepseek-v3.2", name: "DeepSeek v3.2" },
                { id: "deepseek-v3.2-thinking", name: "DeepSeek v3.2 Thinking" },
                { id: "deepseek-v3", name: "DeepSeek v3" },
                { id: "deepseek-r1", name: "DeepSeek R1" },
                { id: "deepseek-v3.1", name: "DeepSeek v3.1" },
                { id: "gpt-5.2-ca", name: "GPT-5.2 CA" },
                { id: "gpt-5-mini-ca", name: "GPT-5 Mini CA" },
                { id: "gpt-5-nano-ca", name: "GPT-5 Nano CA" },
                { id: "gpt-4o-mini-2024-07-18-ca", name: "GPT-4o Mini 2024-07-18 CA" },
                { id: "deepseek-r1-250528", name: "DeepSeek R1 250528" },
                { id: "gpt-4.1-nano-ca", name: "GPT-4.1 Nano CA" },
                { id: "text-embedding-3-large", name: "Text Embedding 3 Large" },
                { id: "text-embedding-3-small", name: "Text Embedding 3 Small" },
                { id: "text-embedding-ada-002", name: "Text Embedding Ada 002" },
                { id: "gpt-5.1-ca", name: "GPT-5.1 CA" },
            ]
        }
    }
};

(async () => {
    LLM_CONFIG.providers[LLM_PROVIDERS.OPENROUTER].apiKey = await getConfig("openRouterToken");
    LLM_CONFIG.providers[LLM_PROVIDERS.CHATANYWHERE].apiKey = await getConfig("chatanywhereToken");
})();

export const getProviderConfig = (provider = LLM_CONFIG.defaultProvider) => {
    return LLM_CONFIG.providers[provider];
};

export const getAllProviders = () => {
    return Object.entries(LLM_CONFIG.providers).map(([key, config]) => ({
        id: key,
        name: config.name
    }));
};

export const getModelsForProvider = (provider) => {
    return LLM_CONFIG.providers[provider]?.models || [];
};

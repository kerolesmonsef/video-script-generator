import OpenAI from 'openai';
import { LLM_CONFIG, LLM_PROVIDERS, getProviderConfig } from '../config/LLMConfig';
import { findValue, handleError } from "./helpers.js";
import { saveIdea } from './firebaseService';

// Create OpenAI client based on provider
export const getOpenAIClient = (provider = LLM_CONFIG.defaultProvider) => {
    const providerConfig = getProviderConfig(provider);

    return new OpenAI({
        apiKey: providerConfig.apiKey,
        baseURL: providerConfig.apiUrl,
        defaultHeaders: {
            "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : '',
            "X-Title": "Video Script Generator",
        },
        dangerouslyAllowBrowser: true
    });
};





export const generateAdviceScript = async (idea, numberOfScripts, provider = LLM_CONFIG.defaultProvider, model = null) => {
    try {
        if (!idea || idea.trim().length === 0) {
            throw new Error('الرجاء إدخال فكرة الفيديو');
        }

        if (numberOfScripts < 1 || numberOfScripts > 10) {
            throw new Error('عدد السكريبتات يجب أن يكون بين 1 و 10');
        }

        const providerConfig = getProviderConfig(provider);
        const selectedModel = model || providerConfig.defaultModel;

        const prompt = `You are a dual-role expert: A Viral Social Media Scriptwriter AND a Pixar-style Art Director.
Task: Generate ${numberOfScripts} unique video ideas based on the topic: "${idea}".

For each idea, you must provide two things:
1.  **The Video Script (in Egyptian Arabic):**
    * **Language:** Authentic Egyptian Slang (عامية مصرية).
    * **Content Strategy:** The script must be a SINGLE, punchy sentence. It must offer a direct "Golden Tip" OR a "Warning against a specific harm" related to the topic. No intros, no outros, just the core value.
    * **Voice Personality:** Define the specific vocal style suitable for the character (e.g., "Squeaky & Funny", "Deep & Wise", "Fast & Panic-stricken").

2.  **The Image Generation Prompt (in English):**
    * **Goal:** Generate a single, powerful, and visually captivating 3D masterpiece to serve as the main visual for a high-engagement social media video.
    * **Style:** High-end Pixar/Disney 3D animation style, rendered with Octane Render for ultra-photorealistic textures. Charming and appealing character-like appearance, 8k resolution, vibrant balanced colors, and cinematic high-fidelity detail.
    * **Subject:** A single, central, anthropomorphic inanimate object (جماد) with an incredibly expressive face. Featuring large, glossy, sparkling eyes and a charming mouth with a clear emotional expression. The object should have realistic material textures (glossy finish, subsurface scattering) making it look tangible and "alive".
    * **Environment:** A visually rich, cartoon-realistic environment related to the topic. Use dramatic cinematic lighting (strong key light, warm fill, distinct rim light) to create depth. Use a shallow depth of field (bokeh blur) to keep focus on the character.

Output must be in this exact JSON format:
{
  "scripts": [
    {
      "visualDescription": "Brief visual scene description for the editor (Arabic)",
      "voiceText": "The spoken script (Egyptian Arabic - 5s max)",
      "imagePrompt": "Detailed English prompt for Midjourney/DALL-E depicting a Pixar-style inanimate object related to the script.",
      "benefit": "One clear benefit of this tip (Arabic)",
      "drawback": "One potential risk if ignored (Arabic)"
    }
  ]
}
IMPORTANT: Ensure 'voiceText' is in EGYPTIAN ARABIC. Ensure 'imagePrompt' is in ENGLISH and strictly follows the Pixar 3D object style guidelines.`;

        console.log('🚀 Calling LLM API with provider:', provider, 'model:', selectedModel);


        const completion = await getOpenAIClient(provider).chat.completions.create({
            model: selectedModel,
            messages: [
                {
                    role: "system",
                    content: "You are a world-class Social Media Strategist. You write viral, human-like scripts in Arabic that feel natural and not robotic. You always output valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.9,
            max_tokens: 3000,
        });


        const aiResponse = completion.choices[0].message.content;
        console.log('✅ AI Response received');


        let parsedData;
        try {
            parsedData = JSON.parse(aiResponse);
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError);
            console.log('AI Response:', aiResponse);
            throw new Error('فشل في تحليل استجابة الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى.');
        }

        console.log('📦 Parsed data:', parsedData);


        let scripts = [];

        if (Array.isArray(parsedData)) {

            scripts = parsedData;
        } else if (parsedData.scripts && Array.isArray(parsedData.scripts)) {

            scripts = parsedData.scripts;
        } else if (parsedData.سيناريوهات && Array.isArray(parsedData.سيناريوهات)) {

            scripts = parsedData.سيناريوهات;
        } else {

            const keys = Object.keys(parsedData);
            for (const key of keys) {
                if (Array.isArray(parsedData[key])) {
                    scripts = parsedData[key];
                    console.log(`📋 Found scripts under key: "${key}"`);
                    break;
                }
            }
        }

        console.log('📋 Extracted scripts:', scripts);


        if (!Array.isArray(scripts) || scripts.length === 0) {
            console.error('❌ No scripts array found in response');
            throw new Error('لم يتم إنشاء سكريبتات صحيحة. الرجاء المحاولة مرة أخرى.');
        }

        const validScripts = scripts.map(script => {
            console.log('🔍 Raw script keys:', Object.keys(script));



            const normalized = {
                visualDescription: findValue(script, [
                    'visualDescription', 'visual_description', 'VisualDescription',
                    'description', 'Description', 'الوصف_البصري', 'وصف_بصري',
                    'الوصف', 'وصف', 'visual', 'الوصف البصري'
                ]),
                imagePrompt: findValue(script, [
                    'imagePrompt', 'image_prompt', 'ImagePrompt', 'prompt', 'Prompt',
                    'صورة_المولد', 'صورة_المحرك', 'موجه_الصورة', 'موجه_المولد',
                    'موجه_الصورة', 'موجه_المحرك'
                ]),
                voiceText: findValue(script, [
                    'voiceText', 'voice_text', 'VoiceText', 'voiceover', 'Voiceover',
                    'text', 'Text', 'النص_الصوتي', 'نص_صوتي', 'النص', 'نص',
                    'voice', 'التعليق_الصوتي', 'النص الصوتي', 'التعليق الصوتي'
                ]),
                benefit: findValue(script, [
                    'benefit', 'Benefit', 'benefits', 'Benefits', 'الفائدة',
                    'فائدة', 'الفوائد', 'فوائد', 'advantage', 'Advantage', 'pros'
                ]),
                drawback: findValue(script, [
                    'drawback', 'Drawback', 'drawbacks', 'Drawbacks', 'السلبية',
                    'سلبية', 'السلبيات', 'العيب', 'عيب', 'العيوب', 'عيوب',
                    'disadvantage', 'Disadvantage', 'cons', 'negative'
                ])
            };

            console.log('📝 Normalized script:', normalized);
            return normalized;
        }).filter(script =>
            script.visualDescription &&
            script.voiceText &&
            script.benefit &&
            script.drawback
        );

        console.log('✅ Valid scripts:', validScripts);

        if (validScripts.length === 0) {
            console.error('❌ Scripts missing required fields. Raw scripts:', scripts);
            throw new Error('السكريبتات المُنشأة غير كاملة. الرجاء المحاولة مرة أخرى.');
        }

        console.log(`✅ Successfully generated ${validScripts.length} scripts`);

        // Save to Firebase
        try {
            await saveIdea({
                collection: 'videoScripts',
                model: {
                    idea,
                    numberOfScripts,
                    scripts: validScripts,
                    provider,
                    model: selectedModel
                }
            });
            console.log('✅ Scripts saved to Firebase');
        } catch (error) {
            console.warn('⚠️ Failed to save scripts to Firebase:', error);
            // Don't throw error, just log it - we still want to return the scripts
        }

        return validScripts;

    } catch (error) {
        handleError(error);
    }
};

export const generateImagePrompts = async ({idea, provider , model , characterType} = {}) => {
    try {
        const providerConfig = getProviderConfig(provider);
        const selectedModel = model || providerConfig.defaultModel;

        const characterDescriptions = {
            'human': 'A single human character with expressive features, detailed facial expressions, realistic proportions, and natural human anatomy',
            'object_as_human': 'A single, central, anthropomorphic inanimate object related to the topic with an incredibly expressive face, large glossy sparkling eyes, a charming emotional expression, human-like arms and hands with detailed fingers, and standing upright on two legs in a natural human-like pose',
            'object': 'A simple inanimate object with no human-like limbs or body parts, featuring only cute expressive eyes and a charming mouth, maintaining its original object form and structure',
            'animal': 'A single adorable cartoon animal character with expressive large eyes, cute facial features, natural animal proportions but with Pixar-style charm, soft fur or skin texture with realistic detail, and an endearing personality conveyed through body language and expression'
        };
        const subjectDescription = characterDescriptions[characterType];

        const prompt = `You are a world-class Pixar-style Art Director and Prompt Engineer.
Task: Generate 1 unique image generation prompt based on the topic: "${idea}".

Strict Style Guidelines:
- Style: High-end Pixar/Disney 3D animation, rendered with Octane Render for ultra-photorealistic textures.
- Subject: ${subjectDescription}.
- Character Design: The character should have a cute, appealing cartoon appearance with smooth, rounded features typical of Pixar characters.
- Technicals: 8k resolution, vibrant balanced colors, cinematic high-fidelity detail, subsurface scattering, and dramatic cinematic lighting (key, fill, and rim light).
- Composition: Shallow depth of field (bokeh blur) to focus on the character in a visually rich environment.

Output MUST be in this exact JSON format:
{
  "image": {
    "conceptTitle": "Short title in Arabic",
    "imagePrompt": "Full detailed English prompt for Midjourney/DALL-E"
  }
}
No other fields (benefits, scripts, etc.) are allowed.`;

        console.log("image prompt",{imagePrompt: prompt});

        const completion = await getOpenAIClient(provider).chat.completions.create({
            model: selectedModel,
            messages: [
                {
                    role: "system",
                    content: "You are an AI specialized in high-end 3D character design prompts. You only output valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.8,
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);
        const image = aiResponse.image;

        try {
            await saveIdea({
                collection: 'imagePrompts',
                model: {
                    idea,
                    image,
                    characterType,
                    provider,
                    model: selectedModel
                }
            });
            console.log('✅ Image prompt saved to Firebase');
        } catch (error) {
            console.warn('⚠️ Failed to save image prompt to Firebase:', error);
        }

        return image;

    } catch (error) {
        console.error('❌ Error generating image prompts:', error);
        throw error;
    }
};



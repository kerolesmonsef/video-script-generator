import OpenAI from 'openai';
import {OPENROUTER_CONFIG, isOpenRouterConfigured} from '../config/openRouterConfig';

const openai = new OpenAI({
    apiKey: OPENROUTER_CONFIG.apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : '',
        "X-Title": "Video Script Generator",
    },
    dangerouslyAllowBrowser: true
});

const SCRIPT_SCHEMA = {
    openai: {
        type: "object",
        properties: {
            scripts: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "عنوان السيناريو باللغة العربية"
                        },
                        visualDescription: {
                            type: "string",
                            description: "وصف بصري مفصل للغاية باللغة العربية لمولد الفيديو بالذكاء الاصطناعي. يجب أن يكون مناسبًا لفيديو مدته 5 ثوانٍ بالضبط"
                        },
                        voiceText: {
                            type: "string",
                            description: "نص التعليق الصوتي باللغة العربية. يجب أن يكون قصيرًا جدًا ليناسب 5 ثوانٍ"
                        },
                        benefit: {
                            type: "string",
                            description: "فائدة رئيسية واحدة للموضوع باللغة العربية"
                        },
                        drawback: {
                            type: "string",
                            description: "سلبية رئيسية واحدة للموضوع باللغة العربية"
                        }
                    },
                    required: ["title", "visualDescription", "voiceText", "benefit", "drawback"]
                }
            }
        },
        required: ["scripts"],
        additionalProperties: false
    }
};

/**
 * Generate video scripts using OpenRouter API via OpenAI SDK
 * @param {string} idea - The video idea to generate scripts for
 * @param {number} numberOfScripts - Number of scripts to generate (1-10)
 * @param {string} model - The AI model to use (optional, uses default if not provided)
 * @returns {Promise<Array>} - Array of generated script objects
 */
export const generateScripts = async (idea, numberOfScripts, model = OPENROUTER_CONFIG.defaultModel) => {
    try {
        if (!idea || idea.trim().length === 0) {
            throw new Error('الرجاء إدخال فكرة الفيديو');
        }

        if (numberOfScripts < 1 || numberOfScripts > 10) {
            throw new Error('عدد السكريبتات يجب أن يكون بين 1 و 10');
        }

        if (!isOpenRouterConfigured) {
            throw new Error('⚠️ الرجاء تكوين مفتاح OpenRouter API في ملف openRouterConfig.js\n\nاتبع الخطوات في SETUP_INSTRUCTIONS.md');
        }


        const prompt = `You are a dual-role expert: A Viral Social Media Scriptwriter AND a Pixar-style Art Director.
Task: Generate ${numberOfScripts} unique video ideas based on the topic: "${idea}".

For each idea, you must provide two things:
1.  **The Video Script (in Arabic):**
    * **Duration:** 5-10 seconds max (Super Short).
    * **Tone:** Friendly, energetic, authentic "Spoken Arabic" (عامية/لهجة بيضاء).
    * **POV:** First-person ("I"), speaking directly to the camera.

2. The Image Generation Prompt (in English):
    * Goal: A single, powerful image prompt to generate the main visual for this video.
    * Style: Pixar/Disney 3D animation style. Cute, high-quality render, charming, cinematic lighting.
    * Subject: Focus on a single central inanimate object (جماد) related to the script topic, making it look appealing and character-like, without actual human characters if possible.
    * Environment / Background: Place the object in a cartoon-realistic, visually rich, and thematically relevant environment, explicitly avoiding plain, white, or studio backgrounds. The background should match the Pixar/Disney CGI style, include environmental depth and subtle props, use soft depth of field or slight blur, warm cinematic lighting, and balanced colors. The environment can be a kitchen, desk, street, natural setting, or any context related to the topic, enhancing the scene while keeping the object as the clear focal point.

Output must be in this exact JSON format:
{
  "scripts": [
    {
      "title": "Catchy Title (Arabic)",
      "visualDescription": "Brief visual scene description for the editor (Arabic)",
      "voiceText": "The spoken script (Spoken Arabic)",
      "imagePrompt": "Detailed English prompt for Midjourney/DALL-E depicting a Pixar-style inanimate object related to the script.",
      "benefit": "One clear benefit (Arabic)",
      "drawback": "One potential twist/drawback (Arabic)"
    }
  ]
}
IMPORTANT: Ensure 'voiceText' is in ARABIC. Ensure 'imagePrompt' is in ENGLISH and strictly follows the Pixar 3D object style guidelines.`;

        console.log('🚀 Calling OpenRouter API with model:', model);

        const supportsStructuredOutput = model.includes('gpt-4') || model.includes('gpt-3.5');

        const completion = await openai.chat.completions.create({
            model: model,
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
            response_format: supportsStructuredOutput
                ? {
                    type: "json_schema",
                    json_schema: {
                        name: "video_scripts_response",
                        schema: SCRIPT_SCHEMA.openai,
                        strict: true
                    }
                }
                : { type: "json_object" },
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

            const findValue = (obj, keys) => {
                for (const key of keys) {
                    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
                        return obj[key];
                    }
                }
                return '';
            };

            const normalized = {
                title: findValue(script, [
                    'title', 'Title', 'عنوان', 'العنوان', 'name', 'Name'
                ]),
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
            script.title &&
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
        return validScripts;

    } catch (error) {

        console.error('❌ Error generating scripts:', error);


        if (error.status) {
            if (error.status === 401) {
                throw new Error('مفتاح API غير صحيح. الرجاء التحقق من الإعدادات.');
            } else if (error.status === 429) {
                throw new Error('تم تجاوز الحد المسموح. الرجاء المحاولة لاحقاً.');
            } else if (error.status === 402) {
                throw new Error('رصيد API غير كافٍ. الرجاء إعادة الشحن على OpenRouter.');
            } else if (error.status === 400) {
                throw new Error('طلب غير صحيح. قد يكون النموذج المحدد غير متاح.');
            } else {
                throw new Error(`خطأ في API: ${error.status} - ${error.message || 'خطأ غير معروف'}`);
            }
        }


        if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
            throw new Error('خطأ في الاتصال بالإنترنت. الرجاء التحقق من اتصالك.');
        }


        if (error.message && error.message.includes('الرجاء')) {
            throw error;
        }


        throw new Error('حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.');
    }
};


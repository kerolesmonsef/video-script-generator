import OpenAI from 'openai';
import { LLM_CONFIG, LLM_PROVIDERS, getProviderConfig } from '../config/LLMConfig';
import { findValue, handleError } from "./helpers.js";
import { saveIdea } from './firebaseService';

// Create OpenAI client based on provider
const getOpenAIClient = (provider = LLM_CONFIG.defaultProvider) => {
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

const SCRIPT_SCHEMA = {
    type: "object",
    properties: {
        scripts: {
            type: "array",
            items: {
                type: "object",
                properties: {
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
                required: ["visualDescription", "voiceText", "benefit", "drawback"]
            }
        }
    },
    required: ["scripts"],
    additionalProperties: false
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

        const supportsStructuredOutput = selectedModel.includes('gpt-4') || selectedModel.includes('gpt-3.5');

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
            response_format: supportsStructuredOutput
                ? {
                    type: "json_schema",
                    json_schema: {
                        name: "video_scripts_response",
                        schema: SCRIPT_SCHEMA,
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

export const generateImagePrompts = async (idea, numberOfImages, provider = LLM_CONFIG.defaultProvider, model = null, characterType = 'human_object') => {
    try {
        const providerConfig = getProviderConfig(provider);
        const selectedModel = model || providerConfig.defaultModel;

        const characterDescriptions = {
            'human': 'A single human character with expressive features, detailed facial expressions, realistic proportions, and natural human anatomy',
            'object_as_human': 'A single, central, anthropomorphic inanimate object related to the topic with an incredibly expressive face, large glossy sparkling eyes, a charming emotional expression, human-like arms and hands with detailed fingers, and standing upright on two legs in a natural human-like pose',
            'object': 'A simple inanimate object with no human-like limbs or body parts, featuring only cute expressive eyes and a charming mouth, maintaining its original object form and structure'
        };
        const subjectDescription = characterDescriptions[characterType];

        const prompt = `You are a world-class Pixar-style Art Director and Prompt Engineer.
Task: Generate ${numberOfImages} unique image generation prompts based on the topic: "${idea}".

Strict Style Guidelines:
- Style: High-end Pixar/Disney 3D animation, rendered with Octane Render for ultra-photorealistic textures.
- Subject: ${subjectDescription}.
- Character Design: The object should have a cute, appealing cartoon appearance with smooth, rounded features typical of Pixar characters, while maintaining clear human-like limbs and posture.
- Technicals: 8k resolution, vibrant balanced colors, cinematic high-fidelity detail, subsurface scattering, and dramatic cinematic lighting (key, fill, and rim light).
- Composition: Shallow depth of field (bokeh blur) to focus on the character in a visually rich environment.

Output MUST be in this exact JSON format:
{
  "images": [
    {
      "conceptTitle": "Short title in Arabic",
      "imagePrompt": "Full detailed English prompt for Midjourney/DALL-E"
    }
  ]
}
No other fields (benefits, scripts, etc.) are allowed.`;

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
        const images = aiResponse.images;

        // Save to Firebase
        try {
            await saveIdea({
                collection: 'imagePrompts',
                model: {
                    idea,
                    numberOfImages,
                    images,
                    provider,
                    model: selectedModel
                }
            });
            console.log('✅ Image prompts saved to Firebase');
        } catch (error) {
            console.warn('⚠️ Failed to save image prompts to Firebase:', error);
        }

        return images;

    } catch (error) {
        console.error('❌ Error generating image prompts:', error);
        throw error;
    }
};

export const generateVideoStory = async (idea, numberOfScenes, provider = LLM_CONFIG.defaultProvider, model = null) => {
    try {
        const providerConfig = getProviderConfig(provider);
        const selectedModel = model || providerConfig.defaultModel;

        const prompt = `You are an expert storyteller and scriptwriter specializing in creating engaging video narratives in authentic Egyptian dialect.

Task: Create a complete, cohesive video story based on the topic: "${idea}".

**CRITICAL: ALL TEXT MUST BE IN AUTHENTIC EGYPTIAN DIALECT (اللهجة المصرية العامية)**

Requirements:

1. **Characters:**
   - Create a cast of characters needed for this story
   - Each character must have:
     * Name (the name of the character )
     * Description (physical appearance, personality - in arabic dialect)
     * Role in the story (their purpose/function - in Egyptian dialect)
     * **characterImagePrompt**: A SIMPLE English prompt to generate the character's image (5-10 words max)
       Example: "A picture of a cute little strawberry standing up"
       
2. **ENVIRONMENTS (2-4 Locations):**
   - Create distinct locations that serve as the primary settings for the scenes.
   - Each environment must be directly linked to the story's events.
   - Requirement: Ensure the 'environmentPrompt' captures the specific Pixar-style 3D aesthetic (8k, cinematic) for consistent backgrounds.
   
3. **Scenes:**
   - Each scene MUST be exactly 5 seconds long
   - Each scene should contain 10-15 words maximum (to fit naturally in 5 seconds when spoken)
   - All scenes together form ONE complete, cohesive story
   - Each scene must include:
     * Characters involved in this scene
     * Visual description (what we see on screen - in Egyptian dialect)
     * Dialogue/narration (what is spoken - in Egyptian dialect - عامية مصرية)
     * **sceneImagePrompt**: A SIMPLE English prompt describing the scene composition (10-15 words max)
     * **grokPrompt**: A DETAILED English description of the action, movement, emotions, AND voice delivery style of each speaking character (20-40 words). 
       The voice description must be expressive and cinematic (e.g., low trembling voice, confident energetic tone, sarcastic relaxed delivery, breathless whisper, etc.) 
       Dialogue: [الحوار بالعربي المصري من حقل dialogue]

Story Guidelines:
- Make the story engaging and attractive
- Each scene should be independent enough to stand alone visually
- But all scenes must connect to tell one complete narrative arc
- Use vivid visual descriptions
- Make characters memorable and relatable
- Use natural Egyptian Arabic slang and expressions

Output must be in this exact JSON format:
{
  "characters": [
    {
      "name": "Name (Egyptian Arabic)",
      "description": "Visual description in Arabic (Focus on: Clothes, Color, Size, Unique features). E.g., 'قطة بيضا صغيرة لابسة فيونكة حمراء'",
      "role": "Role (Egyptian Arabic)",
      "characterImagePrompt": "Detailed English visual prompt (5-20 words). MUST include: Species/Type, Main Color, Clothing/Accessories, Size/Height, Texture. Example: 'A tiny white fluffy kitten wearing a red bow tie, big blue eyes, soft lighting, 3D render'"
   }
  ],
  "environments": [
    {
      "id": "env_001",
      "name": "Location Name (Egyptian Arabic)",
      "description": "Brief description (Egyptian Arabic)",
      "mood": "Atmosphere (e.g., حيوي, هادئ)",
      "lightingType": "Lighting type (e.g., إضاءة صباحية, غروب)",
      "environmentPrompt": "Detailed English prompt (30-40 words) for background ONLY. Keywords: Pixar-style 3D, 8k, cinematic lighting, photorealistic textures, soft bokeh, vibrant colors. NO CHARACTERS."
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "characters": ["Name1"],
      "visualDescription": "Visual description (Egyptian Arabic)",
      "dialogue": "الحوار المنطوق - 10-15 كلمة كحد أقصى (باللهجة المصرية العامية)",
      "sceneImagePrompt": "صورة [وصف المشهد بالعامية - 10-15 كلمة - يشمل كل الشخصيات والمكان]",
      "grokPrompt": "Action description using VISUAL TRAITS from 'characterImagePrompt' (NEVER use names). E.g., 'The tiny white kitten jumps...', NOT 'Mimi jumps'. End with: Dialogue: [Arabic Dialogue]"
    }
  ]
}

IMPORTANT: 
- ALL Arabic TEXT must be in EGYPTIAN DIALECT (اللهجة المصرية العامية)
- 'dialogue' must fit in 5 seconds (10-15 words max)
- 'characterImagePrompt' must be SIMPLE and SHORT (5-10 words in Egyptian Arabic)
- 'sceneImagePrompt' must be SIMPLE and include all characters in scene (10-15 words in Egyptian Arabic)
- 'grokPrompt' must include detailed voice style description in English (no emojis)
- All scenes together must form ONE complete story
- Generate exactly ${numberOfScenes} scenes
- Use natural Egyptian expressions like: يلّا، طب، ماشي، يا سلام، ازيك, etc.`;

        console.log({prompt})
        console.log('🚀 Calling LLM API with provider:', provider, 'model:', selectedModel);

        const completion = await getOpenAIClient(provider).chat.completions.create({
            model: selectedModel,
            messages: [
                {
                    role: "system",
                    content: "You are a master storyteller and scriptwriter. You create engaging, cohesive stories with memorable characters in authentic Egyptian dialect (اللهجة المصرية العامية). You always output valid JSON with all required fields including characterImagePrompt, sceneImagePrompt, and grokPrompt."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.8,
            max_tokens: 6000,
        });

        const aiResponse = completion.choices[0].message.content;
        console.log('✅ AI Response received');
        console.log("✅ AI completion:", completion);
        console.log("✅ AI message content:", completion.choices[0].message);
        console.log("✅ AI Response:", aiResponse);

        let parsedData;
        try {
            parsedData = JSON.parse(aiResponse);
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError);
            console.log('AI Response:', aiResponse);
            throw new Error('فشل في تحليل استجابة الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى.');
        }

        console.log('📦 Parsed data:', parsedData);


        let characters = findValue(parsedData, [
            'characters', 'Characters', 'الشخصيات', 'شخصيات', 'cast', 'Cast'
        ]) || [];

        let environments = findValue(parsedData, [
            'environments', 'Environments', 'البيئات', 'بيئات', 'locations', 'Locations', 'الأماكن', 'أماكن'
        ]) || [];

        let scenes = findValue(parsedData, [
            'scenes', 'Scenes', 'المشاهد', 'مشاهد', 'story', 'Story'
        ]) || [];

        if (!Array.isArray(characters) || characters.length === 0) {
            console.error('❌ No characters found in response');
            throw new Error('لم يتم إنشاء الشخصيات. الرجاء المحاولة مرة أخرى.');
        }

        if (!Array.isArray(environments)) {
            console.warn('⚠️ Environments is not an array, setting to empty array');
            environments = [];
        }

        if (!Array.isArray(scenes) || scenes.length === 0) {
            console.error('❌ No scenes found in response');
            throw new Error('لم يتم إنشاء المشاهد. الرجاء المحاولة مرة أخرى.');
        }

        const validCharacters = characters.map(char => {
            return {
                name: findValue(char, ['name', 'Name', 'الاسم', 'اسم']) || '',
                description: findValue(char, ['description', 'Description', 'الوصف', 'وصف']) || '',
                role: findValue(char, ['role', 'Role', 'الدور', 'دور']) || '',
                characterImagePrompt: findValue(char, [
                    'characterImagePrompt',
                    'character_image_prompt',
                    'CharacterImagePrompt',
                    'imagePrompt',
                    'image_prompt',
                    'promptالصورة',
                    'برومبت_الصورة'
                ]) || ''
            };
        });

        const validEnvironments = environments.map(env => {
            return {
                id: findValue(env, ['id', 'Id', 'ID', 'المعرف', 'معرف']) || '',
                name: findValue(env, ['name', 'Name', 'الاسم', 'اسم']) || '',
                description: findValue(env, ['description', 'Description', 'الوصف', 'وصف']) || '',
                mood: findValue(env, ['mood', 'Mood', 'atmosphere', 'Atmosphere', 'المزاج', 'مزاج']) || '',
                lightingType: findValue(env, ['lightingType', 'lighting_type', 'LightingType', 'lighting', 'نوع_الإضاءة', 'إضاءة']) || '',
                environmentPrompt: findValue(env, [
                    'environmentPrompt',
                    'environment_prompt',
                    'EnvironmentPrompt',
                    'prompt',
                    'برومبت_البيئة',
                    'برومبت_المكان'
                ]) || ''
            };
        });

        const validScenes = scenes.map(scene => {
            return {
                sceneNumber: findValue(scene, ['sceneNumber', 'scene_number', 'SceneNumber', 'number', 'رقم_المشهد', 'رقم']) || 0,
                characters: findValue(scene, ['characters', 'Characters', 'الشخصيات', 'شخصيات']) || [],
                visualDescription: findValue(scene, ['visualDescription', 'visual_description', 'VisualDescription', 'visual', 'الوصف_البصري', 'وصف_بصري']) || '',
                dialogue: findValue(scene, ['dialogue', 'Dialogue', 'text', 'الحوار', 'حوار', 'النص']) || '',
                sceneImagePrompt: findValue(scene, [
                    'sceneImagePrompt',
                    'scene_image_prompt',
                    'SceneImagePrompt',
                    'imagePrompt',
                    'image_prompt',
                    'promptالصورة',
                    'برومبت_المشهد'
                ]) || '',
                grokPrompt: findValue(scene, [
                    'grokPrompt',
                    'grok_prompt',
                    'GrokPrompt',
                    'videoPrompt',
                    'video_prompt',
                    'actionDescription',
                    'action_description'
                ]) || ''
            };
        });

        console.log(`✅ Successfully generated ${validCharacters.length} characters, ${validEnvironments.length} environments, and ${validScenes.length} scenes`);

        try {
            await saveIdea({
                collection: 'videoStories',
                model: {
                    characters,
                    environments,
                    scenes,
                    provider,
                    model: selectedModel
                }
            });
            console.log('✅ Video story saved to Firebase');
        } catch (error) {
            console.warn('⚠️ Failed to save video story to Firebase:', error);
        }

        return {
            characters: validCharacters,
            environments: validEnvironments,
            scenes: validScenes
        };

    } catch (error) {
        handleError(error);
    }
};

import OpenAI from 'openai';
import {LLM_CONFIG, getProviderConfig} from '../../config/LLMConfig';
import {findValue, handleError} from "../helpers.js";
import {saveIdea} from '../firebaseService';
import {getOpenAIClient} from '../LLMService.js';


export const videoStoryPrompt = (idea, numberOfScenes) => {
    return `You are an expert storyteller and scriptwriter specializing in creating engaging video narratives in authentic Egyptian dialect.

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
};


export const generateVideoStory = async (idea, numberOfScenes, provider = LLM_CONFIG.defaultProvider, model = null) => {
    try {
        const providerConfig = getProviderConfig(provider);
        const selectedModel = model || providerConfig.defaultModel;

        const prompt = videoStoryPrompt(idea, numberOfScenes);

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
            response_format: {type: "json_object"},
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


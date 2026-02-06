// OpenRouter Service - Handles AI script generation
import axios from 'axios';
import { OPENROUTER_CONFIG, isOpenRouterConfigured } from '../config/openRouterConfig';

/**
 * Generate video scripts using OpenRouter API
 * @param {string} idea - The video idea to generate scripts for
 * @param {number} numberOfScripts - Number of scripts to generate (1-10)
 * @param {string} model - The AI model to use (optional, uses default if not provided)
 * @returns {Promise<Array>} - Array of generated script objects
 */
export const generateScripts = async (idea, numberOfScripts, model = OPENROUTER_CONFIG.defaultModel) => {
  try {
    // Validate inputs
    if (!idea || idea.trim().length === 0) {
      throw new Error('الرجاء إدخال فكرة الفيديو');
    }

    if (numberOfScripts < 1 || numberOfScripts > 10) {
      throw new Error('عدد السكريبتات يجب أن يكون بين 1 و 10');
    }

    // Check if API key is configured
    if (!isOpenRouterConfigured) {
      throw new Error('⚠️ الرجاء تكوين مفتاح OpenRouter API في ملف openRouterConfig.js\n\nاتبع الخطوات في SETUP_INSTRUCTIONS.md');
    }

    // Create the prompt for the AI
    const prompt = `أنت مولد سيناريوهات احترافي لمقاطع فيديو قصيرة (5 ثوانٍ فقط) ليوتيوب شورتس وتيك توك.

المهمة: إنشاء ${numberOfScripts} سيناريو مختلف تماماً بناءً على الفكرة: '${idea}'

اختر ${numberOfScripts} أمثلة عشوائية مختلفة. كل سيناريو يجب أن يحتوي على:
1. العنوان (بالعربية)
2. الوصف المرئي التفصيلي للذكاء الاصطناعي (بالعربية) - مناسب لـ 5 ثوانٍ
3. النص الصوتي (بالعربية) - قصير جداً لـ 5 ثوانٍ
4. فائدة واحدة (بالعربية)
5. عيب واحد (بالعربية)

أرجع النتائج بصيغة JSON فقط بدون أي نص إضافي:
{
  "scripts": [
    {
      "title": "...",
      "visualDescription": "...",
      "voiceText": "...",
      "benefit": "...",
      "drawback": "..."
    }
  ]
}`;

    console.log('Calling OpenRouter API with model:', model);

    // Make API request to OpenRouter
    const response = await axios.post(
      OPENROUTER_CONFIG.apiUrl,
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 3000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Video Script Generator'
        }
      }
    );

    // Extract the AI response
    const aiResponse = response.data.choices[0].message.content;
    console.log('AI Response received');

    // Parse the JSON response
    let parsedData;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      parsedData = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('AI Response:', aiResponse);
      throw new Error('فشل في تحليل استجابة الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى.');
    }

    // Extract scripts array
    const scripts = parsedData.scripts || parsedData;

    // Validate the response
    if (!Array.isArray(scripts) || scripts.length === 0) {
      throw new Error('لم يتم إنشاء سكريبتات صحيحة. الرجاء المحاولة مرة أخرى.');
    }

    // Validate each script has required fields
    const validScripts = scripts.filter(script =>
      script.title &&
      script.visualDescription &&
      script.voiceText &&
      script.benefit &&
      script.drawback
    );

    if (validScripts.length === 0) {
      throw new Error('السكريبتات المُنشأة غير كاملة. الرجاء المحاولة مرة أخرى.');
    }

    console.log(`Successfully generated ${validScripts.length} scripts`);
    return validScripts;

  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // API returned an error response
      console.error('OpenRouter API Error:', error.response.data);

      if (error.response.status === 401) {
        throw new Error('مفتاح API غير صحيح. الرجاء التحقق من الإعدادات.');
      } else if (error.response.status === 429) {
        throw new Error('تم تجاوز الحد المسموح. الرجاء المحاولة لاحقاً.');
      } else if (error.response.status === 402) {
        throw new Error('رصيد API غير كافٍ. الرجاء إعادة الشحن.');
      } else {
        throw new Error(`خطأ في API: ${error.response.status} - ${error.response.statusText}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
      throw new Error('خطأ في الاتصال. الرجاء التحقق من الإنترنت.');
    } else if (error.message) {
      // Error already has a message
      throw error;
    } else {
      // Unknown error
      console.error('Unknown Error:', error);
      throw new Error('حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.');
    }
  }
};


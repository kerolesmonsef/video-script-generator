// ScriptGenerator Component - Input form for generating scripts
import React, { useState } from 'react';
import { FaMagic, FaLightbulb, FaHashtag, FaRobot } from 'react-icons/fa';
import { generateScripts } from '../services/openRouterService';
import { OPENROUTER_CONFIG } from '../config/openRouterConfig';
import './ScriptGenerator.css';

const ScriptGenerator = ({ onScriptsGenerated }) => {
  const [idea, setIdea] = useState('');
  const [numberOfScripts, setNumberOfScripts] = useState(3);
  const [selectedModel, setSelectedModel] = useState(OPENROUTER_CONFIG.defaultModel);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!idea.trim()) {
      setError('الرجاء إدخال فكرة الفيديو');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call OpenRouter API to generate scripts
      const generatedScripts = await generateScripts(idea, numberOfScripts, selectedModel);

      // Pass the generated scripts to parent component
      onScriptsGenerated(generatedScripts, idea, numberOfScripts, selectedModel);

    } catch (err) {
      console.error('Error generating scripts:', err);
      setError(err.message || 'حدث خطأ أثناء إنشاء السكريبتات');
    } finally {
      setLoading(false);
    }
  };

  // Handle number input change
  const handleNumberChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setNumberOfScripts(Math.min(10, Math.max(1, value)));
  };

  return (
    <div className="script-generator">
      <div className="generator-header">
        <h1>🎬 مولد سكريبتات الفيديو</h1>
        <p>إنشاء سكريبتات فيديو احترافية بالذكاء الاصطناعي</p>
      </div>

      <form onSubmit={handleSubmit} className="generator-form">
        {/* Video Idea Input */}
        <div className="form-group">
          <label htmlFor="idea">
            <FaLightbulb /> فكرة الفيديو
          </label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="مثال: فيديو عن الفواكه تتحدث وتعطي فوائد وأضرار تناولها"
            rows="4"
            disabled={loading}
            required
          />
        </div>

        <div className="form-row">
          {/* Number of Scripts Input */}
          <div className="form-group">
            <label htmlFor="numberOfScripts">
              <FaHashtag /> عدد السكريبتات
            </label>
            <input
              type="number"
              id="numberOfScripts"
              value={numberOfScripts}
              onChange={handleNumberChange}
              min="1"
              max="10"
              disabled={loading}
              required
            />
            <small>من 1 إلى 10 سكريبتات</small>
          </div>

          {/* AI Model Selector */}
          <div className="form-group">
            <label htmlFor="model">
              <FaRobot /> نموذج الذكاء الاصطناعي
            </label>
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={loading}
            >
              {OPENROUTER_CONFIG.models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <small>اختر النموذج المناسب</small>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="generate-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              جاري الإنشاء...
            </>
          ) : (
            <>
              <FaMagic /> إنشاء السكريبتات
            </>
          )}
        </button>
      </form>

      {/* Usage Tips */}
      {!loading && (
        <div className="usage-tips">
          <h4>💡 نصائح للحصول على أفضل النتائج:</h4>
          <ul>
            <li>كن محدداً في وصف فكرة الفيديو</li>
            <li>استخدم Claude 3.5 Sonnet للحصول على أفضل النتائج بالعربية</li>
            <li>ابدأ بـ 2-3 سكريبتات للتجربة</li>
            <li>راجع السكريبتات المُنشأة وعدّل عليها حسب الحاجة</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScriptGenerator;


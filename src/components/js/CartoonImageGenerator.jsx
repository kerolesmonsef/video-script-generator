import React, { useState } from 'react';
import { FaMagic, FaLightbulb, FaHashtag, FaRobot } from 'react-icons/fa';
import { generateImagePrompts } from '../../services/openRouterService.js';
import { OPENROUTER_CONFIG } from '../../config/openRouterConfig.js';
import '../css/CartoonImageGenerator.scss';
import ModelSelector from "./ModelSelector.jsx";

const CartoonImageGenerator = ({ onImagesGenerated }) => {
    const [idea, setIdea] = useState('');
    const [numberOfImages, setNumberOfImages] = useState(1);
    const [selectedModel, setSelectedModel] = useState(OPENROUTER_CONFIG.defaultModel);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idea.trim()) {
            setError('الرجاء إدخال فكرة الصورة');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const generatedImages = await generateImagePrompts(idea, numberOfImages, selectedModel);

            onImagesGenerated(generatedImages, idea, numberOfImages, selectedModel);

        } catch (err) {
            console.error('Error generating image prompts:', err);
            setError(err.message || 'حدث خطأ أثناء إنشاء البرومبتات');
        } finally {
            setLoading(false);
        }
    };

    const handleNumberChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setNumberOfImages(Math.min(10, Math.max(1, value)));
    };

    return (
        <div className="cartoon-image-generator">
            <div className="generator-header">
                <h1>🎨 مولد صور الكرتون</h1>
                <p>إنشاء برومبتات صور كرتونية احترافية بالذكاء الاصطناعي</p>
            </div>

            <form onSubmit={handleSubmit} className="generator-form">
                <div className="form-group">
                    <label htmlFor="idea">
                        <FaLightbulb /> فكرة الصورة
                    </label>
                    <textarea
                        id="idea"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="مثال: فواكه كرتونية بوجوه معبرة وعيون لامعة"
                        rows="4"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="numberOfImages">
                            <FaHashtag /> عدد الصور
                        </label>
                        <input
                            type="number"
                            id="numberOfImages"
                            value={numberOfImages}
                            onChange={handleNumberChange}
                            min="1"
                            max="10"
                            disabled={loading}
                            required
                        />
                        <small>من 1 إلى 10 صور</small>
                    </div>

                    <ModelSelector
                        selectedModel={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        disabled={loading}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}

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
                            <FaMagic /> إنشاء البرومبتات
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CartoonImageGenerator;

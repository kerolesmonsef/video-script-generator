import React, { useState } from 'react';
import { FaMagic, FaLightbulb, FaHashtag } from 'react-icons/fa';
import { generateImagePrompts } from '../../services/openRouterService.js';
import { OPENROUTER_CONFIG } from '../../config/openRouterConfig.js';
import '../css/CartoonImageGenerator.scss';
import ModelSelector from "./ModelSelector.jsx";

const CartoonImageGenerator = ({ onImagesGenerated }) => {
    const [idea, setIdea] = useState('');
    const [numberOfImages, setNumberOfImages] = useState(1);
    const [selectedModel, setSelectedModel] = useState(OPENROUTER_CONFIG.defaultModel);
    const [cartoonType, setCartoonType] = useState('human');
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
            const generatedImages = await generateImagePrompts(idea, numberOfImages, selectedModel, cartoonType);

            onImagesGenerated(generatedImages, idea, numberOfImages, selectedModel, cartoonType);

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
        <div className="container py-4">
            <div className="text-center mb-4 animate-fade-in">
                <h1 className="display-4 fw-bold gradient-text mb-2">🎨 مولد صور الكرتون</h1>
                <p className="lead text-muted">إنشاء برومبتات صور كرتونية احترافية بالذكاء الاصطناعي</p>
            </div>

            <form onSubmit={handleSubmit} className="card shadow-lg border-0 animate-slide-up">
                <div className="card-body p-4">
                    <div className="mb-4">
                        <label htmlFor="idea" className="form-label d-flex align-items-center gap-2 fw-semibold">
                            <FaLightbulb className="text-primary" /> فكرة الصورة
                        </label>
                        <textarea
                            id="idea"
                            className="form-control form-control-lg"
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="مثال: فواكه كرتونية بوجوه معبرة وعيون لامعة"
                            rows="4"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <label htmlFor="numberOfImages" className="form-label d-flex align-items-center gap-2 fw-semibold">
                                <FaHashtag className="text-primary" /> عدد الصور
                            </label>
                            <input
                                type="number"
                                id="numberOfImages"
                                className="form-control"
                                value={numberOfImages}
                                onChange={handleNumberChange}
                                min="1"
                                max="10"
                                disabled={loading}
                                required
                            />
                            <small className="form-text text-muted">من 1 إلى 10 صور</small>
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="cartoonType" className="form-label fw-semibold">
                                نوع الكرتون
                            </label>
                            <select
                                id="cartoonType"
                                className="form-select"
                                value={cartoonType}
                                onChange={(e) => setCartoonType(e.target.value)}
                                disabled={loading}
                                required
                            >
                                <option value="human">إنسان</option>
                                <option value="object_as_human">جماد على شكل إنسان</option>
                                <option value="object">جماد</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <ModelSelector
                                selectedModel={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger d-flex align-items-center animate-shake" role="alert">
                            <span>❌ {error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2 gradient-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                جاري الإنشاء...
                            </>
                        ) : (
                            <>
                                <FaMagic /> إنشاء البرومبتات
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CartoonImageGenerator;

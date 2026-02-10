import React, { useState } from 'react';
import { FaMagic, FaBook, FaHashtag } from 'react-icons/fa';
import { generateVideoStory } from '../services/LLMService.js';
import { LLM_CONFIG } from '../config/LLMConfig.js';
import ModelSelector from '../components/js/ModelSelector.jsx';
import CharacterCard from '../components/js/CharacterCard.jsx';
import SceneCard from '../components/js/SceneCard.jsx';
import '../components/css/VideoStoryGenerator.scss';

const VideoStoryPage = () => {
    const [idea, setIdea] = useState('');
    const [numberOfScenes, setNumberOfScenes] = useState(10);
    const [selectedProvider, setSelectedProvider] = useState(LLM_CONFIG.defaultProvider);
    const [selectedModel, setSelectedModel] = useState(LLM_CONFIG.providers[LLM_CONFIG.defaultProvider].defaultModel);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [storyData, setStoryData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idea.trim()) {
            setError('الرجاء إدخال فكرة القصة');
            return;
        }

        setLoading(true);
        setError(null);
        setStoryData(null);

        try {
            const generatedStory = await generateVideoStory(idea, numberOfScenes, selectedProvider, selectedModel);
            setStoryData(generatedStory);
        } catch (err) {
            console.error('Error generating story:', err);
            setError(err.message || 'حدث خطأ أثناء إنشاء القصة');
        } finally {
            setLoading(false);
        }
    };

    const handleNumberChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setNumberOfScenes(value);
    };

    return (
        <div className="video-story-page">
            <header className="app-header">
                <div className="header-content">
                    <h1>📖 مولد قصص الفيديو</h1>
                </div>
            </header>

            <main className="main-content">
                <div className="content-area">
                    <div className="video-story-generator">
                        <div className="generator-header">
                            <h1>📖 مولد قصص الفيديو</h1>
                            <p>إنشاء قصص فيديو متكاملة مع الشخصيات والمشاهد بالذكاء الاصطناعي</p>
                        </div>

                        <form onSubmit={handleSubmit} className="generator-form">
                            <div className="mb-3">
                                <label htmlFor="idea" className="form-label d-flex align-items-center gap-2 fw-semibold">
                                    <FaBook /> فكرة القصة
                                </label>
                                <textarea
                                    id="idea"
                                    className="form-control"
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
                                    placeholder="مثال: قصة عن طفل يتعلم أهمية الصدق من خلال مغامرة مع أصدقائه"
                                    rows="4"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="numberOfScenes" className="form-label d-flex align-items-center gap-2 fw-semibold">
                                        <FaHashtag /> عدد المشاهد
                                    </label>
                                    <input
                                        type="number"
                                        id="numberOfScenes"
                                        className="form-control"
                                        value={numberOfScenes}
                                        onChange={handleNumberChange}
                                        min="1"
                                        max="100"
                                        disabled={loading}
                                        required
                                    />
                                    <small className="form-text text-muted">من 1 إلى 10 مشاهد</small>
                                </div>
                                <div className="col-md-6">
                                    <ModelSelector
                                        selectedProvider={selectedProvider}
                                        selectedModel={selectedModel}
                                        onProviderChange={(e) => setSelectedProvider(e.target.value)}
                                        onModelChange={(e) => setSelectedModel(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    ❌ {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-100 generate-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        جاري الإنشاء...
                                    </>
                                ) : (
                                    <>
                                        <FaMagic /> إنشاء القصة
                                    </>
                                )}
                            </button>
                        </form>

                        {storyData && (
                            <div className="story-results">
                                <div className="results-header">
                                    <h2>✨ القصة المُنشأة</h2>
                                </div>

                                {storyData.characters && storyData.characters.length > 0 && (
                                    <div className="characters-section">
                                        <h3>👥 الشخصيات</h3>
                                        <div className="characters-grid">
                                            {storyData.characters.map((character, index) => (
                                                <CharacterCard key={index} character={character} index={index} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {storyData.scenes && storyData.scenes.length > 0 && (
                                    <div className="scenes-section">
                                        <div>
                                            <h3>🎬 الوصف البصري</h3>
                                            <ul>
                                                {storyData.scenes.map((scene, index) => (
                                                    <li key={index}>
                                                        <strong>المشهد {index + 1}:</strong> {scene.visualDescription}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <h3>🎬 المشاهد</h3>
                                        <div className="scenes-list">
                                            {storyData.scenes.map((scene, index) => (
                                                <SceneCard key={index} scene={scene} index={index} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {!storyData && (
                        <div className="empty-state">
                            <div className="empty-icon">📖</div>
                            <h3>ابدأ بإنشاء قصة فيديو</h3>
                            <p>أدخل فكرة القصة واختر عدد المشاهد المطلوبة</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="app-footer">
                <p>مولد قصص الفيديو بالذكاء الاصطناعي | Video Story Generator</p>
                <p>created by Keroles Monsef</p>
            </footer>
        </div>
    );
};

export default VideoStoryPage;

import React, { useState } from 'react';
import { FaMagic, FaBook, FaHashtag } from 'react-icons/fa';
import { generateVideoStory } from '../../services/openRouterService.js';
import { OPENROUTER_CONFIG } from '../../config/openRouterConfig.js';
import ModelSelector from './ModelSelector.jsx';
import CharacterCard from './CharacterCard.jsx';
import SceneCard from './SceneCard.jsx';
import '../css/VideoStoryGenerator.scss';

const VideoStoryGenerator = ({ onStoryGenerated }) => {
    const [idea, setIdea] = useState('');
    const [numberOfScenes, setNumberOfScenes] = useState(3);
    const [selectedModel, setSelectedModel] = useState(OPENROUTER_CONFIG.defaultModel);
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
            const generatedStory = await generateVideoStory(idea, numberOfScenes, selectedModel);
            setStoryData(generatedStory);

            if (onStoryGenerated) {
                onStoryGenerated(generatedStory, idea);
            }
        } catch (err) {
            console.error('Error generating story:', err);
            setError(err.message || 'حدث خطأ أثناء إنشاء القصة');
        } finally {
            setLoading(false);
        }
    };

    const handleNumberChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setNumberOfScenes(Math.min(10, Math.max(1, value)));
    };

    return (
        <div className="video-story-generator">
            <div className="generator-header">
                <h1>📖 مولد قصص الفيديو</h1>
                <p>إنشاء قصص فيديو متكاملة مع الشخصيات والمشاهد بالذكاء الاصطناعي</p>
            </div>

            <form onSubmit={handleSubmit} className="generator-form">
                <div className="form-group">
                    <label htmlFor="idea">
                        <FaBook /> فكرة القصة
                    </label>
                    <textarea
                        id="idea"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="مثال: قصة عن طفل يتعلم أهمية الصدق من خلال مغامرة مع أصدقائه"
                        rows="4"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="numberOfScenes">
                            <FaHashtag /> عدد المشاهد
                        </label>
                        <input
                            type="number"
                            id="numberOfScenes"
                            value={numberOfScenes}
                            onChange={handleNumberChange}
                            min="1"
                            max="10"
                            disabled={loading}
                            required
                        />
                        <small>من 1 إلى 10 مشاهد</small>
                    </div>

                    <ModelSelector
                        selectedModel={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        disabled={loading}
                    />
                </div>

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
    );
};

export default VideoStoryGenerator;

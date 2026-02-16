import React, { useState } from 'react';
import { FaMagic, FaBook, FaHashtag, FaCopy, FaCog } from 'react-icons/fa';
import { success, fail, warning } from '../services/SwalHelper.js';
import { generateVideoStory, videoStoryPrompt } from '../services/scripts/videoStoryService.js';
import { LLM_CONFIG } from '../config/LLMConfig.js';
import { saveIdea } from '../services/firebaseService.js';
import { findValue } from '../services/helpers.js';
import ModelSelector from '../components/js/ModelSelector.jsx';
import CharacterCard from '../components/js/CharacterCard.jsx';
import EnvironmentCard from '../components/js/EnvironmentCard.jsx';
import SceneCard from '../components/js/SceneCard.jsx';
import '../components/css/VideoStoryGenerator.scss';

const VideoStoryPage = () => {
    const [idea, setIdea] = useState('');
    const [numberOfScenes, setNumberOfScenes] = useState(10);
    const [selectedProvider, setSelectedProvider] = useState(LLM_CONFIG.defaultProvider);
    const [selectedModel, setSelectedModel] = useState(LLM_CONFIG.providers[LLM_CONFIG.defaultProvider].defaultModel);
    const [loading, setLoading] = useState(false);
    const [storyData, setStoryData] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [jsonInput, setJsonInput] = useState('');

    const handleCopyPrompt = async () => {
        if (!idea.trim()) {
            warning('تنبيه', 'الرجاء إدخال فكرة القصة');
            return;
        }

        try {
            const prompt = videoStoryPrompt(idea, numberOfScenes);
            await navigator.clipboard.writeText(prompt);
            success('تم النسخ بنجاح!', 'تم نسخ البرومبت إلى الحافظة');
        } catch (err) {
            console.error('Error copying prompt:', err);
            fail('خطأ', 'فشل في نسخ البرومبت');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idea.trim()) {
            warning('تنبيه', 'الرجاء إدخال فكرة القصة');
            return;
        }

        setLoading(true);
        setStoryData(null);

        try {
            const generatedStory = await generateVideoStory(idea, numberOfScenes, selectedProvider, selectedModel);
            setStoryData(generatedStory);
            success('تم الإنشاء بنجاح!', 'تم إنشاء القصة بنجاح');
        } catch (err) {
            console.error('Error generating story:', err);
            fail('خطأ', err.message || 'حدث خطأ أثناء إنشاء القصة');
        } finally {
            setLoading(false);
        }
    };

    const handleNumberChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setNumberOfScenes(value);
    };

    const handleJsonSubmit = async (e) => {
        e.preventDefault();

        if (!jsonInput.trim()) {
            warning('تنبيه', 'الرجاء إدخال بيانات JSON');
            return;
        }

        try {
            const parsedData = JSON.parse(jsonInput);

            // Extract data similar to generateVideoStory
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
                throw new Error('لم يتم العثور على الشخصيات في JSON');
            }

            if (!Array.isArray(scenes) || scenes.length === 0) {
                throw new Error('لم يتم العثور على المشاهد في JSON');
            }

            if (!Array.isArray(environments)) {
                environments = [];
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

            const generatedStory = {
                characters: validCharacters,
                environments: validEnvironments,
                scenes: validScenes
            };

            setStoryData(generatedStory);

            // Save to Firebase without awaiting
            saveIdea({
                collection: 'videoStories',
                model: {
                    characters,
                    environments,
                    scenes,
                    provider: selectedProvider,
                    model: selectedModel
                }
            }).then(() => {
                console.log('✅ Video story saved to Firebase');
            }).catch(error => {
                console.warn('⚠️ Failed to save video story to Firebase:', error);
            });

            success('تم الإنشاء بنجاح!', 'تم معالجة JSON وعرض القصة');
            setShowAdvanced(false);
            setJsonInput('');
        } catch (err) {
            console.error('Error processing JSON:', err);
            fail('خطأ', err.message || 'فشل في معالجة JSON. تأكد من صحة البيانات');
        }
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

                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg flex-grow-1 generate-button"
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

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-lg"
                                    onClick={handleCopyPrompt}
                                    disabled={loading}
                                    title="نسخ البرومبت"
                                >
                                    <FaCopy /> نسخ البرومبت
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-info btn-lg"
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    title="اعدادات متقدمة"
                                >
                                    <FaCog />
                                </button>
                            </div>
                        </form>

                        {showAdvanced && (
                            <div className="advanced-settings-section mt-4">
                                <div className="card border-info">
                                    <div className="card-header bg-info text-white">
                                        <h5 className="mb-0">
                                            <FaCog /> إعدادات متقدمة
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleJsonSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="jsonInput" className="form-label fw-semibold">
                                                    القصة JSON
                                                </label>
                                                <textarea
                                                    id="jsonInput"
                                                    className="form-control font-monospace"
                                                    value={jsonInput}
                                                    onChange={(e) => setJsonInput(e.target.value)}
                                                    placeholder='{"characters": [...], "environments": [...], "scenes": [...]}'
                                                    rows="10"
                                                    style={{ fontSize: '0.9rem' }}
                                                />
                                                <small className="form-text text-muted">
                                                    الصق بيانات JSON كاملة تحتوي على characters و environments و scenes
                                                </small>
                                            </div>

                                            <div className="d-flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-info flex-grow-1"
                                                >
                                                    <FaMagic /> معالجة JSON
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => {
                                                        setShowAdvanced(false);
                                                        setJsonInput('');
                                                    }}
                                                >
                                                    إلغاء
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

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

                                {storyData.environments && storyData.environments.length > 0 && (
                                    <div className="environments-section">
                                        <h3>🌍 البيئات</h3>
                                        <div className="environments-grid">
                                            {storyData.environments.map((environment, index) => (
                                                <EnvironmentCard key={index} environment={environment} index={index} />
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

import React, {useState, useEffect} from 'react';
import {FaMagic, FaBook, FaHashtag, FaCopy, FaCog, FaHistory, FaTimes, FaTrash} from 'react-icons/fa';
import {success, fail, warning, confirm} from '../services/SwalHelper.js';
import {generateVideoStory, videoStoryPrompt, processJsonStory} from '../services/scripts/videoStoryService.js';
import {LLM_CONFIG} from '../config/LLMConfig.js';
import {getIdeas, deleteIdea, updateStoryItem} from '../services/firebaseService.js';
import {formatTimestamp} from '../services/helpers.js';
import ModelSelector from '../components/js/ModelSelector.jsx';
import CharacterCard from '../components/js/CharacterCard.jsx';
import EnvironmentCard from '../components/js/EnvironmentCard.jsx';
import SceneCard from '../components/js/SceneCard.jsx';
import Footer from '../components/js/Footer.jsx';
import StoryNavigation from '../components/js/StoryNavigation.jsx';
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
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [currentIdea, setCurrentIdea] = useState('');
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentStoryId, setCurrentStoryId] = useState(null);

    const loadHistory = async (loadMore = false) => {
        try {
            if (loadMore) {
                setLoadingMore(true);
            }

            const result = await getIdeas({
                collection: 'videoStories',
                maxResults: 10,
                lastDoc: loadMore ? lastDoc : null
            });
            console.log("videoStories", {result});
            if (loadMore) {
                setHistory((prev) => [...prev, ...result.ideas]);
            } else {
                setHistory(result.ideas);
            }

            setLastDoc(result.lastDoc);
            setHasMore(result.hasMore);
        } catch (error) {
            console.error('Failed to load history:', error);
            fail('خطأ', 'فشل في تحميل السجل');
        } finally {
            if (loadMore) {
                setLoadingMore(false);
            }
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

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
            setCurrentIdea(idea);
            setShowHistory(false);
            await loadHistory(); // Refresh history
            success('تم الإنشاء بنجاح!', 'تم إنشاء القصة بنجاح');
        } catch (err) {
            console.error('Error generating story:', err);
            fail('خطأ', err.message || 'حدث خطأ أثناء إنشاء القصة');
        } finally {
            setLoading(false);
        }
    };

    const handleLoadPreviousIdea = (item) => {
        console.log("handleLoadPreviousIdea", {item})
        setStoryData(item);
        setCurrentIdea(item.idea);
        setCurrentStoryId(item.id);
        setShowHistory(false);
    };

    const handleItemDoneChange = async (itemType, index, isDone) => {
        if (!currentStoryId) return;

        const errorMessages = {
            scenes: 'فشل في تحديث حالة المشهد',
            characters: 'فشل في تحديث حالة الشخصية',
            environments: 'فشل في تحديث حالة البيئة'
        };

        try {
            await updateStoryItem({
                collection: 'videoStories',
                id: currentStoryId,
                itemType,
                itemIndex: index,
                done: isDone
            });

            setStoryData(prev => ({
                ...prev,
                [itemType]: prev[itemType].map((item, i) =>
                    i === index ? { ...item, done: isDone } : item
                )
            }));
        } catch (error) {
            console.error(`Failed to update ${itemType} done status:`, error);
            fail('خطأ', errorMessages[itemType] || 'فشل في تحديث الحالة');
        }
    };

    const handleDeleteIdea = async (ideaId) => {
        const confirmed = await confirm('تأكيد الحذف', 'هل أنت متأكد من حذف هذه القصة؟', 'نعم، احذف', 'إلغاء');

        if (!confirmed) {
            return;
        }

        try {
            await deleteIdea({collection: 'videoStories', id: ideaId});

            setHistory((prev) => prev.filter((item) => item.id !== ideaId));

            setStoryData((prevStory) => {
                const deletedIdea = history.find((h) => h.id === ideaId);
                if (deletedIdea && JSON.stringify(deletedIdea.storyData) === JSON.stringify(prevStory)) {
                    setCurrentIdea('');
                    setCurrentStoryId(null);
                    return null;
                }
                return prevStory;
            });

            success('تم الحذف', 'تم حذف القصة بنجاح');
        } catch (error) {
            console.error('Failed to delete idea:', error);
            fail('خطأ', 'حدث خطأ أثناء الحذف');
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
            const generatedStory = await processJsonStory( {
                jsonInput,
                selectedProvider,
                selectedModel,
                saveToFirebase: true
            });

            setStoryData(generatedStory);
            await loadHistory(); // Refresh history
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
            {storyData && (
                <StoryNavigation
                    hasCharacters={storyData.characters && storyData.characters.length > 0}
                    hasEnvironments={storyData.environments && storyData.environments.length > 0}
                    hasScenes={storyData.scenes && storyData.scenes.length > 0}
                />
            )}

            <header className="app-header">
                <div className="header-content">
                    <h1>📖 مولد قصص الفيديو</h1>
                    <button
                        className="history-toggle"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? (
                            <>
                                <FaTimes/> إخفاء
                            </>
                        ) : (
                            <>
                                <FaHistory/> السجل ({history.length})
                            </>
                        )}
                    </button>
                </div>
            </header>

            <main className="main-content">
                {showHistory && (
                    <aside className="history-sidebar">
                        <h2>📜 القصص السابقة</h2>
                        {history.length === 0 ? (
                            <div className="empty-history">
                                <p>لا توجد قصص سابقة</p>
                            </div>
                        ) : (
                            <div className="history-list">
                                {history.map((item) => (
                                    <div key={item.id} className="history-item">
                                        <div
                                            className="history-item-content"
                                            onClick={() => handleLoadPreviousIdea(item)}
                                        >
                                            <p className="history-idea">{item.idea}</p>
                                            <div className="history-meta">
                                                <span>🎬 {item.numberOfScenes || item?.scenes?.length || 0} مشاهد</span>
                                                <span>⏰ {formatTimestamp(item.timestamp || item.createdAt)}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="delete-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteIdea(item.id);
                                            }}
                                            title="حذف"
                                        >
                                            <FaTrash/>
                                        </button>
                                    </div>
                                ))}
                                {hasMore && (
                                    <button
                                        className="btn btn-secondary w-100 mt-3"
                                        onClick={() => loadHistory(true)}
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? 'جاري التحميل...' : 'تحميل المزيد'}
                                    </button>
                                )}
                            </div>
                        )}
                    </aside>
                )}

                <div className="content-area">
                    <div className="video-story-generator">
                        <div className="generator-header">
                            <h1>📖 مولد قصص الفيديو</h1>
                            <p>إنشاء قصص فيديو متكاملة مع الشخصيات والمشاهد بالذكاء الاصطناعي</p>
                        </div>

                        <form onSubmit={handleSubmit} className="generator-form">
                            <div className="mb-3">
                                <label htmlFor="idea"
                                       className="form-label d-flex align-items-center gap-2 fw-semibold">
                                    <FaBook/> فكرة القصة
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
                                    <label htmlFor="numberOfScenes"
                                           className="form-label d-flex align-items-center gap-2 fw-semibold">
                                        <FaHashtag/> عدد المشاهد
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
                                            <FaMagic/> إنشاء القصة
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
                                    <FaCopy/> نسخ البرومبت
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-info btn-lg"
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    title="اعدادات متقدمة"
                                >
                                    <FaCog/>
                                </button>
                            </div>
                        </form>

                        {showAdvanced && (
                            <div className="advanced-settings-section mt-4">
                                <div className="card border-info">
                                    <div className="card-header bg-info text-white">
                                        <h5 className="mb-0">
                                            <FaCog/> إعدادات متقدمة
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
                                                    style={{fontSize: '0.9rem'}}
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
                                                    <FaMagic/> معالجة JSON
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
                                    {currentIdea && <p className="current-idea">{currentIdea}</p>}
                                </div>

                                {storyData.scenes && storyData.scenes.length > 0 && (
                                    <div className="scenes-section">
                                        <div>
                                            <h3>🎬 الوصف البصري</h3>
                                            <ul>
                                                {storyData.scenes.map((scene, index) => (
                                                    <li key={index}>
                                                        <strong>المشهد {index + 1}:</strong> {scene.visualDescription}
                                                        <p>الحوار {scene.dialogue}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {storyData.characters && storyData.characters.length > 0 && (
                                            <div className="characters-section" id="characters">
                                                <h3>👥 الشخصيات</h3>
                                                <div className="characters-grid">
                                                    {storyData.characters.map((character, index) => (
                                                        <CharacterCard
                                                            key={index}
                                                            character={character}
                                                            index={index}
                                                            storyId={currentStoryId}
                                                            onDoneChange={(index, isDone) => handleItemDoneChange('characters', index, isDone)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}


                                        <div className="scenes-list" id="scenes">
                                            <h3>🎬 المشاهد</h3>
                                            {storyData.scenes.map((scene, index) => (
                                                <SceneCard
                                                    key={index}
                                                    scene={scene}
                                                    index={index}
                                                    storyId={currentStoryId}
                                                    onDoneChange={(index, isDone) => handleItemDoneChange('scenes', index, isDone)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}



                                {storyData.environments && storyData.environments.length > 0 && (
                                    <div className="environments-section" id="environments">
                                        <h3>🌍 البيئات</h3>
                                        <div className="environments-grid">
                                            {storyData.environments.map((environment, index) => (
                                                <EnvironmentCard
                                                    key={index}
                                                    environment={environment}
                                                    index={index}
                                                    storyId={currentStoryId}
                                                    onDoneChange={(index, isDone) => handleItemDoneChange('environments', index, isDone)}
                                                />
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

            <Footer />
        </div>
    );
};

export default VideoStoryPage;

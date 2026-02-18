import React, {useState, useEffect} from 'react';
import {FaMagic, FaLightbulb, FaHistory, FaTimes, FaTrash} from 'react-icons/fa';
import {success, fail, warning, confirm} from '../services/SwalHelper.js';
import {generateImagePrompts} from '../services/LLMService.js';
import {LLM_CONFIG} from '../config/LLMConfig.js';
import ModelSelector from '../components/js/ModelSelector.jsx';
import ImageCard from '../components/js/ImageCard.jsx';
import Footer from '../components/js/Footer.jsx';
import {getIdeas, deleteIdea} from '../services/firebaseService';
import '../components/css/AdviceGenerator.scss';
import {formatTimestamp} from '../services/helpers.js';

const CartoonImagesPage = () => {
    const [image, setImage] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [currentIdea, setCurrentIdea] = useState('');
    const [idea, setIdea] = useState('');
    const [selectedProvider, setSelectedProvider] = useState(LLM_CONFIG.defaultProvider);
    const [selectedModel, setSelectedModel] = useState(LLM_CONFIG.providers[LLM_CONFIG.defaultProvider].defaultModel);
    const [characterType, setCharacterType] = useState('human');
    const [loading, setLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadHistory = async (loadMore = false) => {
        try {
            if (loadMore) {
                setLoadingMore(true);
            }

            const result = await getIdeas({
                collection: 'imagePrompts',
                maxResults: 10,
                lastDoc: loadMore ? lastDoc : null
            });

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idea.trim()) {
            warning('تنبيه', 'الرجاء إدخال فكرة الصورة');
            return;
        }

        setLoading(true);

        try {
            const generatedImage = await generateImagePrompts({
                idea,
                provider: selectedProvider,
                model: selectedModel,
                characterType
            });
            setImage(generatedImage);
            setCurrentIdea(idea);
            setShowHistory(false);
            await loadHistory(); // Refresh history
            success('تم الإنشاء بنجاح!', 'تم إنشاء البرومبت بنجاح');
        } catch (err) {
            console.error('Error generating image prompt:', err);
            fail('خطأ', err.message || 'حدث خطأ أثناء إنشاء البرومبت');
        } finally {
            setLoading(false);
        }
    };

    const handleLoadPreviousIdea = (item) => {
        setImage(item.image);
        setCurrentIdea(item.idea);
        setShowHistory(false);
    };

    const handleDeleteIdea = async (ideaId) => {
        const confirmed = await confirm('تأكيد الحذف', 'هل أنت متأكد من حذف هذه الفكرة؟', 'نعم، احذف', 'إلغاء');

        if (!confirmed) {
            return;
        }

        try {
            await deleteIdea({ collection: 'imagePrompts', id: ideaId });

            setHistory((prev) => prev.filter((item) => item.id !== ideaId));

            setImage((prevImage) => {
                const deletedIdea = history.find((h) => h.id === ideaId);
                if (deletedIdea && JSON.stringify(deletedIdea.image) === JSON.stringify(prevImage)) {
                    setCurrentIdea('');
                    return null;
                }
                return prevImage;
            });

            success('تم الحذف', 'تم حذف الفكرة بنجاح');
        } catch (error) {
            console.error('Failed to delete idea:', error);
            fail('خطأ', 'حدث خطأ أثناء الحذف');
        }
    };



    return (
        <div className="scripts-page">
            <header className="app-header">
                <div className="header-content">
                    <h1>🎨 مولد صور الكرتون</h1>
                    <button
                        className="history-toggle"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? (
                            <>
                                <FaTimes /> إخفاء
                            </>
                        ) : (
                            <>
                                <FaHistory /> السجل ({history.length})
                            </>
                        )}
                    </button>
                </div>
            </header>

            <main className="main-content">
                {showHistory && (
                    <aside className="history-sidebar">
                        <h2>📜 الأفكار السابقة</h2>
                        {history.length === 0 ? (
                            <div className="empty-history">
                                <p>لا توجد أفكار سابقة</p>
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
                                                <span>🎨 صورة واحدة</span>
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
                                            <FaTrash />
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
                    <div className="script-generator">
                        <div className="generator-header">
                            <h1>🎨 مولد صور الكرتون</h1>
                            <p>إنشاء برومبتات صور كرتونية احترافية بالذكاء الاصطناعي</p>
                        </div>

                        <form onSubmit={handleSubmit} className="generator-form">
                            <div className="mb-3">
                                <label htmlFor="idea" className="form-label d-flex align-items-center gap-2 fw-semibold">
                                    <FaLightbulb /> فكرة الصورة
                                </label>
                                <textarea
                                    id="idea"
                                    className="form-control"
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
                                    placeholder="مثال: فواكه كرتونية بوجوه معبرة وعيون لامعة"
                                    rows="4"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="characterType" className="form-label fw-semibold">
                                        نوع الشخصية
                                    </label>
                                    <select
                                        id="characterType"
                                        className="form-select"
                                        value={characterType}
                                        onChange={(e) => setCharacterType(e.target.value)}
                                        disabled={loading}
                                        required
                                    >
                                        <option value="human">إنسان</option>
                                        <option value="object_as_human">جماد على شكل إنسان</option>
                                        <option value="object">جماد</option>
                                        <option value="animal">حيوان</option>
                                    </select>
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
                                        <FaMagic /> إنشاء البرومبت
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {image && (
                        <section className="scripts-container">
                            <div className="scripts-header">
                                <div>
                                    <h2>✨ البرومبت المُنشأ</h2>
                                    {currentIdea && <p className="current-idea">{currentIdea}</p>}
                                </div>
                            </div>
                            <div className="scripts-grid">
                                <ImageCard image={image} index={0} />
                            </div>
                        </section>
                    )}

                    {!image && (
                        <div className="empty-state">
                            <div className="empty-icon">🎨</div>
                            <h3>ابدأ بإنشاء صورة كرتونية</h3>
                            <p>أدخل فكرتك واختر نوع الكرتون المطلوب</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CartoonImagesPage;


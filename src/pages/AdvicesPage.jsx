import React, {useEffect, useState} from 'react';
import {FaHistory, FaTimes, FaTrash, FaMagic, FaLightbulb, FaHashtag} from 'react-icons/fa';
import {success, fail, warning, confirm} from '../services/SwalHelper.js';
import {generateAdviceScript} from '../services/LLMService.js';
import {LLM_CONFIG} from '../config/LLMConfig.js';
import ModelSelector from '../components/js/ModelSelector.jsx';
import AdviceCard from '../components/js/AdviceCard.jsx';
import Footer from '../components/js/Footer.jsx';
import {getIdeas, deleteIdea} from '../services/firebaseService';
import '../components/css/AdviceGenerator.scss';
import {formatTimestamp} from '../services/helpers.js';

const AdvicesPage = () => {
    const [scripts, setScripts] = useState([]);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [currentIdea, setCurrentIdea] = useState('');
    const [idea, setIdea] = useState('');
    const [numberOfScripts, setNumberOfScripts] = useState(1);
    const [selectedProvider, setSelectedProvider] = useState(LLM_CONFIG.defaultProvider);
    const [selectedModel, setSelectedModel] = useState(LLM_CONFIG.providers[LLM_CONFIG.defaultProvider].defaultModel);
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
                collection: 'videoIdeas',
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
            warning('تنبيه', 'الرجاء إدخال فكرة الفيديو');
            return;
        }

        setLoading(true);

        try {
            const generatedScripts = await generateAdviceScript(idea, numberOfScripts, selectedProvider, selectedModel);
            setScripts(generatedScripts);
            setCurrentIdea(idea);
            setShowHistory(false);
            success('تم الإنشاء بنجاح!', 'تم إنشاء السكريبتات بنجاح');
        } catch (err) {
            console.error('Error generating scripts:', err);
            fail('خطأ', err.message || 'حدث خطأ أثناء إنشاء السكريبتات');
        } finally {
            setLoading(false);
        }
    };

    const handleNumberChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setNumberOfScripts(Math.min(10, Math.max(1, value)));
    };

    const handleLoadPreviousIdea = (idea) => {
        setScripts(idea.scripts);
        setCurrentIdea(idea.idea);
        setShowHistory(false);
    };

    const handleDeleteIdea = async (ideaId) => {
        const confirmed = await confirm('تأكيد الحذف', 'هل أنت متأكد من حذف هذه الفكرة؟', 'نعم، احذف', 'إلغاء');

        if (!confirmed) {
            return;
        }

        try {
            await deleteIdea({collection: 'videoIdeas', id: ideaId});

            setHistory((prev) => prev.filter((item) => item.id !== ideaId));

            setScripts((prevScripts) => {
                const deletedIdea = history.find((h) => h.id === ideaId);
                if (deletedIdea && JSON.stringify(deletedIdea.scripts) === JSON.stringify(prevScripts)) {
                    setCurrentIdea('');
                    return [];
                }
                return prevScripts;
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
                    <h1>🎥 مولد أفكار الفيديو</h1>
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
                                                <span>📝 {item.numberOfScripts} سكريبتات</span>
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
                    <div className="script-generator">
                        <div className="generator-header">
                            <h1>🎬 مولد سكريبتات الفيديو</h1>
                            <p>إنشاء سكريبتات فيديو احترافية بالذكاء الاصطناعي</p>
                        </div>

                        <form onSubmit={handleSubmit} className="generator-form">
                            <div className="mb-3">
                                <label htmlFor="idea"
                                       className="form-label d-flex align-items-center gap-2 fw-semibold">
                                    <FaLightbulb/> فكرة الفيديو
                                </label>
                                <textarea
                                    id="idea"
                                    className="form-control"
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
                                    placeholder="مثال: فيديو عن الفواكه تتحدث وتعطي فوائد وأضرار تناولها"
                                    rows="4"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="numberOfScripts"
                                           className="form-label d-flex align-items-center gap-2 fw-semibold">
                                        <FaHashtag/> عدد السكريبتات
                                    </label>
                                    <input
                                        type="number"
                                        id="numberOfScripts"
                                        className="form-control"
                                        value={numberOfScripts}
                                        onChange={handleNumberChange}
                                        min="1"
                                        max="10"
                                        disabled={loading}
                                        required
                                    />
                                    <small className="form-text text-muted">من 1 إلى 10 سكريبتات</small>
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
                                        <FaMagic/> إنشاء السكريبتات
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {scripts.length > 0 && (
                        <section className="scripts-container">
                            <div className="scripts-header">
                                <div>
                                    <h2>✨ السكريبتات المُنشأة</h2>
                                    {currentIdea && <p className="current-idea">{currentIdea}</p>}
                                </div>
                                <span className="scripts-count">{scripts.length} سكريبت</span>
                            </div>
                            <div className="scripts-grid">
                                {scripts.map((script, index) => (
                                    <AdviceCard key={index} script={script} index={index}/>
                                ))}
                            </div>
                        </section>
                    )}

                    {scripts.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🎬</div>
                            <h3>ابدأ بإنشاء سكريبتات الفيديو</h3>
                            <p>أدخل فكرتك واختر عدد السكريبتات المطلوبة</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdvicesPage;

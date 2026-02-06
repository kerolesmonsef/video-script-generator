import React, { useEffect, useState } from 'react';
import { FaHistory, FaTimes, FaTrash } from 'react-icons/fa';
import ScriptGenerator from '../components/js/ScriptGenerator.jsx';
import ScriptCard from '../components/js/ScriptCard.jsx';
import { saveIdea, getIdeas, deleteIdea } from '../services/firebaseService';

const ScriptsPage = () => {
  const [scripts, setScripts] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentIdea, setCurrentIdea] = useState('');

  const loadHistory = async () => {
    try {
      const ideas = await getIdeas();
      setHistory(ideas);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleScriptsGenerated = async (generatedScripts, idea, numberOfScripts, model) => {
    setScripts(generatedScripts);
    setCurrentIdea(idea);
    setShowHistory(false);

    try {
      await saveIdea(idea, numberOfScripts, generatedScripts, model);
      loadHistory();
    } catch (error) {
      console.error('Failed to save to Firebase:', error);
    }
  };

  const handleLoadPreviousIdea = (idea) => {
    setScripts(idea.scripts);
    setCurrentIdea(idea.idea);
    setShowHistory(false);
  };

  const handleDeleteIdea = async (ideaId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الفكرة؟')) {
      return;
    }

    try {
      await deleteIdea(ideaId);

      setHistory((prev) => prev.filter((item) => item.id !== ideaId));

      setScripts((prevScripts) => {
        const deletedIdea = history.find((h) => h.id === ideaId);
        if (deletedIdea && JSON.stringify(deletedIdea.scripts) === JSON.stringify(prevScripts)) {
          setCurrentIdea('');
          return [];
        }
        return prevScripts;
      });
    } catch (error) {
      console.error('Failed to delete idea:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}

        <div className="content-area">
          <ScriptGenerator onScriptsGenerated={handleScriptsGenerated} />

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
                  <ScriptCard key={index} script={script} index={index} />
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

      <footer className="app-footer">
        <p>مولد سكريبتات الفيديو بالذكاء الاصطناعي | Video Script Generator</p>
        <p>created by Keroles Monsef</p>
      </footer>
    </div>
  );
};

export default ScriptsPage;

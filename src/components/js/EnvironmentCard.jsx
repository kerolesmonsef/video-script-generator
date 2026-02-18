import React, { useState } from 'react';
import { FaCopy, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';
import DoneToggle from './DoneToggle.jsx';
import '../css/EnvironmentCard.scss';

const EnvironmentCard = ({ environment, index, storyId, onDoneChange }) => {
    const [copiedField, setCopiedField] = useState(null);

    const handleDoneChange = (isDone) => {
        if (onDoneChange) {
            onDoneChange(index, isDone);
        }
    };

    const handleCopy = (text, fieldName) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedField(fieldName);
                setTimeout(() => setCopiedField(null), 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                alert('فشل النسخ');
            });
    };

    const handleCopyAll = () => {
        const textToCopy = `
ID: ${environment.id || ''}

الاسم: ${environment.name}

الوصف: ${environment.description}

المزاج: ${environment.mood || ''}

نوع الإضاءة: ${environment.lightingType || ''}

${environment.environmentPrompt ? `برومبت البيئة: ${environment.environmentPrompt}` : ''}
    `.trim();

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopiedField('all');
                setTimeout(() => setCopiedField(null), 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                alert('فشل النسخ');
            });
    };

    return (
        <div className={`environment-card ${environment.done ? 'done-card' : 'undone-card'}`}>
            <DoneToggle
                isDone={environment.done || false}
                onChange={handleDoneChange}
                disabled={!storyId}
            />
            <div className="environment-card-header">
                <div className="environment-icon">
                    <FaMapMarkerAlt />
                </div>
                <h4>بيئة #{index + 1}</h4>
                <button
                    className={`copy-all-btn ${copiedField === 'all' ? 'copied' : ''}`}
                    onClick={handleCopyAll}
                    title="نسخ كل البيانات"
                >
                    {copiedField === 'all' ? <FaCheck /> : <FaCopy />}
                    <span>{copiedField === 'all' ? 'تم النسخ!' : 'نسخ الكل'}</span>
                </button>
            </div>

            <div className="environment-card-body">
                {environment.id && (
                    <div className="environment-field">
                        <div className="field-header">
                            <label>🆔 المعرف</label>
                            <button
                                className={`copy-btn ${copiedField === 'id' ? 'copied' : ''}`}
                                onClick={() => handleCopy(environment.id, 'id')}
                                title="نسخ المعرف"
                            >
                                {copiedField === 'id' ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>
                        <p>{environment.id}</p>
                    </div>
                )}

                <div className="environment-field">
                    <div className="field-header">
                        <label>📍 الاسم</label>
                        <button
                            className={`copy-btn ${copiedField === 'name' ? 'copied' : ''}`}
                            onClick={() => handleCopy(environment.name, 'name')}
                            title="نسخ الاسم"
                        >
                            {copiedField === 'name' ? <FaCheck /> : <FaCopy />}
                        </button>
                    </div>
                    <p>{environment.name}</p>
                </div>

                <div className="environment-field">
                    <div className="field-header">
                        <label>📝 الوصف</label>
                        <button
                            className={`copy-btn ${copiedField === 'description' ? 'copied' : ''}`}
                            onClick={() => handleCopy(environment.description, 'description')}
                            title="نسخ الوصف"
                        >
                            {copiedField === 'description' ? <FaCheck /> : <FaCopy />}
                        </button>
                    </div>
                    <p>{environment.description}</p>
                </div>

                {environment.mood && (
                    <div className="environment-field">
                        <div className="field-header">
                            <label>🎭 المزاج</label>
                            <button
                                className={`copy-btn ${copiedField === 'mood' ? 'copied' : ''}`}
                                onClick={() => handleCopy(environment.mood, 'mood')}
                                title="نسخ المزاج"
                            >
                                {copiedField === 'mood' ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>
                        <p>{environment.mood}</p>
                    </div>
                )}

                {environment.lightingType && (
                    <div className="environment-field">
                        <div className="field-header">
                            <label>💡 نوع الإضاءة</label>
                            <button
                                className={`copy-btn ${copiedField === 'lightingType' ? 'copied' : ''}`}
                                onClick={() => handleCopy(environment.lightingType, 'lightingType')}
                                title="نسخ نوع الإضاءة"
                            >
                                {copiedField === 'lightingType' ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>
                        <p>{environment.lightingType}</p>
                    </div>
                )}

                {environment.environmentPrompt && (
                    <div className="environment-field">
                        <div className="field-header">
                            <label>🖼️ برومبت البيئة</label>
                            <button
                                className={`copy-btn ${copiedField === 'environmentPrompt' ? 'copied' : ''}`}
                                onClick={() => handleCopy(environment.environmentPrompt, 'environmentPrompt')}
                                title="نسخ برومبت البيئة"
                            >
                                {copiedField === 'environmentPrompt' ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>
                        <p className="prompt-text">{environment.environmentPrompt}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnvironmentCard;


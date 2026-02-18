import React, { useState } from 'react';
import { FaCopy, FaCheck, FaUsers } from 'react-icons/fa';
import DoneToggle from './DoneToggle.jsx';
import '../css/SceneCard.scss';

const SceneCard = ({ scene, index, storyId, onDoneChange }) => {
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
مشهد #${scene.sceneNumber || index + 1}

الشخصيات: ${Array.isArray(scene.characters) ? scene.characters.join(', ') : scene.characters}

الوصف البصري: ${scene.visualDescription}

الحوار: ${scene.dialogue}

${scene.sceneImagePrompt ? `برومبت الصورة: ${scene.sceneImagePrompt}` : ''}

${scene.grokPrompt ? `برومبت الفيديو (Grok): ${scene.grokPrompt}` : ''}
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
        <div className={`scene-card ${scene.done ? 'done-card' : 'undone-card'}`}>
            <DoneToggle
                isDone={scene.done || false}
                onChange={handleDoneChange}
                disabled={!storyId}
            />
            <div className="scene-card-header">
                <h3>مشهد #{scene.sceneNumber || index + 1}</h3>
            </div>

            <div className="scene-card-body">
                {scene.characters && (
                    <div className="scene-field">
                        <div className="field-header">
                            <label><FaUsers /> الشخصيات</label>
                            <button
                                className={`copy-btn ${copiedField === 'characters' ? 'copied' : ''}`}
                                onClick={() => handleCopy(
                                    Array.isArray(scene.characters) ? scene.characters.join(', ') : scene.characters,
                                    'characters'
                                )}
                                title="نسخ الشخصيات"
                            >
                                {copiedField === 'characters' ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>
                        <p className="characters-list">
                            {Array.isArray(scene.characters)
                                ? scene.characters.join(' • ')
                                : scene.characters}
                        </p>
                    </div>
                )}
                <div className="scene-field">
                    <div className="field-header">
                        <label>🎬 الوصف البصري</label>
                        <button
                            className={`copy-btn ${copiedField === 'visualDescription' ? 'copied' : ''}`}
                            onClick={() => handleCopy(scene.visualDescription, 'visualDescription')}
                            title="نسخ الوصف البصري"
                        >
                            {copiedField === 'visualDescription' ? <FaCheck /> : <FaCopy />}
                        </button>
                    </div>
                    <p>{scene.visualDescription}</p>
                </div>
                <div className="scene-field dialogue-field">
                    <div className="field-header">
                        <label>🎤 الحوار</label>
                        <button
                            className={`copy-btn ${copiedField === 'dialogue' ? 'copied' : ''}`}
                            onClick={() => handleCopy(scene.dialogue, 'dialogue')}
                            title="نسخ الحوار"
                        >
                            {copiedField === 'dialogue' ? <FaCheck /> : <FaCopy />}
                        </button>
                    </div>
                    <p className="dialogue-text">{scene.dialogue}</p>
                </div>
                {scene.sceneImagePrompt && (
                    <div className="scene-field">
                        <div className="field-header">
                            <label>🖼️ برومبت الصورة</label>
                            <button
                                className={`copy-btn ${copiedField === 'sceneImagePrompt' ? 'copied' : ''}`}
                                onClick={() => handleCopy(scene.sceneImagePrompt, 'sceneImagePrompt')}
                                title="نسخ برومبت الصورة"
                            >
                                {copiedField === 'sceneImagePrompt' ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>
                        <p>{scene.sceneImagePrompt}</p>
                    </div>
                )}

                {scene.grokPrompt && (
                    <div className="scene-field">
                        <div className="field-header">
                            <label>🎥 برومبت الفيديو (Grok)</label>
                            <button
                                className={`copy-btn ${copiedField === 'grokPrompt' ? 'copied' : ''}`}
                                onClick={() => handleCopy(scene.grokPrompt, 'grokPrompt')}
                                title="نسخ برومبت الفيديو"
                            >
                                {copiedField === 'grokPrompt' ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>
                        <p>{scene.grokPrompt}</p>
                    </div>
                )}
            </div>

            <button
                className={`copy-all-button ${copiedField === 'all' ? 'copied' : ''}`}
                onClick={handleCopyAll}
            >
                {copiedField === 'all' ? (
                    <>
                        <FaCheck /> تم النسخ!
                    </>
                ) : (
                    <>
                        <FaCopy /> نسخ المشهد كاملاً
                    </>
                )}
            </button>
        </div>
    );
};

export default SceneCard;

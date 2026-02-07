import React, { useState } from 'react';
import { FaCopy, FaCheck, FaClock, FaUsers } from 'react-icons/fa';
import '../css/SceneCard.scss';

const SceneCard = ({ scene, index }) => {
    const [copiedField, setCopiedField] = useState(null);

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
        const voiceTonesText = scene.voiceTones
            ? Object.entries(scene.voiceTones)
                .map(([char, tone]) => `${char}: ${tone}`)
                .join('\n')
            : '';

        const textToCopy = `
مشهد #${scene.sceneNumber || index + 1}

الشخصيات: ${Array.isArray(scene.characters) ? scene.characters.join(', ') : scene.characters}

الوصف البصري: ${scene.visualDescription}

الحوار: ${scene.dialogue}

نبرات الصوت:
${voiceTonesText}

المدة: ${scene.duration}
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
        <div className="scene-card">
            <div className="scene-card-header">
                <h3>مشهد #{scene.sceneNumber || index + 1}</h3>
                <div className="scene-meta">
                    <div className="duration-badge">
                        <FaClock /> <span>{scene.duration || '5 ثواني'}</span>
                    </div>
                </div>
            </div>

            <div className="scene-card-body">
                {/* Characters */}
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

                {/* Visual Description */}
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

                {/* Dialogue */}
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

                {/* Voice Tones */}
                {scene.voiceTones && Object.keys(scene.voiceTones).length > 0 && (
                    <div className="scene-field">
                        <div className="field-header">
                            <label>🎭 نبرات الصوت</label>
                            <button
                                className={`copy-btn ${copiedField === 'voiceTones' ? 'copied' : ''}`}
                                onClick={() => handleCopy(
                                    Object.entries(scene.voiceTones)
                                        .map(([char, tone]) => `${char}: ${tone}`)
                                        .join('\n'),
                                    'voiceTones'
                                )}
                                title="نسخ نبرات الصوت"
                            >
                                {copiedField === 'voiceTones' ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>
                        <div className="voice-tones">
                            {Object.entries(scene.voiceTones).map(([character, tone], idx) => (
                                <span key={idx} className="voice-tone-badge">
                                    {character}: {tone}
                                </span>
                            ))}
                        </div>
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

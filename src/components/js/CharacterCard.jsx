import React, { useState } from 'react';
import { FaCopy, FaCheck, FaUser } from 'react-icons/fa';
import DoneToggle from './DoneToggle.jsx';
import '../css/CharacterCard.scss';

const CharacterCard = ({ character, index, storyId, onDoneChange }) => {
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
الاسم: ${character.name}

الوصف: ${character.description}

الدور: ${character.role}

${character.characterImagePrompt ? `برومبت الصورة: ${character.characterImagePrompt}` : ''}
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
        <div className={`character-card ${character.done ? 'done-card' : 'undone-card'}`}>
            <DoneToggle
                isDone={character.done || false}
                onChange={handleDoneChange}
                disabled={!storyId}
            />
            <div className="character-card-header">
                <div className="character-icon">
                    <FaUser />
                </div>
                <h4>شخصية #{index + 1}</h4>
            </div>

            <div className="character-card-body">
                <div className="character-field">
                    <div className="field-header">
                        <label>👤 الاسم</label>
                        <button
                            className={`copy-btn ${copiedField === 'name' ? 'copied' : ''}`}
                            onClick={() => handleCopy(character.name, 'name')}
                            title="نسخ الاسم"
                        >
                            {copiedField === 'name' ? <FaCheck /> : <FaCopy />}
                        </button>
                    </div>
                    <p>{character.name}</p>
                </div>

                <div className="character-field">
                    <div className="field-header">
                        <label>📝 الوصف</label>
                        <button
                            className={`copy-btn ${copiedField === 'description' ? 'copied' : ''}`}
                            onClick={() => handleCopy(character.description, 'description')}
                            title="نسخ الوصف"
                        >
                            {copiedField === 'description' ? <FaCheck /> : <FaCopy />}
                        </button>
                    </div>
                    <p>{character.description}</p>
                </div>

                <div className="character-field">
                    <div className="field-header">
                        <label>🎭 الدور</label>
                        <button
                            className={`copy-btn ${copiedField === 'role' ? 'copied' : ''}`}
                            onClick={() => handleCopy(character.role, 'role')}
                            title="نسخ الدور"
                        >
                            {copiedField === 'role' ? <FaCheck /> : <FaCopy />}
                        </button>
                    </div>
                    <p>{character.role}</p>
                </div>

                {character.characterImagePrompt && (
                    <div className="character-field">
                        <div className="field-header">
                            <label>🖼️ برومبت الصورة</label>
                            <button
                                className={`copy-btn ${copiedField === 'characterImagePrompt' ? 'copied' : ''}`}
                                onClick={() => handleCopy(character.characterImagePrompt, 'characterImagePrompt')}
                                title="نسخ برومبت الصورة"
                            >
                                {copiedField === 'characterImagePrompt' ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>
                        <p>{character.characterImagePrompt}</p>
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
                        <FaCopy /> نسخ كل البيانات
                    </>
                )}
            </button>
        </div>
    );
};

export default CharacterCard;

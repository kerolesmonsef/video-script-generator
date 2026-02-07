import React, { useState } from 'react';
import { FaCopy, FaCheck, FaClock, FaImage } from 'react-icons/fa';
import '../css/ScriptCard.scss';

const ScriptCard = ({ script, index }) => {
  const [copied, setCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `
الوصف المرئي: ${script.visualDescription}

النص الصوتي: ${script.voiceText}

Image Prompt: ${script.imagePrompt || ''}

الفائدة: ${script.benefit}

العيب: ${script.drawback}
    `.trim();

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('فشل النسخ');
      });
  };

  const handleCopyImagePrompt = () => {
    if (!script.imagePrompt) return;

    navigator.clipboard.writeText(script.imagePrompt)
      .then(() => {
        setImageCopied(true);
        setTimeout(() => setImageCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('فشل النسخ');
      });
  };

  return (
    <div className="script-card">
      <div className="script-card-header">
        <h3>سكريبت #{index + 1}</h3>
        <div className="duration-badge">
          <FaClock /> <span>5 ثوانٍ</span>
        </div>
      </div>

      <div className="script-card-body">
        <div className="script-section visual-section">
          <h4>🎬 الوصف المرئي (للذكاء الاصطناعي)</h4>
          <p>{script.visualDescription}</p>
        </div>

        <div className="script-section voice-section">
          <h4>🎤 النص الصوتي</h4>
          <p>{script.voiceText}</p>
        </div>

        {script.imagePrompt && (
          <div className="script-section image-prompt-section">
            <div className="image-prompt-header">
              <h4><FaImage /> Image Prompt</h4>
              <button
                className={`copy-image-prompt ${imageCopied ? 'copied' : ''}`}
                onClick={handleCopyImagePrompt}
              >
                {imageCopied ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
            <p className="image-prompt-text">{script.imagePrompt}</p>
          </div>
        )}

        <div className="benefits-drawbacks">
          <div className="benefit-box">
            <h4>✅ الفائدة</h4>
            <p>{script.benefit}</p>
          </div>
          <div className="drawback-box">
            <h4>⚠️ العيب</h4>
            <p>{script.drawback}</p>
          </div>
        </div>

      </div>

      <button
        className={`copy-button ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <FaCheck /> تم النسخ!
          </>
        ) : (
          <>
            <FaCopy /> نسخ السكريبت
          </>
        )}
      </button>
    </div>
  );
};

export default ScriptCard;


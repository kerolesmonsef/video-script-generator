// ScriptCard Component - Displays individual script in a beautiful card
import React, { useState } from 'react';
import { FaCopy, FaCheck, FaClock } from 'react-icons/fa';
import { SiYoutube, SiTiktok } from 'react-icons/si';
import './ScriptCard.css';

const ScriptCard = ({ script, index }) => {
  const [copied, setCopied] = useState(false);

  // Copy script content to clipboard
  const handleCopy = () => {
    const textToCopy = `
العنوان: ${script.title}

الوصف المرئي: ${script.visualDescription}

النص الصوتي: ${script.voiceText}

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

  return (
    <div className="script-card">
      <div className="script-card-header">
        <h3>سكريبت #{index + 1}</h3>
        <div className="duration-badge">
          <FaClock /> <span>5 ثوانٍ</span>
        </div>
      </div>

      <div className="script-card-body">
        {/* Title Section */}
        <div className="script-section title-section">
          <h4>📌 العنوان</h4>
          <p>{script.title}</p>
        </div>

        {/* Visual Description Section */}
        <div className="script-section visual-section">
          <h4>🎬 الوصف المرئي (للذكاء الاصطناعي)</h4>
          <p>{script.visualDescription}</p>
        </div>

        {/* Voice Text Section */}
        <div className="script-section voice-section">
          <h4>🎤 النص الصوتي</h4>
          <p>{script.voiceText}</p>
        </div>

        {/* Benefits and Drawbacks */}
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

        {/* Platform Badges */}
        <div className="platform-badges">
          <span className="platform-badge youtube">
            <SiYoutube /> YouTube Shorts
          </span>
          <span className="platform-badge tiktok">
            <SiTiktok /> TikTok
          </span>
        </div>
      </div>

      {/* Copy Button */}
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


import React, { useState } from 'react';
import { FaCopy, FaCheck, FaImage } from 'react-icons/fa';
import CloudflareTextToImage from './CloudflareTextToImage';
import '../css/ImageCard.scss';

const ImageCard = ({ image, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!image.imagePrompt) return;

    navigator.clipboard.writeText(image.imagePrompt)
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
    <div className="image-card">
      <div className="image-card-header">
        <h3>صورة #{index + 1}</h3>
      </div>

      <div className="image-card-body">
        <div className="image-section concept-section">
          <h4>🎨 عنوان الفكرة</h4>
          <p>{image.conceptTitle}</p>
        </div>

        <div className="image-section prompt-section">
          <div className="prompt-header">
            <h4><FaImage /> Image Prompt</h4>
          </div>
          <p className="prompt-text">{image.imagePrompt}</p>
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
            <FaCopy /> نسخ البرومبت
          </>
        )}
      </button>
    </div>
  );
};

export default ImageCard;

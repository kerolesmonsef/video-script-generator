import React, { useState, useEffect, useCallback } from 'react';
import { CLOUDFLARE_CONFIG } from '../../config/cloudflareConfig';
import '../css/CloudflareTextToImage.scss';

const CloudflareTextToImage = ({ prompt, width = 1024, height = 1024, className = '' }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = useCallback(async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const endpoint = `${CLOUDFLARE_CONFIG.API_ENDPOINT}/${CLOUDFLARE_CONFIG.ACCOUNT_ID}/ai/run/${CLOUDFLARE_CONFIG.MODEL}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_CONFIG.API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          width,
          height
        })
      });

      if (!response.ok) {
        throw new Error(`فشل في توليد الصورة: ${response.status}`);
      }

      // Convert the response to blob (image/png)
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err.message || 'حدث خطأ أثناء توليد الصورة');
    } finally {
      setLoading(false);
    }
  }, [prompt, width, height]);

  useEffect(() => {
    if (prompt) {
      generateImage();
    }
  }, [prompt, generateImage]);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div className={`cloudflare-text-to-image ${className}`}>
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>جاري توليد الصورة...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={generateImage} className="retry-button">
            إعادة المحاولة
          </button>
        </div>
      )}

      {imageUrl && !loading && (
        <div className="image-container">
          <img src={imageUrl} alt="Generated" className="generated-image" />
        </div>
      )}

      {!loading && !error && !imageUrl && prompt && (
        <div className="empty-state">
          <p>لا توجد صورة</p>
        </div>
      )}
    </div>
  );
};

export default CloudflareTextToImage;


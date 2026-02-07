import React, { useState } from 'react';
import CartoonImageGenerator from '../components/js/CartoonImageGenerator.jsx';
import ImageCard from '../components/js/ImageCard.jsx';
import '../App.css';

const CartoonImagesPage = () => {
    const [images, setImages] = useState([]);
    const [generationInfo, setGenerationInfo] = useState(null);

    const handleImagesGenerated = (generatedImages, idea, numberOfImages, model) => {
        setImages(generatedImages);
        setGenerationInfo({
            idea,
            numberOfImages,
            model,
            timestamp: new Date().toLocaleString('ar-EG')
        });
    };

    return (
        <div className="page-container">
            <CartoonImageGenerator onImagesGenerated={handleImagesGenerated} />

            {images.length > 0 && (
                <div className="results-container">
                    <div className="cards-grid">
                        {images.map((image, index) => (
                            <ImageCard
                                key={index}
                                image={image}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartoonImagesPage;

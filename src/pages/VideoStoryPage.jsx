import React, { useState } from 'react';
import VideoStoryGenerator from '../components/js/VideoStoryGenerator.jsx';

const VideoStoryPage = () => {
    const [storyData, setStoryData] = useState(null);
    const [currentIdea, setCurrentIdea] = useState('');

    const handleStoryGenerated = (generatedStory, idea) => {
        setStoryData(generatedStory);
        setCurrentIdea(idea);

        // Firebase functionality skipped for now
        // TODO: Add Firebase integration later
    };

    return (
        <div className="video-story-page">
            <header className="app-header">
                <div className="header-content">
                    <h1>📖 مولد قصص الفيديو</h1>
                </div>
            </header>

            <main className="main-content">
                <div className="content-area">
                    <VideoStoryGenerator onStoryGenerated={handleStoryGenerated} />

                    {!storyData && (
                        <div className="empty-state">
                            <div className="empty-icon">📖</div>
                            <h3>ابدأ بإنشاء قصة فيديو</h3>
                            <p>أدخل فكرة القصة واختر عدد المشاهد المطلوبة</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="app-footer">
                <p>مولد قصص الفيديو بالذكاء الاصطناعي | Video Story Generator</p>
                <p>created by Keroles Monsef</p>
            </footer>
        </div>
    );
};

export default VideoStoryPage;

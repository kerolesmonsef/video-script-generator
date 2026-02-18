import React, { useState, useEffect } from 'react';
import { FaSave, FaCheck } from 'react-icons/fa';
import { success, fail, warning } from '../services/SwalHelper.js';
import { setConfig, getConfig } from '../services/firebaseService';
import Footer from '../components/js/Footer.jsx';
import '../components/css/SettingsPage.scss';

const SettingsPage = () => {
    const [openRouterToken, setOpenRouterToken] = useState('');
    const [chatanywhereToken, setChatanywhereToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingChatanywhere, setLoadingChatanywhere] = useState(false);
    const [saved, setSaved] = useState(false);
    const [savedChatanywhere, setSavedChatanywhere] = useState(false);

    useEffect(() => {
        const loadTokens = async () => {
            try {
                const openRouterTokenValue = await getConfig('openRouterToken');
                if (openRouterTokenValue) {
                    setOpenRouterToken(openRouterTokenValue);
                }

                const chatanywhereTokenValue = await getConfig('chatanywhereToken');
                if (chatanywhereTokenValue) {
                    setChatanywhereToken(chatanywhereTokenValue);
                }
            } catch (err) {
                console.error('Error loading tokens:', err);
                fail('Error', 'Failed to load tokens');
            }
        };

        loadTokens();
    }, []);

    const handleSave = async () => {
        if (!openRouterToken.trim()) {
            warning('Warning', 'Please enter a token');
            return;
        }

        setLoading(true);
        setSaved(false);

        try {
            await setConfig('openRouterToken', openRouterToken);
            setSaved(true);
            success('Success', 'Token saved successfully!');

            setTimeout(() => {
                setSaved(false);
            }, 3000);
        } catch (err) {
            fail('Error', err.message || 'Failed to save token');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChatanywhere = async () => {
        if (!chatanywhereToken.trim()) {
            warning('Warning', 'Please enter a token');
            return;
        }

        setLoadingChatanywhere(true);
        setSavedChatanywhere(false);

        try {
            await setConfig('chatanywhereToken', chatanywhereToken);
            setSavedChatanywhere(true);
            success('Success', 'ChatAnywhere token saved successfully!');

            setTimeout(() => {
                setSavedChatanywhere(false);
            }, 3000);
        } catch (err) {
            fail('Error', err.message || 'Failed to save token');
        } finally {
            setLoadingChatanywhere(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-container">
                <div className="settings-header">
                    <h1 className="settings-title">⚙️ Settings</h1>
                    <p className="settings-subtitle">Configure your application settings</p>
                </div>

                <div className="settings-content">
                    <div className="settings-section">
                        <h2 className="section-title">API Configuration</h2>

                        <div className="setting-item">
                            <label htmlFor="openRouterToken" className="setting-label">
                                OpenRouter API Token
                            </label>
                            <p className="setting-description">
                                Enter your OpenRouter API token to enable AI-powered features
                            </p>

                            <div className="input-group">
                                <input
                                    id="openRouterToken"
                                    type="password"
                                    className="setting-input"
                                    placeholder="sk-or-v1-..."
                                    value={openRouterToken}
                                    onChange={(e) => setOpenRouterToken(e.target.value)}
                                    disabled={loading}
                                />

                                <button
                                    className={`save-button ${saved ? 'saved' : ''}`}
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="loading-spinner"></span>
                                    ) : saved ? (
                                        <>
                                            <FaCheck />
                                            <span>Saved</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            <span>Save</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="setting-item">
                            <label htmlFor="chatanywhereToken" className="setting-label">
                                ChatAnywhere API Token
                            </label>
                            <p className="setting-description">
                                Enter your ChatAnywhere API token to enable additional AI models
                            </p>

                            <div className="input-group">
                                <input
                                    id="chatanywhereToken"
                                    type="password"
                                    className="setting-input"
                                    placeholder="sk-..."
                                    value={chatanywhereToken}
                                    onChange={(e) => setChatanywhereToken(e.target.value)}
                                    disabled={loadingChatanywhere}
                                />

                                <button
                                    className={`save-button ${savedChatanywhere ? 'saved' : ''}`}
                                    onClick={handleSaveChatanywhere}
                                    disabled={loadingChatanywhere}
                                >
                                    {loadingChatanywhere ? (
                                        <span className="loading-spinner"></span>
                                    ) : savedChatanywhere ? (
                                        <>
                                            <FaCheck />
                                            <span>Saved</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            <span>Save</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SettingsPage;

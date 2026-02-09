import React, { useState, useEffect } from 'react';
import { FaSave, FaCheck } from 'react-icons/fa';
import { setConfig, getConfig } from '../services/firebaseService';
import '../components/css/SettingsPage.scss';

const SettingsPage = () => {
    const [openRouterToken, setOpenRouterToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await getConfig('openRouterToken');
                if (token) {
                    setOpenRouterToken(token);
                }
            } catch (err) {
                console.error('Error loading token:', err);
            }
        };

        loadToken();
    }, []);

    const handleSave = async () => {
        if (!openRouterToken.trim()) {
            setError('Please enter a token');
            return;
        }

        setLoading(true);
        setError('');
        setSaved(false);

        try {
            await setConfig('openRouterToken', openRouterToken);
            setSaved(true);

            setTimeout(() => {
                setSaved(false);
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to save token');
        } finally {
            setLoading(false);
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

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            {saved && (
                                <div className="success-message">
                                    Token saved successfully!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

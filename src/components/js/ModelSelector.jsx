import React, { useState, useMemo, useEffect } from 'react';
import { FaRobot, FaServer } from 'react-icons/fa';
import { LLM_CONFIG, getAllProviders, getModelsForProvider } from '../../config/LLMConfig.js';

const ModelSelector = ({
    selectedProvider = LLM_CONFIG.defaultProvider,
    selectedModel,
    onProviderChange,
    onModelChange,
    disabled = false
}) => {
    const [providers] = useState(getAllProviders());
    const models = useMemo(() => getModelsForProvider(selectedProvider), [selectedProvider]);

    // Load saved values from localStorage on component mount
    useEffect(() => {
        const savedProvider = localStorage.getItem('llm_selectedProvider');
        const savedModel = localStorage.getItem('llm_selectedModel');

        if (savedProvider && savedProvider !== selectedProvider) {
            if (onProviderChange) {
                onProviderChange({ target: { value: savedProvider } });
            }
        }

        if (savedModel && savedModel !== selectedModel) {
            if (onModelChange) {
                onModelChange({ target: { value: savedModel } });
            }
        }
    }, []);

    useEffect(() => {
        if (selectedProvider) {
            localStorage.setItem('llm_selectedProvider', selectedProvider);
        }
    }, [selectedProvider]);

    useEffect(() => {
        if (selectedModel) {
            localStorage.setItem('llm_selectedModel', selectedModel);
        }
    }, [selectedModel]);

    const handleProviderChange = (e) => {
        const newProvider = e.target.value;
        const defaultModel = LLM_CONFIG.providers[newProvider].defaultModel;

        localStorage.setItem('llm_selectedProvider', newProvider);
        localStorage.setItem('llm_selectedModel', defaultModel);

        if (onProviderChange) {
            onProviderChange(e);
        }

        if (onModelChange) {
            onModelChange({ target: { value: defaultModel } });
        }
    };

    const handleModelChange = (e) => {
        const newModel = e.target.value;

        localStorage.setItem('llm_selectedModel', newModel);

        if (onModelChange) {
            onModelChange(e);
        }
    };

    return (
        <div className="row g-3">
            <div className="col-md-6">
                <label htmlFor="provider" className="form-label d-flex align-items-center gap-2 fw-semibold">
                    <FaServer className="text-primary" /> مزود الخدمة
                </label>
                <select
                    id="provider"
                    className="form-select"
                    value={selectedProvider}
                    onChange={handleProviderChange}
                    disabled={disabled}
                >
                    {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                            {provider.name}
                        </option>
                    ))}
                </select>
                <small className="form-text text-muted">اختر مزود الخدمة</small>
            </div>
            <div className="col-md-6">
                <label htmlFor="model" className="form-label d-flex align-items-center gap-2 fw-semibold">
                    <FaRobot className="text-primary" /> النموذج
                </label>
                <select
                    id="model"
                    className="form-select"
                    value={selectedModel}
                    onChange={handleModelChange}
                    disabled={disabled}
                >
                    {models.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.name}
                        </option>
                    ))}
                </select>
                <small className="form-text text-muted">
                    اختر النموذج من {LLM_CONFIG.providers[selectedProvider]?.name}
                </small>
            </div>
        </div>
    );
};

export default ModelSelector;

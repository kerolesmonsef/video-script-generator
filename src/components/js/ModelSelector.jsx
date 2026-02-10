import React, { useState, useEffect } from 'react';
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
    const [models, setModels] = useState([]);

    // Update models when provider changes
    useEffect(() => {
        const providerModels = getModelsForProvider(selectedProvider);
        setModels(providerModels);
    }, [selectedProvider]);

    const handleProviderChange = (e) => {
        const newProvider = e.target.value;
        const providerModels = getModelsForProvider(newProvider);

        const defaultModel = LLM_CONFIG.providers[newProvider].defaultModel;

        if (onProviderChange) {
            onProviderChange(e);
        }

        if (onModelChange) {
            onModelChange({ target: { value: defaultModel } });
        }
    };

    return (
        <div className="model-selector-container">
            {/* Provider Selector */}
            <div className="form-group mb-3">
                <label htmlFor="provider" className="form-label d-flex align-items-center gap-2 fw-semibold">
                    <FaServer className="text-primary" /> مزود الخدمة (Provider)
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
                <small className="form-text text-muted">اختر مزود خدمة الذكاء الاصطناعي</small>
            </div>

            {/* Model Selector */}
            <div className="form-group">
                <label htmlFor="model" className="form-label d-flex align-items-center gap-2 fw-semibold">
                    <FaRobot className="text-primary" /> نموذج الذكاء الاصطناعي
                </label>
                <select
                    id="model"
                    className="form-select"
                    value={selectedModel}
                    onChange={onModelChange}
                    disabled={disabled}
                >
                    {models.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.name}
                        </option>
                    ))}
                </select>
                <small className="form-text text-muted">
                    اختر النموذج المناسب من {LLM_CONFIG.providers[selectedProvider]?.name}
                </small>
            </div>
        </div>
    );
};

export default ModelSelector;

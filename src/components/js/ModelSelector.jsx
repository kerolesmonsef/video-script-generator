import React, { useState, useMemo } from 'react';
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

    const handleProviderChange = (e) => {
        const newProvider = e.target.value;
        const defaultModel = LLM_CONFIG.providers[newProvider].defaultModel;

        if (onProviderChange) {
            onProviderChange(e);
        }

        if (onModelChange) {
            onModelChange({ target: { value: defaultModel } });
        }
    };

    return (
        <div className="row g-3">
            {/* Provider Selector */}
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

            {/* Model Selector */}
            <div className="col-md-6">
                <label htmlFor="model" className="form-label d-flex align-items-center gap-2 fw-semibold">
                    <FaRobot className="text-primary" /> النموذج
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
                    اختر النموذج من {LLM_CONFIG.providers[selectedProvider]?.name}
                </small>
            </div>
        </div>
    );
};

export default ModelSelector;

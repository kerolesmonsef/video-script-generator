import React from 'react';
import { FaRobot } from 'react-icons/fa';
import { OPENROUTER_CONFIG } from '../../config/openRouterConfig.js';

const ModelSelector = ({ selectedModel, onChange, disabled = false }) => {
    return (
        <div className={"form-group"}>
            <label htmlFor="model" className="form-label d-flex align-items-center gap-2 fw-semibold">
                <FaRobot className="text-primary" /> نموذج الذكاء الاصطناعي
            </label>
            <select
                id="model"
                className="form-select"
                value={selectedModel}
                onChange={onChange}
                disabled={disabled}
            >
                {OPENROUTER_CONFIG.models.map((model) => (
                    <option key={model.id} value={model.id}>
                        {model.name}
                    </option>
                ))}
            </select>
            <small className="form-text text-muted">اختر النموذج المناسب</small>
        </div>
    );
};

export default ModelSelector;

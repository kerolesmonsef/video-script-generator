import React from 'react';
import { FaRobot } from 'react-icons/fa';
import { OPENROUTER_CONFIG } from '../../config/openRouterConfig.js';

const ModelSelector = ({ selectedModel, onChange, disabled = false }) => {
    return (
        <div className="form-group">
            <label htmlFor="model">
                <FaRobot /> نموذج الذكاء الاصطناعي
            </label>
            <select
                id="model"
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
            <small>اختر النموذج المناسب</small>
        </div>
    );
};

export default ModelSelector;

import React from 'react';
import '../css/DoneToggle.scss';

const DoneToggle = ({ isDone, onChange, disabled = false }) => {
    return (
        <div className="done-toggle-wrapper">
            <label className="done-toggle-container">
                <input
                    type="checkbox"
                    checked={isDone}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className="done-toggle-input"
                />
                <span className="done-toggle-slider"></span>
                <span className="done-toggle-label">
                    {isDone ? '✓ تم' : 'غير مكتمل'}
                </span>
            </label>
        </div>
    );
};

export default DoneToggle;


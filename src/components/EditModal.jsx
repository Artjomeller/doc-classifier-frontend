import React, { useState, useEffect } from 'react';
import { formatConfidence } from '../services/api';

const EditModal = ({ document, onClose, onSave }) => {
    const [classifications, setClassifications] = useState([]);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const availableLabels = [
        'Medical',
        'Legal',
        'Financial',
        'Administrative',
        'Regulatory',
        'Correspondence',
        'Monitoring',
        'Laboratory',
        'Business',
        'Miscellaneous',
        'Other'
    ];

    useEffect(() => {
        setClassifications([...document.classifications]);
    }, [document]);

    useEffect(() => {
        // Check if there are changes
        const hasChanged = JSON.stringify(classifications) !== JSON.stringify(document.classifications);
        setHasChanges(hasChanged);
    }, [classifications, document.classifications]);

    const handleLabelChange = (index, newLabel) => {
        const updated = [...classifications];
        updated[index] = { ...updated[index], label: newLabel };
        setClassifications(updated);
    };

    const handleScoreChange = (index, newScore) => {
        const updated = [...classifications];
        updated[index] = { ...updated[index], score: parseFloat(newScore) };

        // Normalize scores to sum to 1
        const totalScore = updated.reduce((sum, c) => sum + c.score, 0);
        if (totalScore > 0) {
            updated.forEach(c => c.score = c.score / totalScore);
        }

        setClassifications(updated);
    };

    const addClassification = () => {
        const newClassification = {
            label: availableLabels[0],
            score: 0.1
        };
        setClassifications([...classifications, newClassification]);
    };

    const removeClassification = (index) => {
        if (classifications.length > 1) {
            const updated = classifications.filter((_, i) => i !== index);
            setClassifications(updated);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Normalize scores to ensure they sum to 1
            const totalScore = classifications.reduce((sum, c) => sum + c.score, 0);
            const normalizedClassifications = classifications.map(c => ({
                ...c,
                score: totalScore > 0 ? c.score / totalScore : 0
            }));

            const success = await onSave(document.id, normalizedClassifications);
            if (!success) {
                setSaving(false);
            }
        } catch (error) {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    const totalScore = classifications.reduce((sum, c) => sum + c.score, 0);

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Edit Classification</h3>
                    <button className="close-button" onClick={handleCancel}>×</button>
                </div>

                <div className="modal-body">
                    <div className="document-info">
                        <h4>{document.document_name}</h4>
                        {document.manually_edited && (
                            <span className="edited-indicator">✏️ Previously edited</span>
                        )}
                    </div>

                    <div className="classifications-editor">
                        <h5>Classifications:</h5>

                        {classifications.map((classification, index) => (
                            <div key={index} className="classification-row">
                                <div className="classification-inputs">
                                    <div className="input-group">
                                        <label>Label:</label>
                                        <select
                                            value={classification.label}
                                            onChange={(e) => handleLabelChange(index, e.target.value)}
                                            className="label-select"
                                        >
                                            {availableLabels.map(label => (
                                                <option key={label} value={label}>{label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label>Confidence:</label>
                                        <select
                                            value={classification.score.toFixed(2)}
                                            onChange={(e) => handleScoreChange(index, e.target.value)}
                                            className="score-select"
                                        >
                                            <option value="0.05">5%</option>
                                            <option value="0.10">10%</option>
                                            <option value="0.15">15%</option>
                                            <option value="0.20">20%</option>
                                            <option value="0.25">25%</option>
                                            <option value="0.30">30%</option>
                                            <option value="0.35">35%</option>
                                            <option value="0.40">40%</option>
                                            <option value="0.45">45%</option>
                                            <option value="0.50">50%</option>
                                            <option value="0.55">55%</option>
                                            <option value="0.60">60%</option>
                                            <option value="0.65">65%</option>
                                            <option value="0.70">70%</option>
                                            <option value="0.75">75%</option>
                                            <option value="0.80">80%</option>
                                            <option value="0.85">85%</option>
                                            <option value="0.90">90%</option>
                                            <option value="0.95">95%</option>
                                        </select>
                                    </div>

                                    <div className="score-display">
                                        {formatConfidence(classification.score)}
                                    </div>

                                    {classifications.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeClassification(index)}
                                            className="remove-button"
                                            title="Remove classification"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addClassification}
                            className="add-button"
                        >
                            + Add Classification
                        </button>

                        <div className="score-summary">
                            <strong>Total Score: {formatConfidence(totalScore)}</strong>
                            {Math.abs(totalScore - 1) > 0.01 && (
                                <span className="warning"> (Scores will be normalized to 100%)</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="cancel-button"
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="save-button"
                        disabled={saving || !hasChanges}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
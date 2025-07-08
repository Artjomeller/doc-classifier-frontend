import React, { useState } from 'react';
import { getPrimaryClassification, isLowConfidence, formatConfidence } from '../services/api';

const ClassificationTable = ({ documents, onUpdateClassification }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedDocuments = () => {
        if (!sortConfig.key) return documents;

        return [...documents].sort((a, b) => {
            let aValue, bValue;

            switch (sortConfig.key) {
                case 'name':
                    aValue = a.document_name.toLowerCase();
                    bValue = b.document_name.toLowerCase();
                    break;
                case 'confidence':
                    aValue = getPrimaryClassification(a.classifications)?.score || 0;
                    bValue = getPrimaryClassification(b.classifications)?.score || 0;
                    break;
                case 'classification':
                    aValue = getPrimaryClassification(a.classifications)?.label || '';
                    bValue = getPrimaryClassification(b.classifications)?.label || '';
                    break;
                case 'edited':
                    aValue = a.manually_edited ? 1 : 0;
                    bValue = b.manually_edited ? 1 : 0;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const getSortIcon = (column) => {
        if (sortConfig.key !== column) return '↕️';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const getConfidenceColor = (score) => {
        if (score >= 0.8) return 'high';
        if (score >= 0.7) return 'medium';
        return 'low';
    };

    const getClassificationBadgeClass = (label) => {
        return label.toLowerCase().replace(/\s+/g, '-');
    };

    const formatClassificationsList = (classifications) => {
        return classifications
            .sort((a, b) => b.score - a.score)
            .map(c => `${c.label} (${formatConfidence(c.score)})`)
            .join(', ');
    };

    const handleEditClick = (document) => {
        // Placeholder - will implement modal later
        console.log('Edit clicked for:', document.document_name);
        alert(`Edit functionality coming soon!\nDocument: ${document.document_name}`);
    };

    const sortedDocuments = getSortedDocuments();

    if (documents.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>No documents found</h3>
                <p>Try adjusting your filters to see more documents.</p>
            </div>
        );
    }

    return (
        <div className="classification-table">
            <div className="table-header">
                <h2>Document Classifications</h2>
                <div className="table-info">
                    Showing {sortedDocuments.length} documents
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th
                            onClick={() => handleSort('name')}
                            className="sortable"
                        >
                            Document Name {getSortIcon('name')}
                        </th>
                        <th
                            onClick={() => handleSort('classification')}
                            className="sortable"
                        >
                            Primary Classification {getSortIcon('classification')}
                        </th>
                        <th
                            onClick={() => handleSort('confidence')}
                            className="sortable"
                        >
                            Confidence {getSortIcon('confidence')}
                        </th>
                        <th>All Classifications</th>
                        <th
                            onClick={() => handleSort('edited')}
                            className="sortable"
                        >
                            Status {getSortIcon('edited')}
                        </th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedDocuments.map((document) => {
                        const primaryClassification = getPrimaryClassification(document.classifications);
                        const lowConfidence = isLowConfidence(document.classifications);

                        return (
                            <tr
                                key={document.id}
                                className={`document-row ${lowConfidence ? 'low-confidence' : ''}`}
                            >
                                <td className="document-name">
                                    <div className="name-container">
                                        <span className="name">{document.document_name}</span>
                                        {lowConfidence && (
                                            <span
                                                className="low-confidence-indicator"
                                                title="Low confidence classification"
                                            >
                                                ⚠️
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td className="primary-classification">
                                    {primaryClassification && (
                                        <span className={`classification-badge ${getClassificationBadgeClass(primaryClassification.label)}`}>
                                            {primaryClassification.label}
                                        </span>
                                    )}
                                </td>

                                <td className="confidence">
                                    {primaryClassification && (
                                        <span className={`confidence-score ${getConfidenceColor(primaryClassification.score)}`}>
                                            {formatConfidence(primaryClassification.score)}
                                        </span>
                                    )}
                                </td>

                                <td className="all-classifications">
                                    <div className="classifications-list">
                                        {formatClassificationsList(document.classifications)}
                                    </div>
                                </td>

                                <td className="status">
                                    <div className="status-indicators">
                                        {document.manually_edited && (
                                            <span className="edited-badge" title="Manually edited">
                                                ✏️ Edited
                                            </span>
                                        )}
                                        <span
                                            className="timestamp"
                                            title={`Updated: ${new Date(document.updated_at).toLocaleString()}`}
                                        >
                                            {new Date(document.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </td>

                                <td className="actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEditClick(document)}
                                        title="Edit classification"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassificationTable;
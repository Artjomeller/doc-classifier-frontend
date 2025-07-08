import React, { useState, useEffect } from 'react';
import ClassificationTable from './components/ClassificationTable';
import FilterControls from './components/FilterControls';
import UndoNotification from './components/UndoNotification';
import { getClassifications, updateClassification, undoClassification } from './services/api';
import './App.css';

function App() {
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [undoNotification, setUndoNotification] = useState(null);  // NEW
    const [filters, setFilters] = useState({
        type: '',
        minConfidence: 0,
        maxConfidence: 1,
        showLowConfidence: false
    });

    // Load documents on component mount
    useEffect(() => {
        loadDocuments();
    }, []);

    // Apply filters when documents or filters change
    useEffect(() => {
        applyFilters();
    }, [documents, filters]);

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const response = await getClassifications();
            setDocuments(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load documents');
            console.error('Error loading documents:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...documents];

        // Filter by classification type
        if (filters.type) {
            filtered = filtered.filter(doc =>
                doc.classifications.some(c =>
                    c.label.toLowerCase().includes(filters.type.toLowerCase())
                )
            );
        }

        // Filter by confidence range
        filtered = filtered.filter(doc => {
            const maxScore = Math.max(...doc.classifications.map(c => c.score));
            return maxScore >= filters.minConfidence && maxScore <= filters.maxConfidence;
        });

        // Filter for low confidence documents
        if (filters.showLowConfidence) {
            filtered = filtered.filter(doc => {
                const maxScore = Math.max(...doc.classifications.map(c => c.score));
                return maxScore < 0.7;
            });
        }

        setFilteredDocuments(filtered);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // UPDATED: Handle update with undo support
    const handleUpdateClassification = async (documentId, newClassifications) => {
        try {
            const updatedDoc = await updateClassification(documentId, {
                classifications: newClassifications
            });

            // Update local state
            setDocuments(prev =>
                prev.map(doc =>
                    doc.id === documentId ? updatedDoc.data : doc
                )
            );

            // NEW: Show undo notification if backend supports it
            if (updatedDoc.canUndo) {
                const document = documents.find(d => d.id === documentId);
                setUndoNotification({
                    documentId,
                    documentName: document?.document_name || 'Document',
                    timestamp: Date.now()
                });
            }

            return true;
        } catch (err) {
            console.error('Error updating classification:', err);
            setError('Failed to update classification');
            return false;
        }
    };

    // NEW: Handle undo
    const handleUndo = async () => {
        if (!undoNotification) return;

        try {
            const undoResult = await undoClassification(undoNotification.documentId);

            // Update local state with undone data
            setDocuments(prev =>
                prev.map(doc =>
                    doc.id === undoNotification.documentId ? undoResult.data : doc
                )
            );

            setUndoNotification(null);
            setError(null);
        } catch (err) {
            console.error('Error undoing changes:', err);
            setError('Failed to undo changes: ' + err.message);
        }
    };

    // NEW: Handle dismiss undo
    const handleDismissUndo = () => {
        setUndoNotification(null);
    };

    const getLowConfidenceCount = () => {
        return documents.filter(doc => {
            const maxScore = Math.max(...doc.classifications.map(c => c.score));
            return maxScore < 0.7;
        }).length;
    };

    if (loading) {
        return (
            <div className="app">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading documents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>Document Classifier Dashboard</h1>
                <div className="stats">
                    <span className="stat">
                        <strong>{documents.length}</strong> Total Documents
                    </span>
                    <span className="stat">
                        <strong>{getLowConfidenceCount()}</strong> Low Confidence
                    </span>
                    <span className="stat">
                        <strong>{documents.filter(d => d.manually_edited).length}</strong> Manually Edited
                    </span>
                </div>
            </header>

            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            <main className="app-main">
                <FilterControls
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    totalCount={documents.length}
                    filteredCount={filteredDocuments.length}
                />

                <ClassificationTable
                    documents={filteredDocuments}
                    onUpdateClassification={handleUpdateClassification}
                />
            </main>

            {/* NEW: Undo notification */}
            {undoNotification && (
                <UndoNotification
                    documentName={undoNotification.documentName}
                    onUndo={handleUndo}
                    onDismiss={handleDismissUndo}
                    duration={30000}
                />
            )}
        </div>
    );
}

export default App;
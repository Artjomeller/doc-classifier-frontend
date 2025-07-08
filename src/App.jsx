import React, { useState, useEffect } from 'react';
import ClassificationTable from './components/ClassificationTable';
import { getClassifications, updateClassification } from './services/api';
import './App.css';

function App() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load documents on component mount
    useEffect(() => {
        loadDocuments();
    }, []);

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

            return true;
        } catch (err) {
            console.error('Error updating classification:', err);
            setError('Failed to update classification');
            return false;
        }
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
                <ClassificationTable
                    documents={documents}
                    onUpdateClassification={handleUpdateClassification}
                />
            </main>
        </div>
    );
}

export default App;
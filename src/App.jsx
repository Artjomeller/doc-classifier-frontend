import React, { useState, useEffect } from 'react';
import { getClassifications, healthCheck } from './services/api';
import './App.css';

function App() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [healthStatus, setHealthStatus] = useState(null);

    // Test API connection on component mount
    useEffect(() => {
        testAPIConnection();
        loadDocuments();
    }, []);

    const testAPIConnection = async () => {
        try {
            const health = await healthCheck();
            setHealthStatus(health);
            console.log('✅ Backend connection successful:', health);
        } catch (err) {
            console.error('❌ Backend connection failed:', err);
            setError('Failed to connect to backend server');
        }
    };

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const response = await getClassifications();
            setDocuments(response.data);
            setError(null);
            console.log('📄 Loaded documents:', response.data.length);
        } catch (err) {
            setError('Failed to load documents');
            console.error('Error loading documents:', err);
        } finally {
            setLoading(false);
        }
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
                {healthStatus && (
                    <div className="health-status">
                        <p>✅ Backend: {healthStatus.status} | Documents: {healthStatus.documents_count}</p>
                    </div>
                )}
            </header>

            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            <main className="app-main">
                <div className="documents-preview">
                    <h2>Loaded Documents ({documents.length})</h2>

                    {documents.length === 0 ? (
                        <p>No documents found.</p>
                    ) : (
                        <div className="documents-list">
                            {documents.slice(0, 5).map((doc) => (
                                <div key={doc.id} className="document-item">
                                    <h3>{doc.document_name}</h3>
                                    <p>Primary: {doc.classifications[0]?.label} ({(doc.classifications[0]?.score * 100).toFixed(1)}%)</p>
                                    <p>Status: {doc.manually_edited ? '✏️ Edited' : '🤖 Original'}</p>
                                </div>
                            ))}
                            {documents.length > 5 && (
                                <p>... and {documents.length - 5} more documents</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="next-steps">
                    <h3>🚧 Development Status</h3>
                    <ul>
                        <li>✅ Backend API connection</li>
                        <li>✅ Data loading</li>
                        <li>🚧 Table component (next)</li>
                        <li>🚧 Filter controls (next)</li>
                        <li>🚧 Edit modal (next)</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default App;
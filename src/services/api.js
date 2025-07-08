import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// API Functions

/**
 * Get all classifications with optional filtering and pagination
 */
export const getClassifications = async (params = {}) => {
    try {
        const response = await api.get('/classifications', { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch classifications');
    }
};

/**
 * Update a classification
 */
export const updateClassification = async (id, updates) => {
    try {
        const response = await api.patch(`/classifications/${id}`, updates);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update classification');
    }
};

/**
 * Health check
 */
export const healthCheck = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        throw new Error('Health check failed');
    }
};

// Utility functions

/**
 * Get the primary classification (highest score) for a document
 */
export const getPrimaryClassification = (classifications) => {
    if (!classifications || classifications.length === 0) return null;
    return classifications.reduce((max, current) =>
        current.score > max.score ? current : max
    );
};

/**
 * Check if a document has low confidence (primary classification < 0.7)
 */
export const isLowConfidence = (classifications) => {
    const primary = getPrimaryClassification(classifications);
    return primary ? primary.score < 0.7 : false;
};

/**
 * Format confidence score as percentage
 */
export const formatConfidence = (score) => {
    return `${(score * 100).toFixed(1)}%`;
};

export default api;
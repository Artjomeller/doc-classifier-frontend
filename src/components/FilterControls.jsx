import React, { useState, useEffect } from 'react';

const FilterControls = ({ filters, onFilterChange, totalCount, filteredCount }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleInputChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters = {
            type: '',
            minConfidence: 0,
            maxConfidence: 1,
            showLowConfidence: false
        };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    const hasActiveFilters = () => {
        return localFilters.type ||
            localFilters.minConfidence > 0 ||
            localFilters.maxConfidence < 1 ||
            localFilters.showLowConfidence;
    };

    const classificationTypes = [
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

    // Confidence options (0% to 100% in 10% steps)
    const confidenceOptions = [
        { value: 0, label: '0%' },
        { value: 0.1, label: '10%' },
        { value: 0.2, label: '20%' },
        { value: 0.3, label: '30%' },
        { value: 0.4, label: '40%' },
        { value: 0.5, label: '50%' },
        { value: 0.6, label: '60%' },
        { value: 0.7, label: '70%' },
        { value: 0.8, label: '80%' },
        { value: 0.9, label: '90%' },
        { value: 1, label: '100%' }
    ];

    return (
        <div className="filter-controls">
            <div className="filter-header">
                <h3>Filters</h3>
                <div className="filter-results">
                    Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> documents
                    {hasActiveFilters() && (
                        <button
                            className="reset-button"
                            onClick={handleReset}
                            title="Clear all filters"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>

            <div className="filter-row">
                <div className="filter-group">
                    <label htmlFor="type-filter">Classification Type:</label>
                    <select
                        id="type-filter"
                        value={localFilters.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                        <option value="">All Types</option>
                        {classificationTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="min-confidence">Min Confidence:</label>
                    <select
                        id="min-confidence"
                        value={localFilters.minConfidence}
                        onChange={(e) => handleInputChange('minConfidence', parseFloat(e.target.value))}
                    >
                        {confidenceOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="max-confidence">Max Confidence:</label>
                    <select
                        id="max-confidence"
                        value={localFilters.maxConfidence}
                        onChange={(e) => handleInputChange('maxConfidence', parseFloat(e.target.value))}
                    >
                        {confidenceOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={localFilters.showLowConfidence}
                            onChange={(e) => handleInputChange('showLowConfidence', e.target.checked)}
                        />
                        Show only low confidence (&lt; 70%)
                    </label>
                </div>
            </div>
        </div>
    );
};

export default FilterControls;
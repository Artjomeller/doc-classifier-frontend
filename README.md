# Document Classifier Dashboard - Frontend

Interactive React application for exploring and managing AI document classifications with confidence scores.

## Overview

This frontend application provides an intuitive interface for viewing, filtering, and editing document classifications produced by an AI system. Built as part of a full-stack coding challenge, it demonstrates modern React development practices and responsive design principles.

## Features

### Core Functionality
- **Document Table** with sortable columns (name, classification, confidence, status)
- **Real-time Filtering** by classification type and confidence range
- **Inline Editing** with modal interface for classification adjustments
- **Low Confidence Highlighting** for documents with scores < 70%
- **Manual Edit Tracking** with visual indicators

### Technical Highlights
- **Responsive Design** optimized for desktop, tablet, and mobile
- **Score Normalization** ensuring classification totals equal 100%
- **Stable Layout** with no shifting during filter interactions
- **Professional UI** with modern styling and accessibility features

## Tech Stack

- **React 18** with functional components and hooks
- **Vite** for fast development and optimized builds
- **Axios** for API communication
- **Custom CSS** with responsive grid layouts

## Quick Start

### Prerequisites
- Node.js 16+
- Running backend API on `http://localhost:3002`

### Setup
```bash
# Clone and install
git clone https://github.com/Artjomeller/doc-classifier-frontend.git
cd doc-classifier-frontend
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5174` to view the application.

### Backend Connection
This frontend connects to the companion backend API:
```bash
git clone https://github.com/Artjomeller/doc-classifier-backend.git
cd doc-classifier-backend
npm install && npm run dev
```

## Architecture

### Component Structure
```
src/
├── App.jsx                 # Main application with state management
├── components/
│   ├── ClassificationTable.jsx  # Document table with sorting
│   ├── FilterControls.jsx       # Filter interface
│   └── EditModal.jsx           # Classification editing modal
├── services/
│   └── api.js              # API client and utilities
└── App.css                 # Responsive styling
```

### Data Flow
1. **App.jsx** manages global state and coordinates between components
2. **FilterControls** applies real-time filtering to document list
3. **ClassificationTable** displays data with inline edit capabilities
4. **EditModal** handles classification updates with score normalization

## API Integration

Connects to backend endpoints:
- `GET /classifications` - Retrieve documents with filtering
- `PATCH /classifications/:id` - Update document classifications
- `GET /health` - Backend connectivity check

## Responsive Design

- **Desktop (1200px+)**: Full feature layout with 4-column filters
- **Tablet (768-1200px)**: Compact 2-column filter layout
- **Mobile (<768px)**: Single-column stack with horizontal table scroll
- **Portrait 24"**: Optimized layout for rotated monitors

## Key Design Decisions

### User Experience
- **Dropdown filters** instead of sliders for stable layout
- **Confirmation dialogs** for unsaved changes
- **Visual feedback** for low confidence classifications
- **Inline editing** without page navigation

### Technical Choices
- **In-memory state** for fast filtering and sorting
- **CSS Grid** for responsive filter layouts
- **Fixed table layout** for consistent column widths
- **Score normalization** maintains data integrity

## Development Scripts

```bash
npm run dev      # Development server with hot reload
npm run build    # Production build
npm run preview  # Preview production build
```

## Deployment

### Production Build
```bash
npm run build
```

### Environment Configuration
Update API URL in `src/services/api.js` for production:
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3002';
```

## Browser Support

Modern browsers with ES6+ support (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+).

## Project Structure

This is the frontend component of a full-stack document classification system:
- **Backend**: Express.js API with in-memory storage
- **Frontend**: React SPA with responsive design
- **Integration**: RESTful API communication with error handling

Built as a coding challenge to demonstrate:
- Clean, maintainable code architecture
- Modern React development practices
- Responsive design implementation
- Professional UI/UX design
- Full-stack integration capabilities

---

**Time Investment**: ~3-4 hours development time as specified in original requirements.
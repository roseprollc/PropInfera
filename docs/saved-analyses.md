# Saved Analyses System

## Overview

The Saved Analyses System is a core feature of PropInfera that enables users to save, view, edit, and manage their property investment analyses. This document provides a comprehensive technical overview of the system's architecture, implementation, and usage patterns.

### Purpose
- Enable users to save and manage property analyses
- Provide quick access to historical calculations
- Support analysis editing and insights generation
- Facilitate data export and sharing

### Scope
- CRUD operations for saved analyses
- Search and filtering capabilities
- Analysis detail viewing
- PDF export functionality
- GPT-powered insights generation
- Caching and optimization

### User Journey
1. User completes calculator analysis
2. Analysis is saved to MongoDB
3. User can view, edit, or export analysis
4. GPT insights can be generated
5. Analyses can be searched and filtered

## Architecture

### Frontend Layer
**File:** `/app/dashboard/saved/page.tsx`

#### Components
1. `SavedAnalysesList.tsx`
   - List view with search and filters
   - Loading and error states
   - Action buttons (view, edit, delete)

2. `ViewAnalysisPage.tsx`
   - Detailed analysis view
   - Results summary
   - Insights panel
   - Export options

3. `EditAnalysisPage.tsx`
   - Form for editing analysis
   - Input validation
   - Save/cancel actions

### Protocol Layer
**File:** `/lib/data.ts`

#### Functions
```typescript
// Fetch user's analyses
getSavedAnalyses(): Promise<Analysis[]>

// Get single analysis
getAnalysisById(id: string): Promise<Analysis | null>

// Update analysis
updateAnalysisById(
  id: string,
  data: Partial<Analysis>
): Promise<void>

// Delete analysis
deleteAnalysisById(id: string): Promise<void>
```

### API Layer
**File:** `/app/api/analyses/route.ts`

#### Endpoints
1. `GET /api/analyses`
   - Returns user's analyses
   - Supports search and filters

2. `GET /api/analyses/[id]`
   - Returns single analysis
   - Includes insights if available

3. `PUT /api/analyses/[id]`
   - Updates analysis data
   - Validates input

4. `DELETE /api/analyses/[id]`
   - Removes analysis
   - Cleans up related data

## Features

### Search and Filter
```typescript
interface SearchFilters {
  query?: string;
  type?: AnalysisType;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}
```

#### Search Fields
- Property name
- Address
- Notes
- Analysis type

#### Filter Options
- Rental
- Airbnb
- Wholesale
- Mortgage

### Analysis Management
1. View Details
   - Formatted inputs
   - Calculated results
   - Generated insights
   - Export options

2. Edit Analysis
   - Update metadata
   - Modify inputs
   - Regenerate results
   - Save changes

3. Export Options
   - PDF generation
   - Data download
   - Share functionality

## Components

### SavedAnalysesList
**File:** `/components/dashboard/SavedAnalysesList.tsx`

#### Features
- Responsive grid layout
- Search input with debounce
- Type filter dropdown
- Loading skeleton
- Empty state handling
- Error state display

#### Props Interface
```typescript
interface SavedAnalysesListProps {
  analyses: Analysis[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => Promise<void>;
}
```

### ResultsSummary
**File:** `/components/results/ResultsSummary.tsx`

#### Features
- Responsive metric grid
- Highlighted KPIs
- Formatted values
- Loading states

#### Props Interface
```typescript
interface ResultsSummaryProps {
  results: Record<string, number>;
  highlightKeys?: string[];
  isLoading?: boolean;
}
```

### EditAnalysisForm
**File:** `/components/dashboard/EditAnalysisForm.tsx`

#### Features
- Form validation
- Loading states
- Error handling
- Save/cancel actions

#### Props Interface
```typescript
interface EditAnalysisFormProps {
  analysis: Analysis;
  onSave: (data: Partial<Analysis>) => Promise<void>;
  onCancel: () => void;
}
```

## Data Model

### MongoDB Schema
```typescript
interface Analysis {
  _id: ObjectId;
  userId: string;
  type: 'rental' | 'airbnb' | 'wholesale' | 'mortgage';
  title: string;
  address: string;
  notes?: string;
  inputs: Record<string, any>;
  results: Record<string, number>;
  insights?: string;
  insightsLastGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Indexes
```typescript
// Compound index for efficient querying
{
  userId: 1,
  type: 1,
  createdAt: -1
}

// Text index for search
{
  title: 'text',
  address: 'text',
  notes: 'text'
}
```

## Error Handling

### API Layer
| Error Type | Status Code | Handling |
|------------|-------------|----------|
| Invalid ID | 400 | Return error message |
| Not Found | 404 | Show "Analysis not found" |
| Auth Error | 401 | Redirect to login |
| Server Error | 500 | Show generic error |

### Frontend Layer
| Error Type | Handling |
|------------|----------|
| Fetch Failed | Show toast + retry |
| Invalid Data | Display error state |
| Save Failed | Show error + keep form |

## Future Enhancements

### Performance
1. Pagination
   - Implement cursor-based pagination
   - Add infinite scroll
   - Optimize initial load

2. Caching
   - Add Redis layer
   - Implement stale-while-revalidate
   - Cache invalidation strategy

### Features
1. Advanced Filtering
   - Date range filters
   - ROI thresholds
   - Custom tags

2. Export Options
   - Batch export
   - Multiple formats
   - Scheduled exports

3. Admin Tools
   - Bulk operations
   - Analytics dashboard
   - User management

## Development Guidelines

### Best Practices
1. Data Handling
   - Validate all input/output
   - Sanitize user data
   - Handle edge cases

2. Performance
   - Memoize components
   - Optimize queries
   - Implement caching

3. Security
   - Validate user ownership
   - Sanitize MongoDB queries
   - Handle sensitive data

### Testing
1. Unit Tests
   - Component rendering
   - Form validation
   - API handlers

2. Integration Tests
   - CRUD operations
   - Search/filter logic
   - Error handling

3. E2E Tests
   - User workflows
   - Error scenarios
   - Performance metrics

## Monitoring

### Metrics
1. Performance
   - API response times
   - MongoDB query times
   - Frontend render times

2. Usage
   - Analysis creation rate
   - Search patterns
   - Export frequency

3. Errors
   - API error rates
   - Validation failures
   - User-reported issues 
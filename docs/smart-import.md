# Smart Import System

## Overview

The Smart Import System is a feature that enables users to quickly import property data into PropInfera's calculators using a Redfin URL. This document provides a detailed technical overview of the system's architecture, implementation, and usage patterns.

### Purpose
- Enable quick property data import via Redfin URLs
- Streamline calculator input population
- Provide a foundation for future import integrations
- Maintain data consistency across the application

### Scope
- Frontend form implementation and validation
- Session storage management
- Data prefill logic
- Mock API structure
- Error handling and user feedback

### Target Audience
- Developers extending import functionality
- Product managers planning feature enhancements
- Technical stakeholders reviewing system architecture

## Architecture

### Frontend Layer
**File:** `/app/import/page.tsx`

#### Form Implementation
```typescript
interface ImportFormData {
  redfinUrl: string;
}
```

#### Validation Rules
- URL must contain 'redfin.com'
- Must be valid HTTP/HTTPS URL
- Basic structure validation
- Error handling for invalid formats

#### Submit Flow
1. Validate URL format
2. Call mock import logic
3. Format property data
4. Store in sessionStorage
5. Redirect to calculator

### Data Flow
```mermaid
graph LR
    A[Redfin URL] --> B[Validation]
    B --> C[Mock Import]
    C --> D[Session Storage]
    D --> E[Calculator Prefill]
```

### Session Storage Structure
```typescript
interface ImportedProperty {
  propertyAddress: string;
  purchasePrice: number;
  monthlyRent: number;
  // ... other calculator inputs
}
```

#### Storage Logic
- Key: `importedProperty`
- Location: `window.sessionStorage`
- Lifecycle:
  1. Set on successful import
  2. Read on calculator page load
  3. Clear after prefill
  4. Handle corruption gracefully

## Components

### Import Form
**File:** `/components/forms/ImportPropertyForm.tsx`

#### Features
- URL input with validation
- Loading state handling
- Error message display
- Success redirection

#### Props Interface
```typescript
interface ImportPropertyFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}
```

### Calculator Integration
**File:** `/app/renters/page.tsx`

#### Prefill Logic
1. Check for `importedProperty` in sessionStorage
2. Parse and validate data
3. Update calculator context
4. Clear sessionStorage
5. Handle errors gracefully

## Error Handling

### Validation Errors
| Error Type | Handling |
|------------|----------|
| Invalid URL | Show toast + clear input |
| Network Error | Display error message |
| Parse Error | Skip import gracefully |

### Session Storage Errors
| Error Type | Handling |
|------------|----------|
| Corrupt Data | Skip import + console warn |
| Storage Full | Clear old data + retry |
| Not Available | Fallback to manual input |

## Future Enhancements

### API Integration
1. Redfin Scraping
   - Puppeteer/Playwright implementation
   - Serverless function deployment
   - Rate limiting and caching

2. Additional Sources
   - Zillow integration
   - Realtor.com support
   - Custom API endpoints

### Smart Features
1. Field Mapping
   - Auto-detect property type
   - Map fields accordingly
   - Handle missing data

2. Import History
   - Save successful imports
   - Quick reuse functionality
   - Import templates

### Admin Tools
1. Debugging
   - Import failure logs
   - Data validation reports
   - Performance metrics

2. Monitoring
   - Success/failure rates
   - Common error patterns
   - User feedback collection

## Development Guidelines

### Best Practices
1. Data Handling
   - Validate all imported data
   - Sanitize user inputs
   - Handle edge cases

2. Performance
   - Minimize storage usage
   - Optimize validation
   - Cache where appropriate

3. Security
   - Sanitize URLs
   - Validate data structure
   - Handle sensitive data

### Testing
1. Unit Tests
   - URL validation
   - Data parsing
   - Storage operations

2. Integration Tests
   - Form submission
   - Calculator prefill
   - Error handling

3. E2E Tests
   - Complete import flow
   - Error scenarios
   - Edge cases

## Troubleshooting

### Common Issues
1. Import Fails
   - Check URL format
   - Verify network connection
   - Clear session storage

2. Data Not Prefilled
   - Verify storage key
   - Check data structure
   - Clear and retry

3. Calculator Errors
   - Validate data types
   - Check required fields
   - Reset calculator state

### Debug Tools
1. Console Logs
   - Import process steps
   - Data validation results
   - Storage operations

2. Development Mode
   - Mock data injection
   - Error simulation
   - Performance profiling 
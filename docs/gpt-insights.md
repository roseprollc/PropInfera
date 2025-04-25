# GPT-Powered Insights System

## Overview

The GPT-Powered Insights system is a sophisticated feature that leverages OpenAI's GPT-4 Turbo to generate intelligent investment insights from property analysis data. This document provides a comprehensive overview of the system's architecture, implementation, and usage across all layers of the PropInfera application.

### Purpose
- Generate AI-powered investment insights from property analysis data
- Provide users with intelligent, contextual analysis of their investment metrics
- Cache and persist insights for efficient retrieval
- Offer a seamless user experience with real-time generation and error handling

### Scope
- Backend GPT integration and prompt engineering
- API route implementation with rate limiting and caching
- Frontend component integration and state management
- User experience design and error handling
- Data persistence and retrieval

### Target Audience
- Developers working on the PropInfera platform
- Product managers planning feature enhancements
- Technical stakeholders reviewing system architecture

## Architecture

### Protocol Layer
**File:** `/lib/gpt/generateInsights.ts`

#### Functionality
- Connects to OpenAI API using GPT-4 Turbo model
- Accepts complete analysis data including:
  - Property metadata (title, type, address)
  - Input parameters (purchase price, rates, etc.)
  - Calculated results (ROI, cash flow, etc.)
- Crafts structured prompts for investment analysis
- Returns Markdown-formatted insights

#### Error Handling
- Graceful fallback to default message on GPT failure
- Detailed error logging to server console
- Type-safe response handling

### API Layer
**File:** `/app/api/insights/route.ts`

#### Functionality
- POST-only endpoint for insights generation
- Request validation:
  - Required analysis ID
  - Optional refresh parameter
- Rate limiting (10 seconds per IP)
- Caching support with refresh option

#### Response Format
```typescript
{
  insights: string;          // Markdown-formatted insights
  lastGeneratedAt?: string;  // ISO timestamp
  error?: string;           // Error message if applicable
}
```

#### Error Handling
- 400: Invalid request parameters
- 404: Analysis not found
- 429: Rate limit exceeded
- 500: Server error
- Meaningful error messages for each case

### Data Layer
**File:** `/lib/data.ts`

#### Functions
```typescript
// Fetch analysis by ID
getAnalysisById(id: string): Promise<Analysis | null>

// Update insights for an analysis
updateInsightsById(
  id: string,
  insights: string,
  lastGeneratedAt: string
): Promise<void>
```

#### MongoDB Schema Extension
```typescript
interface Analysis {
  // ... existing fields ...
  insights?: string;
  insightsLastGeneratedAt?: string;
}
```

### Frontend Integration
**File:** `/components/dashboard/InsightsPanel.tsx`

#### Features
- Generate insights button with loading state
- Session storage caching
- Collapsible panel with smooth animations
- Markdown rendering using react-markdown
- Copy to clipboard functionality
- Regenerate insights option
- Last updated timestamp display

#### Props Interface
```typescript
interface InsightsPanelProps {
  analysisId: string;
  initialInsights?: string;
  lastGeneratedAt?: string;
}
```

#### Styling
- Dark theme with `bg-[#111]` background
- White text with `text-white`
- Green accents using `#2ecc71`
- Accessible button states and focus indicators
- Responsive layout for all screen sizes

## Usage Flow

1. User Interaction:
   - User clicks "Generate Insights" button
   - Loading spinner appears
   - Panel expands to show results

2. API Request:
   - Frontend POSTs to `/api/insights` with analysis ID
   - Optional `?refresh=true` for regeneration
   - Rate limiting checks performed

3. Backend Processing:
   - Validates request and analysis ID
   - Fetches analysis data from MongoDB
   - Calls GPT-4 Turbo for insights
   - Updates MongoDB with new insights
   - Returns formatted response

4. Frontend Display:
   - Renders Markdown-formatted insights
   - Updates last generated timestamp
   - Enables copy and refresh options
   - Handles errors with toast notifications

## Error Handling

### API Layer
| Error Type | Status Code | Handling |
|------------|-------------|----------|
| Invalid ID | 400 | Return error message |
| Not Found | 404 | Show "Analysis not found" |
| Rate Limit | 429 | Display retry timer |
| Server Error | 500 | Show generic error |

### GPT Layer
| Error Type | Handling |
|------------|----------|
| Timeout | Return fallback message |
| API Error | Log error, return fallback |
| Invalid Response | Validate and sanitize |

### Frontend Layer
| Error Type | Handling |
|------------|----------|
| Fetch Failed | Show toast + retry button |
| Invalid Data | Display error state |
| Network Error | Offline message |

## Future Enhancements

1. Caching Improvements
   - Implement Redis for distributed caching
   - Add cache invalidation strategies
   - Support partial updates

2. Analytics Integration
   - Track insight generation metrics
   - Monitor GPT usage and costs
   - User engagement analytics

3. UI Enhancements
   - Add insight categories/tags
   - Implement insight sharing
   - Support custom prompts

4. Performance Optimization
   - Implement request batching
   - Add background generation
   - Optimize markdown rendering

## Development Guidelines

1. Testing
   - Unit tests for GPT prompt generation
   - API route integration tests
   - Frontend component tests
   - Error handling test cases

2. Monitoring
   - Log GPT API usage
   - Track error rates
   - Monitor response times

3. Security
   - Validate all user input
   - Sanitize GPT responses
   - Implement proper rate limiting
   - Secure API keys and credentials 
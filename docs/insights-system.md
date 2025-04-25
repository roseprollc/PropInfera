# GPT-Powered Insights Architecture & Usage

## Overview

The GPT-Powered Insights system provides AI-generated analysis of real estate investment properties in PropInfera. It leverages OpenAI's GPT-4 Turbo model to generate detailed, actionable insights based on property analysis data.

### Purpose
- Generate contextual insights for saved property analyses
- Provide investors with AI-powered perspectives on their investments
- Cache insights to reduce API calls and improve performance
- Support regeneration of insights with updated data

### Scope
- Server-side GPT integration
- MongoDB caching and persistence
- Frontend display and interaction
- Error handling and fallbacks

## Architecture (MCP-Aligned)

### Protocol Layer
**File:** `/lib/ai/generateInsights.ts`

```typescript
export async function generateInsights(analysis: Analysis): Promise<string>
```

**Input:** Full Analysis object containing property details and analysis results

**Output:** Markdown-formatted insights (3-5 bullet points)

**Model:** GPT-4 Turbo

**Key Features:**
- Uses OpenAI SDK with OPENAI_API_KEY
- Structured prompt engineering
- Graceful error handling
- Detailed logging

### Data Layer
**File:** `/lib/data.ts`

```typescript
export async function updateInsightsById(id: string, insights: string): Promise<boolean>
```

**Behavior:**
- Saves generated insights to MongoDB
- Updates `insights` and `insightsUpdatedAt` fields
- Returns success/failure status
- Includes error handling and validation

### API Layer
**File:** `/app/api/insights/route.ts`

**Method:** POST

**Request Body:**
```typescript
{
  id: string;
  refresh?: boolean;
}
```

**Response:**
```typescript
{
  insights: string;
  cached: boolean;
  updatedAt: string;
}
```

**Behavior:**
- Returns cached insights if available and refresh=false
- Regenerates insights if refresh=true or no cache exists
- Includes rate limiting (10s per IP)
- Handles all error cases with appropriate status codes

## Frontend Integration

### InsightsPanel Component
**File:** `/components/dashboard/InsightsPanel.tsx`

**Features:**
- Client-side component with "use client" directive
- Handles loading, error, and success states
- Supports regeneration of insights
- Displays formatted markdown
- Includes copy to clipboard functionality

**Props:**
```typescript
interface InsightsPanelProps {
  analysisId: string;
  initialInsights?: string;
  initialUpdatedAt?: string;
}
```

## Styling & UX

### Theme
- Background: `bg-[#111]`
- Text: `text-white`
- Accent: `text-green-400`
- Error: `text-red-400`

### Markdown Styling
- Bullets: Custom styled with green accent
- Headings: Semibold with proper spacing
- Lists: Proper indentation and spacing

### UI Components
- Expandable/collapsible section
- Copy to clipboard button
- Regenerate button with loading state
- Last updated timestamp
- Toast notifications for actions

### Error States
- Rate limit exceeded
- API errors
- Network issues
- Invalid analysis ID

## Usage Flow

1. User views saved analysis
2. System checks for cached insights
3. If cached:
   - Display immediately
   - Show "Last Updated" timestamp
4. If not cached:
   - Show loading state
   - Generate new insights
   - Cache in MongoDB
   - Display results
5. User can:
   - Copy insights to clipboard
   - Regenerate with latest model
   - Expand/collapse section

## Error Handling

### API Errors
- 400: Invalid request
- 404: Analysis not found
- 429: Rate limit exceeded
- 500: Server error

### Frontend Errors
- Network issues
- Invalid data
- GPT generation failures

## Future Enhancements

1. Versioning of insights
2. Multiple prompt styles
3. Analytics tracking
4. Batch regeneration
5. Custom prompt templates 
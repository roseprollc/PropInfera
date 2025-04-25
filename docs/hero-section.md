# Hero Section Component

## Overview
The Hero Section is a full-screen landing page component that serves as the main entry point for PropInfera. It features a tier-aware design that adapts its content based on the user's subscription level.

## Features
- Full-screen height with centered content
- Tier-aware button text
- Smooth scroll functionality
- Responsive design
- Techno theme with neon green accents

## Tier Integration
The component uses the `TierContext` to determine the user's subscription level and adjust the UI accordingly:

- **Free Tier**: Shows "Try Free Tool" button
- **Pro/Elite Tier**: Shows "Launch Smart Import" button

## Styling Decisions
1. **Color Scheme**:
   - Black background for contrast
   - Neon green accents for the techno theme
   - Slate gray for secondary text

2. **Typography**:
   - Large, bold title
   - Responsive text sizing
   - Clear hierarchy

3. **Interactive Elements**:
   - Hover effects with scale transform
   - Neon green glow on hover
   - Smooth transitions
   - Focus states for accessibility

4. **Layout**:
   - Centered content
   - Responsive grid for buttons
   - Proper spacing at all breakpoints

## Integration
The Hero Section is integrated into the main landing page (`app/page.tsx`) and works in conjunction with:
- TierContext for subscription management
- Next.js routing for navigation
- Tailwind CSS for styling
- React hooks for interactivity

## Mobile Considerations
- Stacked button layout on small screens
- Adjusted text sizes for readability
- Maintained vertical centering
- Proper touch targets
- Responsive padding and margins 
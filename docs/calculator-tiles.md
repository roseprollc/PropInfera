# Calculator Tiles Component

## Overview
The Calculator Tiles section provides a grid of interactive tiles that link to different property analysis calculators. Each tile features a title, description, and hover effects consistent with the techno theme.

## Grid Layout
The component uses a responsive grid layout:
- **Desktop/Tablet**: 2 columns (`grid-cols-2`)
- **Mobile**: 1 column (`grid-cols-1`)
- Gap between tiles: 1.5rem (`gap-6`)

## Styling Implementation
### Container
- Full-width section with dark background (`bg-[#111111]`)
- Maximum width container (`max-w-7xl`)
- Responsive padding (`px-4 sm:px-6 lg:px-8`)
- Vertical padding (`py-20`)

### Tile Styling
- Semi-transparent black background (`bg-black/50`)
- Border with hover effect (`border border-gray-800`)
- Rounded corners (`rounded-lg`)
- Hover transformations:
  - Scale effect (`hover:scale-105`)
  - Green border (`hover:border-green-500`)
  - Glow effect (`hover:shadow-lg hover:shadow-green-500/25`)
- Smooth transitions (`transition-all duration-300 ease-in-out`)

### Typography
- Title: Bold white text with green hover (`text-xl font-bold text-white`)
- Subtitle: Gray text with lighter hover (`text-gray-400`)
- Group hover effects for coordinated color changes

### Accessibility
- Proper `aria-label` for each tile
- Focus states with green ring (`focus:ring-2 focus:ring-green-500`)
- Dark offset for focus ring (`focus:ring-offset-black`)

## Design Decisions
1. **Color Scheme**:
   - Dark background for contrast
   - Green accents for interactive elements
   - Gray text for secondary information

2. **Interactive Elements**:
   - Scale transform for depth
   - Glow effect for emphasis
   - Smooth transitions for polish
   - Group hover for coordinated effects

3. **Layout**:
   - Responsive grid for flexibility
   - Consistent spacing
   - Proper padding for touch targets

4. **Accessibility**:
   - Clear focus states
   - Descriptive labels
   - Proper contrast ratios

## Integration
The Calculator Tiles component:
- Uses Next.js `Link` for client-side navigation
- Implements consistent styling with the Hero section
- Provides clear visual hierarchy
- Maintains responsive behavior across devices

## Mobile Considerations
- Single column layout on small screens
- Adequate touch targets
- Maintained readability
- Preserved interactive effects
- Proper spacing for touch interaction 
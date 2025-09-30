# Styles Folder Structure

This folder contains all styling files for the Cantonese Learning App.

## Organization

- `global.scss` - Global application styles (body, base elements)
- `index.scss` - Main styles entry point that imports all other styles
- `components/` - Component-specific styles
  - `Quiz.scss` - Styles for the Quiz component

## Usage

### Individual Component Styles

Import component-specific styles directly in the component:

```tsx
import "../styles/components/Quiz.scss";
```

### Global Styles

Global styles are imported in `src/index.tsx`:

```tsx
import "./styles/global.scss";
```

### All Styles (Alternative)

You can import all styles at once using the main entry point:

```tsx
import "./styles/index.scss";
```

## Joy UI Integration

The application uses Joy UI as the primary component library. Custom SCSS is used for:

- Component-specific styling that extends Joy UI components
- Complex layouts and animations
- Legacy styling that hasn't been migrated to Joy UI yet

Joy UI CSS variables are used where possible:

- `var(--joy-palette-neutral-50)` for backgrounds
- `var(--joy-palette-neutral-300)` for borders
- `var(--joy-palette-neutral-100)` for hover states

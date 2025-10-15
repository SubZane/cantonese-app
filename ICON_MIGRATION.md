# Icon Migration - FontAwesome to MUI Icons

## Overview

This project has been migrated from FontAwesome to Material-UI Icons (@mui/icons-material) to maintain consistency with the MUI Joy UI component library used throughout the application.

## Migration Date

October 15, 2025

## Icon Mappings

All FontAwesome icons have been replaced with their MUI equivalents:

| Component              | Old (FontAwesome)    | New (MUI Icon)   | Usage                       |
| ---------------------- | -------------------- | ---------------- | --------------------------- |
| **Quiz.tsx**           | `rotate-right`       | `RefreshIcon`    | Try Again / Retry button    |
| **Quiz.tsx**           | `chevron-left`       | `ArrowBackIcon`  | Back navigation buttons     |
| **Quiz.tsx**           | `times`              | `CloseIcon`      | Warning/error indicators    |
| **Quiz.tsx**           | `play`               | `PlayArrowIcon`  | Start Quiz button           |
| **QuizResults.tsx**    | `check`              | `CheckIcon`      | Correct answer indicator    |
| **QuizResults.tsx**    | `times`              | `CloseIcon`      | Incorrect answer indicator  |
| **QuizResults.tsx**    | `rotate-right`       | `RefreshIcon`    | Restart Quiz button         |
| **QuizResults.tsx**    | `eye`                | `VisibilityIcon` | Show detailed results       |
| **VocabularyList.tsx** | `search`             | `SearchIcon`     | Search input decorator      |
| **VocabularyList.tsx** | `flag`               | `FlagIcon`       | Hong Kong variant indicator |
| **BottomNav.tsx**      | `home`               | `HomeIcon`       | Home navigation icon        |
| **BottomNav.tsx**      | `book`               | `BookIcon`       | Vocabulary navigation icon  |
| **BottomNav.tsx**      | `clipboard-question` | `QuizIcon`       | Quiz navigation icon        |
| **Home.tsx**           | `clipboard-question` | `QuizIcon`       | Quick Quiz card icon        |

## Removed Files

- `src/fontawesome.ts` - FontAwesome configuration file
- `FONTAWESOME.md` - FontAwesome documentation

## Removed Dependencies

The following npm packages were uninstalled:

```json
{
	"@fortawesome/fontawesome-svg-core": "^7.0.1",
	"@fortawesome/free-solid-svg-icons": "^7.0.1",
	"@fortawesome/react-fontawesome": "^3.0.2"
}
```

## Updated Files

- `src/App.tsx` - Removed fontawesome import
- `src/components/Quiz.tsx` - Updated all icon imports and usages
- `src/components/QuizResults.tsx` - Updated all icon imports and usages
- `src/components/VocabularyList.tsx` - Updated all icon imports and usages
- `src/components/BottomNav.tsx` - Updated icon system to use MUI components
- `src/components/Home.tsx` - Updated quiz icon
- `CODING_CONVENTIONS.md` - Updated examples to use MUI icons

## How to Use MUI Icons

### Import

```tsx
import IconName from "@mui/icons-material/IconName";
```

### Basic Usage

```tsx
<IconName />
```

### With Size Props

```tsx
<IconName fontSize="small" />
<IconName fontSize="medium" />
<IconName fontSize="large" />
<IconName fontSize="inherit" />
```

### With Custom Styling

```tsx
<IconName
	sx={{
		color: "primary.500",
		fontSize: "2rem",
	}}
/>
```

### In Buttons

```tsx
<Button>
	<IconName className="icon-spacing" />
	Button Text
</Button>
```

## Available Icons

Browse all available MUI icons at:
[MUI Material Icons Gallery](https://mui.com/material-ui/material-icons/)

The @mui/icons-material package includes 2000+ Material Design icons and is already installed in the project.

## Benefits of Migration

1. **Consistency** - MUI Icons match the design system used in MUI Joy UI components
2. **Bundle Size** - Tree-shakeable imports mean smaller bundle sizes
3. **Performance** - SVG icons render faster than font-based icons
4. **Maintenance** - One less dependency to maintain
5. **TypeScript Support** - Better type checking and autocompletion
6. **Accessibility** - Better semantic HTML and ARIA support

## Notes

- All icon functionality has been preserved during migration
- Icons maintain their original visual appearance and purpose
- No breaking changes to component APIs
- CSS classes like `icon-spacing` continue to work as before

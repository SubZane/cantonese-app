# Font Awesome Integration

This document outlines the Font Awesome integration in the Cantonese Learning App.

## Installation

Font Awesome is installed with the following packages:

- `@fortawesome/fontawesome-svg-core`
- `@fortawesome/free-solid-svg-icons`
- `@fortawesome/react-fontawesome`

## Configuration

Font Awesome is configured in `src/fontawesome.ts` with the following icons:

- `faHome` - Home navigation and branding
- `faGraduationCap` - Lessons/learning features
- `faClipboardQuestion` - Quiz functionality
- `faUser` - User profile
- `faCog` - Settings
- `faCheck` - Correct answers and success states
- `faTimes` - Incorrect answers and warnings
- `faChevronLeft` - Back navigation
- `faVolumeUp` - Audio/pronunciation features
- `faEye` - Show/view actions
- `faEyeSlash` - Hide actions
- `faRotateRight` - Restart/refresh actions
- `faPlay` - Start/play actions
- `faTrophy` - Achievements
- `faChartLine` - Progress tracking
- `faBars` - Menu navigation
- `faLanguage` - Language switching

## Usage Examples

### Navigation Icons

```tsx
<FontAwesomeIcon icon="home" />
<FontAwesomeIcon icon="graduation-cap" />
<FontAwesomeIcon icon="clipboard-question" />
```

### Action Buttons

```tsx
<Button variant="primary" onClick={startQuiz}>
	<FontAwesomeIcon icon="play" className="me-2" />
	Start Quiz
</Button>
```

### Status Indicators

```tsx
<FontAwesomeIcon icon={isCorrect ? "check" : "times"} className="me-1" />
```

## Component Integration

### BottomNav.tsx

- Uses navigation icons (home, graduation-cap, clipboard-question, user, cog)

### Home.tsx

- Card icons for different app sections
- Button icons for actions

### Header.tsx

- Language icon for app branding

### Quiz.tsx

- Warning icons for validation messages
- Action button icons (play, rotate-right, eye, etc.)
- Result status icons (check, times)

## Benefits

1. **Consistent Design**: Professional, standardized icons throughout the app
2. **Scalable**: Vector-based icons that scale perfectly at any size
3. **Accessible**: Better semantic meaning than emoji
4. **Customizable**: Easy to style with CSS classes and Bootstrap utilities
5. **Performance**: Tree-shakable imports only include used icons
6. **Maintainable**: Centralized icon configuration in one file

## File Structure

```
src/
├── fontawesome.ts          # Font Awesome configuration
├── App.tsx                 # Imports fontawesome config
└── components/
    ├── BottomNav.tsx       # Navigation icons
    ├── Home.tsx            # Feature card icons
    ├── Header.tsx          # App branding icon
    └── Quiz.tsx            # Quiz functionality icons
```

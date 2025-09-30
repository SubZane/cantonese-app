# Coding Conventions

## Table of Contents

- [File Structure & Naming](#file-structure--naming)
- [Component Guidelines](#component-guidelines)
- [TypeScript Standards](#typescript-standards)
- [State Management](#state-management)
- [Styling Conventions](#styling-conventions)
- [Import/Export Standards](#importexport-standards)
- [Performance Best Practices](#performance-best-practices)
- [Testing Guidelines](#testing-guidelines)
- [Code Formatting](#code-formatting)
- [Git Commit Conventions](#git-commit-conventions)

## File Structure & Naming

### File Naming Conventions

```
├── src/
│   ├── components/
│   │   ├── Quiz.tsx              # PascalCase for components
│   │   ├── Quiz.scss             # Match component name
│   │   └── index.ts              # Re-export components
│   ├── hooks/
│   │   └── useTranslation.ts     # camelCase with 'use' prefix
│   ├── utils/
│   │   └── localStorage.ts       # camelCase for utilities
│   ├── types/
│   │   └── quiz.types.ts         # camelCase with .types suffix
│   └── constants/
│       └── config.ts             # camelCase for constants
```

### Directory Structure

- **Components**: One component per file, co-locate related files
- **Hooks**: Custom hooks in dedicated directory with `use` prefix
- **Utils**: Pure functions and utilities
- **Types**: TypeScript interfaces and type definitions
- **Constants**: Application-wide constants and configuration

## Component Guidelines

### Functional Components (Preferred)

```tsx
// ✅ Good - Functional component with proper typing
interface QuizProps {
	showPinyin?: boolean;
	onComplete?: (results: QuizResult[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ showPinyin = false, onComplete }) => {
	// Component logic here

	return <div className="quiz-container">{/* JSX content */}</div>;
};

export default Quiz;
```

### Component Structure Order

1. **Imports** (React first, then libraries, then local imports)
2. **Type/Interface definitions**
3. **Component function**
4. **Export statement**

```tsx
// 1. React imports first
import React, { useState, useEffect } from "react";

// 2. Third-party library imports
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 3. Local imports (absolute paths preferred)
import { VocabularyItem } from "../types/quiz.types";
import { useTranslation } from "../hooks/useTranslation";
import "./Quiz.scss";

// 4. Type definitions
interface QuizProps {
	// props here
}

// 5. Component
const Quiz: React.FC<QuizProps> = () => {
	// implementation
};

// 6. Export
export default Quiz;
```

### Props Guidelines

```tsx
// ✅ Good - Explicit interface with optional props
interface ButtonProps {
	variant: "primary" | "secondary" | "success" | "danger";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	onClick: () => void;
	children: React.ReactNode;
}

// ✅ Good - Default parameters
const CustomButton: React.FC<ButtonProps> = ({ variant, size = "md", disabled = false, onClick, children }) => {
	// Component implementation
};

// ❌ Avoid - Any types
interface BadProps {
	data: any; // Use specific types instead
	onClick: (event: any) => void; // Use React.MouseEvent
}
```

## TypeScript Standards

### Interface Naming

```tsx
// ✅ Good - Descriptive interfaces
interface VocabularyItem {
	swedish: string;
	characters: string;
	pinyin: string;
	difficulty: number;
}

interface QuizState {
	currentQuestion: number;
	score: number;
	isComplete: boolean;
}

// ✅ Good - Props interfaces with Component name + Props
interface QuizProps {
	showPinyin?: boolean;
}

// ❌ Avoid - Generic names
interface IProps {} // Too generic
interface Data {} // Too vague
```

### Type Definitions

```tsx
// ✅ Good - Union types for specific values
type QuizDifficulty = "easy" | "medium" | "hard";
type QuizCategory = "animals" | "food" | "family" | "actions" | "items";

// ✅ Good - Utility types
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type QuizQuestion = Optional<VocabularyItem, "difficulty">;

// ✅ Good - Enum for constants
enum QuizStatus {
	NOT_STARTED = "not_started",
	IN_PROGRESS = "in_progress",
	COMPLETED = "completed",
}
```

### Function Types

```tsx
// ✅ Good - Explicit function signatures
type EventHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
type AsyncHandler = () => Promise<void>;
type QuizCompleteHandler = (results: QuizResult[]) => void;

// ✅ Good - Generic functions with constraints
function processData<T extends VocabularyItem>(items: T[]): T[] {
	return items.filter((item) => item.difficulty > 0);
}
```

## State Management

### useState Guidelines

```tsx
// ✅ Good - Explicit initial state types
const [questions, setQuestions] = useState<QuizQuestion[]>([]);
const [currentIndex, setCurrentIndex] = useState<number>(0);
const [isLoading, setIsLoading] = useState<boolean>(false);

// ✅ Good - Complex state with interfaces
interface QuizState {
	questions: QuizQuestion[];
	currentIndex: number;
	score: number;
	results: QuizResult[];
}

const [quizState, setQuizState] = useState<QuizState>({
	questions: [],
	currentIndex: 0,
	score: 0,
	results: [],
});

// ✅ Good - State updates with functional updates
setQuizState((prev) => ({
	...prev,
	score: prev.score + 1,
}));
```

### useEffect Guidelines

```tsx
// ✅ Good - Clear dependency arrays
useEffect(() => {
	// Effect with dependencies
	fetchQuestions();
}, [difficulty, category]); // Clear dependencies

// ✅ Good - Cleanup functions
useEffect(() => {
	const timer = setInterval(() => {
		updateTimer();
	}, 1000);

	return () => clearInterval(timer); // Cleanup
}, []);

// ✅ Good - Separate effects for different concerns
useEffect(() => {
	// Save quiz state
	saveQuizState(quizState);
}, [quizState]);

useEffect(() => {
	// Load saved settings
	loadUserSettings();
}, []); // Different concern, separate effect
```

### Custom Hooks

```tsx
// ✅ Good - Reusable custom hooks
function useLocalStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	const setValue = (value: T | ((val: T) => T)) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.warn(`Error setting localStorage key "${key}":`, error);
		}
	};

	return [storedValue, setValue] as const;
}
```

## Styling Conventions

### SCSS Structure

```scss
// Component-level SCSS file structure
.quiz-container {
	// Base styles
	display: flex;
	flex-direction: column;

	// Responsive breakpoints
	@media (max-width: 768px) {
		flex-direction: column;
	}

	// Child elements
	.quiz-header {
		// Nested styles
	}

	// State modifiers
	&.is-loading {
		opacity: 0.5;
	}

	&.is-complete {
		background-color: #f8f9fa;
	}
}

// BEM methodology for complex components
.answer-button {
	// Base button styles

	&--correct {
		background-color: #28a745;
	}

	&--incorrect {
		background-color: #dc3545;
	}

	&__text {
		font-size: 1rem;
	}

	&__pinyin {
		font-size: 0.8rem;
		opacity: 0.8;
	}
}
```

### Bootstrap Integration

```tsx
// ✅ Good - Use Bootstrap classes first, custom classes for specific needs
<div className="container-fluid px-3 py-2 quiz-container">
  <div className="row justify-content-center">
    <div className="col-12 col-md-8 col-lg-6">
      <Button variant="primary" size="lg" className="answer-button">
        {content}
      </Button>
    </div>
  </div>
</div>

// ✅ Good - Combine Bootstrap utilities with custom classes
<div className="d-flex justify-content-between align-items-center quiz-header">
```

## Import/Export Standards

### Import Order

```tsx
// 1. React and React-related
import React, { useState, useEffect, useCallback } from "react";

// 2. Third-party libraries (alphabetical)
import { Button, Form, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 3. Internal imports - Types first
import type { VocabularyItem, QuizQuestion } from "../types/quiz.types";

// 4. Internal imports - Hooks
import { useTranslation } from "../hooks/useTranslation";
import { useLocalStorage } from "../hooks/useLocalStorage";

// 5. Internal imports - Components
import Header from "./Header";
import BottomNav from "./BottomNav";

// 6. Internal imports - Utils
import { shuffleArray, validateAnswer } from "../utils/quiz.utils";

// 7. Styles (last)
import "./Quiz.scss";
```

### Export Standards

```tsx
// ✅ Good - Default export for main component
const Quiz: React.FC<QuizProps> = () => {
	// implementation
};

export default Quiz;

// ✅ Good - Named exports for utilities and types
export type { QuizQuestion, VocabularyItem };
export { validateAnswer, shuffleArray };

// ✅ Good - Re-exports in index files
// src/components/index.ts
export { default as Quiz } from "./Quiz";
export { default as Header } from "./Header";
export { default as BottomNav } from "./BottomNav";
```

## Performance Best Practices

### Memoization

```tsx
// ✅ Good - Memoize expensive computations
const processedQuestions = useMemo(() => {
	return questions.map((q) => ({
		...q,
		options: shuffleArray(q.options),
	}));
}, [questions]);

// ✅ Good - Memoize callback functions
const handleAnswerSelect = useCallback(
	(answer: string) => {
		setSelectedAnswer(answer);
		onAnswerSelect?.(answer);
	},
	[onAnswerSelect]
);

// ✅ Good - Memoize components with React.memo
const QuestionDisplay = React.memo<QuestionProps>(({ question, showPinyin }) => {
	return (
		<div className="question-display">
			{question.swedish}
			{showPinyin && <span className="pinyin">({question.pinyin})</span>}
		</div>
	);
});
```

### Code Splitting

```tsx
// ✅ Good - Lazy load components
const Quiz = React.lazy(() => import("./components/Quiz"));
const Results = React.lazy(() => import("./components/Results"));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
	<Routes>
		<Route path="/quiz" element={<Quiz />} />
		<Route path="/results" element={<Results />} />
	</Routes>
</Suspense>;
```

## Testing Guidelines

### Component Testing

```tsx
// ✅ Good - Test component behavior, not implementation
import { render, screen, fireEvent } from "@testing-library/react";
import { Quiz } from "../Quiz";

describe("Quiz Component", () => {
	it("should display question and answer options", () => {
		render(<Quiz showPinyin={false} />);

		expect(screen.getByText(/what is/i)).toBeInTheDocument();
		expect(screen.getAllByRole("button")).toHaveLength(3);
	});

	it("should handle answer selection", () => {
		const onComplete = jest.fn();
		render(<Quiz onComplete={onComplete} />);

		fireEvent.click(screen.getByText("Option 1"));

		expect(screen.getByText("Next Question")).toBeInTheDocument();
	});
});
```

### Hook Testing

```tsx
// ✅ Good - Test custom hooks
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage", () => {
	it("should return initial value when no stored value exists", () => {
		const { result } = renderHook(() => useLocalStorage("test-key", "default"));

		expect(result.current[0]).toBe("default");
	});
});
```

## Code Formatting

### Prettier Configuration

```json
{
	"semi": true,
	"trailingComma": "es5",
	"singleQuote": false,
	"printWidth": 100,
	"tabWidth": 2,
	"useTabs": true,
	"bracketSpacing": true,
	"arrowParens": "always",
	"endOfLine": "lf"
}
```

### ESLint Rules

```json
{
	"rules": {
		"react/jsx-uses-react": "off",
		"react/react-in-jsx-scope": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-unused-vars": "warn",
		"prefer-const": "error",
		"no-var": "error",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn"
	}
}
```

## Git Commit Conventions

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### Examples

```
feat(quiz): add pinyin toggle functionality
fix(quiz): resolve button sizing inconsistency
docs(readme): update installation instructions
style(quiz): improve SCSS organization
refactor(hooks): extract localStorage logic to custom hook
```

## Project-Specific Conventions

### Vocabulary and Quiz Data

```tsx
// ✅ Good - Consistent vocabulary item structure
interface VocabularyItem {
	swedish: string; // Always required
	characters: string; // Chinese characters
	pinyin: string; // Romanization
	difficulty: number; // 1-5 scale
	category: string; // animals, food, etc.
}

// ✅ Good - Quiz result tracking
interface QuizResult {
	question: VocabularyItem;
	selectedAnswer: string;
	correctAnswer: string;
	isCorrect: boolean;
	timeSpent: number;
}
```

### Translation Keys

```tsx
// ✅ Good - Nested translation structure
interface TranslationKeys {
	navigation: {
		home: string;
		quiz: string;
	};
	quiz: {
		startQuiz: string;
		nextQuestion: string;
		showResults: string;
	};
	general: {
		loading: string;
		error: string;
	};
}
```

### LocalStorage Conventions

```tsx
// ✅ Good - Consistent localStorage key naming
const STORAGE_KEYS = {
	SHOW_PINYIN: "cantonese-quiz-showPinyin",
	QUIZ_STATE: "cantonese-quiz-state",
	USER_PROGRESS: "cantonese-quiz-progress",
} as const;

// ✅ Good - Error handling for localStorage
const saveToStorage = <T,>(key: string, value: T): void => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.warn(`Failed to save to localStorage:`, error);
	}
};
```

---

## Enforcement

- Use **ESLint + Prettier** for automated formatting
- Set up **pre-commit hooks** with Husky and lint-staged
- Configure **VS Code settings** for consistent development experience
- Run **`npm run lint`** and **`npm run format`** before committing
- Use **TypeScript strict mode** for better type safety

## Setup Commands

```bash
# Install linting and formatting tools
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier prettier husky lint-staged

# Initialize git hooks
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

# Add scripts to package.json
npm pkg set scripts.lint="eslint src --ext .ts,.tsx --fix"
npm pkg set scripts.format="prettier --write src/**/*.{ts,tsx,scss,css,json}"
```

This document should be reviewed and updated as the project evolves and new patterns emerge.

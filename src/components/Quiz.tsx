import "../styles/components/Quiz.scss";

import React, { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Chip, FormControl, LinearProgress, Sheet, Table, Typography } from "@mui/joy";

import { getDisplayCantonese, isHongKongVariantDisplay, useCantoneseVariant } from "../context/CantoneseVariantContext";
import actionsData from "../data/actions.json";
import animalsData from "../data/animals.json";
import familyData from "../data/family.json";
import foodData from "../data/food.json";
import funPlayData from "../data/fun-play.json";
import itemsData from "../data/items.json";
import movementDirectionsData from "../data/movement-directions.json";
import timeData from "../data/time.json";
import { useT } from "../translations";
import DifficultyRadio from "./form/DifficultyRadio";
import IconlessRadio from "./form/IconlessRadio";
import IconsRadio from "./form/IconsRadio";
import QuestionCountRadio from "./form/QuestionCountRadio";

interface VocabularyItem {
	swedish: string;
	mainland_cantonese: string;
	hongkong_cantonese: string;
	jyutping: string;
	hongkong_jyutping?: string;
	difficulty: number;
	has_hk_variant?: boolean;
}

interface QuizQuestion {
	swedish: string;
	correctAnswer: string;
	correctJyutping: string;
	options: string[];
	optionsJyutping: string[];
	optionIsHK: boolean[]; // parallel to options
	correctIsHK: boolean;
	optionHasHK: boolean[]; // availability regardless of toggle
	correctHasHK: boolean;
	// Stored raw vocabulary items for dynamic recomputation when HK toggle changes
	baseOptions: VocabularyItem[];
}

interface QuizResult {
	question: string;
	correctAnswer: string;
	correctJyutping: string;
	userAnswer: string;
	userJyutping: string;
	isCorrect: boolean;
	correctIsHK: boolean;
	userIsHK: boolean;
}

interface QuizProps {
	showJyutping?: boolean;
}

const Quiz: React.FC<QuizProps> = ({ showJyutping = false }) => {
	const { useHongKong } = useCantoneseVariant();
	// Load saved settings from localStorage
	const getSavedSetting = (key: string, defaultValue: any) => {
		try {
			const saved = localStorage.getItem(`cantonese-quiz-${key}`);
			return saved ? JSON.parse(saved) : defaultValue;
		} catch {
			return defaultValue;
		}
	};

	// Quiz setup state
	const [quizStarted, setQuizStarted] = useState(false);
	const [configStep, setConfigStep] = useState<number>(1); // 1: Category, 2: Difficulty, 3: Question Count
	const [difficulty, setDifficulty] = useState<string>(getSavedSetting("difficulty", "all"));
	const [category, setCategory] = useState<string>(getSavedSetting("category", "all"));
	const [questionCount, setQuestionCount] = useState<number>(getSavedSetting("questionCount", 10));

	// Quiz state
	const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
	const [score, setScore] = useState(0);
	const [questionNumber, setQuestionNumber] = useState(1);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [showResult, setShowResult] = useState(false);
	const [quizComplete, setQuizComplete] = useState(false);
	const [showDetailedResults, setShowDetailedResults] = useState(false);
	const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
	const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
	const [isRestoring, setIsRestoring] = useState(false);
	const { t, translate } = useT();

	// Category options with icons
	const categoryOptions = [
		{ value: "all", label: t.filters.category.all, icon: "globe" },
		{ value: "animals", label: t.filters.category.animals, icon: "dog" },
		{ value: "food", label: t.filters.category.food, icon: "utensils" },
		{ value: "family", label: t.filters.category.family, icon: "users" },
		{ value: "actions", label: t.filters.category.actions, icon: "running" },
		{ value: "items", label: t.filters.category.items, icon: "cube" },
		{ value: "fun-play", label: t.filters.category.funPlay, icon: "gamepad" },
		{ value: "time", label: t.filters.category.time, icon: "clock" },
		{ value: "movement-directions", label: t.filters.category.movementDirections, icon: "compass" },
	];

	// Save settings to localStorage
	const saveSetting = (key: string, value: any) => {
		try {
			localStorage.setItem(`cantonese-quiz-${key}`, JSON.stringify(value));
		} catch {
			// Silently ignore localStorage errors
		}
	};

	// Save quiz state to localStorage
	const saveQuizState = () => {
		try {
			const quizState = {
				quizStarted,
				currentQuestion,
				score,
				questionNumber,
				selectedAnswer,
				showResult,
				quizComplete,
				showDetailedResults,
				quizResults,
				usedWords: Array.from(usedWords), // Convert Set to Array for JSON
				timestamp: Date.now(),
			};
			localStorage.setItem("cantonese-quiz-state", JSON.stringify(quizState));
		} catch {
			// Silently ignore localStorage errors
		}
	};

	// Load quiz state from localStorage
	const loadQuizState = () => {
		try {
			const saved = localStorage.getItem("cantonese-quiz-state");
			if (saved) {
				const state = JSON.parse(saved);
				// Only restore if less than 24 hours old
				const isRecent = state.timestamp && Date.now() - state.timestamp < 24 * 60 * 60 * 1000;

				if (isRecent && state.quizStarted) {
					setIsRestoring(true);
					setQuizStarted(state.quizStarted);
					setCurrentQuestion(state.currentQuestion);
					setScore(state.score || 0);
					setQuestionNumber(state.questionNumber || 1);
					setSelectedAnswer(state.selectedAnswer);
					setShowResult(state.showResult || false);
					setQuizComplete(state.quizComplete || false);
					setShowDetailedResults(state.showDetailedResults || false);
					setQuizResults(state.quizResults || []);
					setUsedWords(new Set(state.usedWords || [])); // Convert Array back to Set
					setTimeout(() => setIsRestoring(false), 100); // Reset flag after state updates
					return true; // State was restored
				}
			}
		} catch {
			// Silently ignore errors
		}
		return false; // No state was restored
	};

	// Clear quiz state from localStorage
	const clearQuizState = () => {
		try {
			localStorage.removeItem("cantonese-quiz-state");
		} catch {
			// Silently ignore localStorage errors
		}
	};

	// Combine all vocabulary data
	const getAllVocabulary = (): VocabularyItem[] => {
		let vocabulary: VocabularyItem[] = [];

		// Add vocabulary based on selected category
		if (category === "all") {
			vocabulary = [...animalsData, ...foodData, ...familyData, ...actionsData, ...itemsData, ...funPlayData, ...timeData, ...movementDirectionsData];
		} else {
			switch (category) {
				case "animals":
					vocabulary = [...animalsData];
					break;
				case "food":
					vocabulary = [...foodData];
					break;
				case "family":
					vocabulary = [...familyData];
					break;
				case "actions":
					vocabulary = [...actionsData];
					break;
				case "items":
					vocabulary = [...itemsData];
					break;
				case "fun-play":
					vocabulary = [...funPlayData];
					break;
				case "time":
					vocabulary = [...timeData];
					break;
				case "movement-directions":
					vocabulary = [...movementDirectionsData];
					break;
				default:
					vocabulary = [...animalsData, ...foodData, ...familyData, ...actionsData, ...itemsData, ...funPlayData, ...timeData, ...movementDirectionsData];
			}
		}

		// Filter by difficulty
		if (difficulty !== "all") {
			switch (difficulty) {
				case "easy":
					vocabulary = vocabulary.filter((item) => item.difficulty === 1);
					break;
				case "medium":
					vocabulary = vocabulary.filter((item) => item.difficulty === 2);
					break;
				case "hard":
					vocabulary = vocabulary.filter((item) => item.difficulty === 3);
					break;
			}
		}

		return vocabulary;
	};

	// Generate a random quiz question without repeating words
	const generateQuestion = (currentUsedWords: Set<string> = usedWords): { question: QuizQuestion | null; newUsedWords: Set<string> } => {
		const vocabulary = getAllVocabulary();

		if (vocabulary.length < 3) {
			return { question: null, newUsedWords: currentUsedWords };
		}

		// Filter out already used words
		const availableWords = vocabulary.filter((item) => !currentUsedWords.has(item.swedish));

		// If we've used all words, this shouldn't happen in practice but handle it
		if (availableWords.length === 0) {
			return { question: null, newUsedWords: currentUsedWords };
		}

		const randomIndex = Math.floor(Math.random() * availableWords.length);
		const correctItem = availableWords[randomIndex];

		// Create new set with the selected word added
		const newUsedWords = new Set(currentUsedWords);
		newUsedWords.add(correctItem.swedish);

		// Get 2 wrong answers from the same category or random items
		const wrongItems = vocabulary
			.filter((item) => item.swedish !== correctItem.swedish)
			.sort(() => Math.random() - 0.5)
			.slice(0, 2);

		// If we don't have enough wrong answers, pad with items from all vocabulary
		const allItems = [...animalsData, ...foodData, ...familyData, ...actionsData, ...itemsData, ...funPlayData, ...timeData, ...movementDirectionsData] as VocabularyItem[];
		const additionalWrong = allItems
			.filter((item) => item.swedish !== correctItem.swedish && !wrongItems.some((wrong) => wrong.swedish === item.swedish))
			.sort(() => Math.random() - 0.5)
			.slice(0, 2 - wrongItems.length);

		const finalWrongItems = [...wrongItems, ...additionalWrong].slice(0, 2);

		// Create arrays with correct item included
		const allOptions = [correctItem, ...finalWrongItems];
		const shuffledIndices = [0, 1, 2].sort(() => Math.random() - 0.5);

		// Build shuffled base options (store raw entries for later variant recalculation)
		const baseOptions = shuffledIndices.map((i) => allOptions[i]);
		// Derive displayed data from base options with current variant setting
		const options = baseOptions.map((item) => getDisplayCantonese(item, useHongKong));
		const optionIsHK = baseOptions.map((item) => isHongKongVariantDisplay(item, useHongKong));
		const optionHasHK = baseOptions.map((item) => !!item.has_hk_variant);
		const optionsJyutping = baseOptions.map((item) => (useHongKong && item.hongkong_jyutping ? item.hongkong_jyutping : item.jyutping));

		const question: QuizQuestion = {
			swedish: correctItem.swedish,
			correctAnswer: getDisplayCantonese(correctItem, useHongKong),
			correctJyutping: useHongKong && correctItem.hongkong_jyutping ? correctItem.hongkong_jyutping : correctItem.jyutping,
			options,
			optionsJyutping,
			optionIsHK,
			correctIsHK: isHongKongVariantDisplay(correctItem, useHongKong),
			optionHasHK,
			correctHasHK: !!correctItem.has_hk_variant,
			baseOptions,
		};

		return { question, newUsedWords };
	};

	// Load saved quiz state on component mount
	useEffect(() => {
		loadQuizState();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Save quiz state whenever it changes
	useEffect(() => {
		if (quizStarted && !isRestoring) {
			saveQuizState();
		}
	}, [quizStarted, currentQuestion, score, questionNumber, selectedAnswer, showResult, quizComplete, showDetailedResults, quizResults, usedWords, isRestoring]); // eslint-disable-line react-hooks/exhaustive-deps

	// Clear saved state only when starting a new quiz (not when just completing one)
	// We want to preserve the results view even after refresh
	// State will be cleared when user starts a new quiz

	// Initialize first question
	useEffect(() => {
		if (quizStarted && !currentQuestion) {
			const result = generateQuestion();
			setCurrentQuestion(result.question);
			setUsedWords(result.newUsedWords);
			// Only reset quiz state when starting fresh (not when restoring)
			if (questionNumber === 1 && score === 0 && quizResults.length === 0) {
				setScore(0);
				setQuestionNumber(1);
				setSelectedAnswer(null);
				setShowResult(false);
				setQuizComplete(false);
				setQuizResults([]);
				setUsedWords(new Set()); // Clear used words for new quiz
			}
		}
	}, [quizStarted, difficulty, category]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleAnswerSelect = (answer: string) => {
		if (selectedAnswer || showResult) return; // Prevent multiple selections

		setSelectedAnswer(answer);
		const correct = answer === currentQuestion?.correctAnswer;

		// Automatically show result after selection
		setTimeout(() => {
			setShowResult(true);
		}, 100);

		if (correct) {
			setScore(score + 1);
		}

		// Add result to results array
		if (currentQuestion) {
			const idx = currentQuestion.options.indexOf(answer);
			const result: QuizResult = {
				question: currentQuestion.swedish,
				correctAnswer: currentQuestion.correctAnswer,
				correctJyutping: currentQuestion.correctJyutping,
				userAnswer: answer,
				userJyutping: idx >= 0 ? currentQuestion.optionsJyutping[idx] || "" : "",
				isCorrect: correct,
				correctIsHK: currentQuestion.correctIsHK,
				userIsHK: idx >= 0 ? currentQuestion.optionIsHK[idx] || false : false,
			};
			setQuizResults((prev) => [...prev, result]);
		}
	};

	const handleNextQuestion = () => {
		if (questionNumber >= questionCount) {
			setQuizComplete(true);
			setShowDetailedResults(true); // Directly show detailed results
			return;
		}

		setSelectedAnswer(null);
		setShowResult(false);
		setQuestionNumber(questionNumber + 1);

		// Generate next question with current used words
		const result = generateQuestion(usedWords);
		setCurrentQuestion(result.question);
		setUsedWords(result.newUsedWords);
	};

	const resetQuiz = () => {
		clearQuizState(); // Clear saved state
		setQuizStarted(false);
		setConfigStep(1); // Reset to first configuration step
		setCurrentQuestion(null);
		setScore(0);
		setQuestionNumber(1);
		setSelectedAnswer(null);
		setShowResult(false);
		setQuizComplete(false);
		setShowDetailedResults(false);
		setQuizResults([]);
		setUsedWords(new Set()); // Clear used words when resetting
	};

	const startQuiz = () => {
		// Clear any previous quiz state when starting a new quiz
		clearQuizState();
		// Save current settings to localStorage
		saveSetting("difficulty", difficulty);
		saveSetting("category", category);
		saveSetting("questionCount", questionCount);
		setQuizStarted(true);
	};

	// Configuration step navigation
	const nextConfigStep = () => {
		if (configStep < 2) {
			setConfigStep(configStep + 1);
		} else {
			startQuiz();
		}
	};

	const prevConfigStep = () => {
		if (configStep > 1) {
			setConfigStep(configStep - 1);
		}
	};

	const showResults = () => {
		setShowDetailedResults(true);
	};

	// Recompute displayed Cantonese forms when HK variant toggle changes
	const prevUseHongKong = useRef(useHongKong);
	useEffect(() => {
		// Only run when useHongKong actually changes
		if (prevUseHongKong.current === useHongKong) return;
		prevUseHongKong.current = useHongKong;

		if (!currentQuestion || !currentQuestion.baseOptions || currentQuestion.baseOptions.length === 0) return;

		// Map old selection index if any
		const oldSelected = selectedAnswer;
		const oldIndex = oldSelected ? currentQuestion.options.indexOf(oldSelected) : -1;
		const newOptions = currentQuestion.baseOptions.map((item) => getDisplayCantonese(item, useHongKong));
		const newOptionIsHK = currentQuestion.baseOptions.map((item) => isHongKongVariantDisplay(item, useHongKong));
		const newOptionsJyutping = currentQuestion.baseOptions.map((item) => (useHongKong && item.hongkong_jyutping ? item.hongkong_jyutping : item.jyutping || ""));
		const newOptionHasHK = currentQuestion.baseOptions.map((item) => !!item.has_hk_variant);
		const newCorrectItem = currentQuestion.baseOptions.find((item) => item.swedish === currentQuestion.swedish);
		if (!newCorrectItem) return; // safety

		setCurrentQuestion({
			...currentQuestion,
			options: newOptions,
			optionsJyutping: newOptionsJyutping,
			optionIsHK: newOptionIsHK,
			optionHasHK: newOptionHasHK,
			correctAnswer: getDisplayCantonese(newCorrectItem, useHongKong),
			correctIsHK: isHongKongVariantDisplay(newCorrectItem, useHongKong),
		});

		// Preserve selection by index if it still exists
		if (oldIndex >= 0 && oldIndex < newOptions.length) {
			setSelectedAnswer(newOptions[oldIndex]);
		}
	}, [useHongKong, currentQuestion, selectedAnswer]);

	// Check if we have enough vocabulary for a quiz
	const allVocabulary = getAllVocabulary();
	if ((allVocabulary.length < 3 || allVocabulary.length < questionCount) && quizStarted) {
		return (
			<div className="loading-container">
				<div className="text-center">
					<h5 className="mb-3">{t.quiz.loading}</h5>
					<p className="mb-3">
						{allVocabulary.length < questionCount
							? `Not enough unique words available. Found ${allVocabulary.length} words but need ${questionCount}. Please select fewer questions or change your filters.`
							: difficulty !== "all" || category !== "all"
							? "Not enough vocabulary items match your selected filters. Please try different settings."
							: "Loading vocabulary..."}
					</p>
					<Button variant="solid" color="primary" onClick={resetQuiz}>
						<FontAwesomeIcon icon="chevron-left" className="icon-spacing" />
						Back to Setup
					</Button>
				</div>
			</div>
		);
	}

	// Quiz setup screens (3 steps)
	if (!quizStarted) {
		// Step 1: Category Selection
		if (configStep === 1) {
			return (
				<div className="quiz-container">
					<div className="setup-container">
						<h2 className="mb-2">{t.quiz.setup.category}</h2>
					</div>

					<div className="setup-form">
						<FormControl>
							<IconsRadio value={category} onChange={setCategory} options={categoryOptions} />
						</FormControl>

						<Button variant="solid" color="primary" onClick={nextConfigStep}>
							Next: Quiz Settings
						</Button>
					</div>
				</div>
			);
		}

		// Step 2: Difficulty and Question Count Selection
		if (configStep === 2) {
			return (
				<div className="quiz-container">
					<div className="setup-container">
						<h2 className="mb-2">{t.quiz.setup.difficultyAndQuestions}</h2>
					</div>

					<div className="setup-form">
						<DifficultyRadio
							value={difficulty}
							onChange={setDifficulty}
							labels={{
								title: t.quiz.setup.difficulty,
								all: t.filters.difficulty.all,
								easy: t.filters.difficulty.easy,
								medium: t.filters.difficulty.medium,
								hard: t.filters.difficulty.hard,
							}}
						/>

						<QuestionCountRadio value={questionCount} onChange={setQuestionCount} label={t.quiz.setup.questionCount} />

						{/* Warning if not enough vocabulary */}
						{allVocabulary.length < questionCount && (
							<div className="warning-box">
								<Typography fontSize="sm" color="warning">
									<FontAwesomeIcon icon="times" className="icon-spacing" />
									Not enough unique words available. Found {allVocabulary.length} words but need {questionCount}. Please select fewer questions or change your filters.
								</Typography>
							</div>
						)}

						<div className="step-navigation">
							<Button variant="outlined" color="neutral" onClick={prevConfigStep}>
								<FontAwesomeIcon icon="chevron-left" className="icon-spacing" />
								Back
							</Button>
							<Button variant="solid" color="primary" onClick={nextConfigStep} disabled={allVocabulary.length < questionCount}>
								<FontAwesomeIcon icon="play" className="icon-spacing" />
								{t.quiz.setup.startButton}
							</Button>
						</div>
					</div>
				</div>
			);
		}
	}

	// Detailed results screen
	if (showDetailedResults) {
		const percentage = Math.round((score / questionCount) * 100);

		return (
			<div className="results-container">
				<div className="text-center mb-4">
					<h2 className="results-title">{t.quiz.results.title}</h2>
					<h5 className="results-summary">
						{translate(t.quiz.results.summary, {
							correct: score.toString(),
							total: questionCount.toString(),
							percentage: percentage.toString(),
						})}
					</h5>
				</div>

				<Sheet variant="outlined" className="results-table">
					<Table size="sm" hoverRow>
						<thead>
							<tr>
								<th className="table-header-number">#</th>
								<th className="table-header-question">Question</th>
								<th className="table-header-answer">{t.quiz.results.yourAnswer}</th>
								<th className="table-header-correct">{t.quiz.results.correctAnswer}</th>
								<th className="table-header-result">Result</th>
							</tr>
						</thead>
						<tbody>
							{quizResults.map((result, index) => {
								return (
									<tr key={index} className={result.isCorrect ? "table-row-correct" : "table-row-incorrect"}>
										<td className="table-cell-number">{index + 1}</td>
										<td className="table-cell-question">{result.question}</td>
										<td className="table-cell-answer">
											<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
												<span>{result.userAnswer}</span>
												{result.userIsHK && <span style={{ background: "#9146ff", color: "white", padding: "2px 6px", borderRadius: 12, fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.5px" }}>HK</span>}
											</div>
											{showJyutping && result.userJyutping && <div className="table-jyutping">{result.userJyutping.toLowerCase()}</div>}
										</td>
										<td className="table-cell-correct">
											<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
												<span>{result.correctAnswer}</span>
												{result.correctIsHK && <span style={{ background: "#9146ff", color: "white", padding: "2px 6px", borderRadius: 12, fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.5px" }}>HK</span>}
											</div>
											{showJyutping && <div className="table-jyutping">{result.correctJyutping.toLowerCase()}</div>}
										</td>
										<td className="table-cell-result">
											<FontAwesomeIcon icon={result.isCorrect ? "check" : "times"} className={`table-result-icon ${result.isCorrect ? "correct" : "incorrect"}`} />
										</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</Sheet>

				<div className="text-center">
					<Button variant="solid" color="primary" onClick={resetQuiz}>
						<FontAwesomeIcon icon="rotate-right" className="icon-spacing" />
						{t.quiz.complete.restartButton}
					</Button>
				</div>
			</div>
		);
	}

	if (quizComplete) {
		const getScoreMessage = () => {
			if (score >= 8) return t.quiz.complete.excellent;
			if (score >= 6) return t.quiz.complete.good;
			if (score >= 4) return t.quiz.complete.keepPracticing;
			return t.quiz.complete.tryAgain;
		};

		return (
			<div className="completion-container">
				<h2 className="completion-title">{t.quiz.complete.title}</h2>
				<h5 className="completion-score">{translate(t.quiz.complete.score, { score: score.toString(), total: questionCount.toString() })}</h5>
				<p className="completion-message">{getScoreMessage()}</p>
				<div className="completion-actions">
					<Button variant="outlined" color="primary" onClick={showResults}>
						<FontAwesomeIcon icon="eye" className="icon-spacing" />
						{t.quiz.results.title}
					</Button>
					<Button variant="solid" color="primary" onClick={resetQuiz}>
						<FontAwesomeIcon icon="rotate-right" className="icon-spacing" />
						{t.quiz.complete.restartButton}
					</Button>
				</div>
			</div>
		);
	}

	if (!currentQuestion) {
		return (
			<div className="loading-container">
				<p>{t.quiz.loading}</p>
			</div>
		);
	}

	// Get category display name
	const getCategoryDisplayName = () => {
		switch (category) {
			case "all":
				return t.filters.category.all;
			case "animals":
				return t.filters.category.animals;
			case "food":
				return t.filters.category.food;
			case "family":
				return t.filters.category.family;
			case "actions":
				return t.filters.category.actions;
			case "items":
				return t.filters.category.items;
			case "fun-play":
				return t.filters.category.funPlay;
			case "time":
				return t.filters.category.time;
			case "movement-directions":
				return t.filters.category.movementDirections;
			default:
				return t.filters.category.all;
		}
	};

	return (
		<>
			<Sheet
				sx={{
					backgroundColor: "var(--joy-palette-background-surface)",
					borderRadius: 0,
					p: 3,
					mb: 2,
					borderBottom: "1px solid var(--joy-palette-divider)",
				}}
			>
				<div className="quiz-header-content">
					<div className="quiz-header-left">
						<Typography
							level="h1"
							sx={{
								fontSize: "1.5rem",
								fontWeight: 700,
								color: "var(--joy-palette-text-primary)",
								mb: 0.5,
							}}
						>
							{getCategoryDisplayName()}
						</Typography>
						<Typography
							level="body-sm"
							sx={{
								color: "var(--joy-palette-text-secondary)",
								fontSize: "0.875rem",
							}}
						>
							{translate(t.quiz.questionNumber, { current: questionNumber.toString(), total: questionCount.toString() })}
						</Typography>
					</div>
					<Chip
						variant="solid"
						color={difficulty === "easy" ? "success" : difficulty === "medium" ? "warning" : difficulty === "hard" ? "danger" : "neutral"}
						size="lg"
						sx={{
							fontWeight: 600,
							letterSpacing: "0.5px",
							color: "white",
						}}
					>
						{difficulty === "all"
							? t.filters.difficulty.all
							: difficulty === "easy"
							? t.filters.difficulty.easy
							: difficulty === "medium"
							? t.filters.difficulty.medium
							: difficulty === "hard"
							? t.filters.difficulty.hard
							: t.filters.difficulty.all}
					</Chip>
				</div>
			</Sheet>
			<div className="quiz-container">
				{/* Category title */}

				{/* Question and Answer options - Grid-like layout */}
				<div className="quiz-layout">
					{/* Question */}
					<div className="question-container">
						<h3 className="question-text">{currentQuestion.swedish}</h3>
					</div>

					{/* Answer options */}
					<div className="options-container">
						<IconlessRadio
							value={selectedAnswer || ""}
							onChange={handleAnswerSelect}
							options={currentQuestion.options.map((option, index) => ({
								value: option,
								label: option,
								jyutping: currentQuestion.optionsJyutping?.[index] || "",
								isHK: currentQuestion.optionIsHK?.[index] || false,
								hasHK: currentQuestion.optionHasHK?.[index] || false,
							}))}
							showJyutping={showJyutping}
							disabled={showResult}
							correctAnswer={currentQuestion.correctAnswer}
							showResult={showResult}
						/>
					</div>
				</div>

				{/* Action buttons */}
				{showResult && (
					<div className="quiz-actions">
						<Button
							variant="outlined"
							color="danger"
							onClick={() => {
								if (window.confirm("Are you sure you want to cancel the quiz? Your progress will be lost.")) {
									resetQuiz();
								}
							}}
						>
							{t.quiz.cancelQuiz}
						</Button>
						<Button variant="solid" color="primary" onClick={handleNextQuestion}>
							{questionNumber >= questionCount ? t.quiz.viewResults : t.quiz.nextQuestion}
						</Button>
					</div>
				)}

				{/* Progress bar at bottom */}
				<div className="progress-bottom">
					<LinearProgress determinate value={(questionNumber / questionCount) * 100} className="progress-bar-bottom" />
				</div>
			</div>
		</>
	);
};

export default Quiz;

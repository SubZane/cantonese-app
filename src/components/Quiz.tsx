import "../styles/components/Quiz.scss";

import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, FormControl, FormLabel, LinearProgress, Option, Select, Sheet, Table, Typography } from "@mui/joy";

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
import IconsRadio from "./form/IconsRadio";

interface VocabularyItem {
	swedish: string;
	characters: string;
	pinyin: string;
	difficulty: number;
}

interface QuizQuestion {
	swedish: string;
	correctAnswer: string;
	correctPinyin: string;
	options: string[];
	optionsPinyin: string[];
}

interface QuizResult {
	question: string;
	correctAnswer: string;
	correctPinyin: string;
	userAnswer: string;
	userPinyin: string;
	isCorrect: boolean;
}

interface QuizProps {
	showPinyin?: boolean;
}

const Quiz: React.FC<QuizProps> = ({ showPinyin = false }) => {
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
	const generateQuestion = (): QuizQuestion | null => {
		const vocabulary = getAllVocabulary();

		if (vocabulary.length < 3) {
			return null;
		}

		// Filter out already used words
		const availableWords = vocabulary.filter((item) => !usedWords.has(item.swedish));

		// If we've used all words, this shouldn't happen in practice but handle it
		if (availableWords.length === 0) {
			return null;
		}

		const randomIndex = Math.floor(Math.random() * availableWords.length);
		const correctItem = availableWords[randomIndex];

		// Add this word to used words
		setUsedWords((prev) => {
			const newSet = new Set(prev);
			newSet.add(correctItem.swedish);
			return newSet;
		});

		// Get 2 wrong answers from the same category or random items
		const wrongItems = vocabulary
			.filter((item) => item.characters !== correctItem.characters)
			.sort(() => Math.random() - 0.5)
			.slice(0, 2);

		// If we don't have enough wrong answers, pad with items from all vocabulary
		const allItems = [...animalsData, ...foodData, ...familyData, ...actionsData, ...itemsData, ...funPlayData, ...timeData];
		const additionalWrong = allItems
			.filter((item) => item.characters !== correctItem.characters && !wrongItems.some((wrong) => wrong.characters === item.characters))
			.sort(() => Math.random() - 0.5)
			.slice(0, 2 - wrongItems.length);

		const finalWrongItems = [...wrongItems, ...additionalWrong].slice(0, 2);

		// Create arrays with correct item included
		const allOptions = [correctItem, ...finalWrongItems];
		const shuffledIndices = [0, 1, 2].sort(() => Math.random() - 0.5);

		// Shuffle all options and pinyin together
		const options = shuffledIndices.map((i) => allOptions[i].characters);
		const optionsPinyin = shuffledIndices.map((i) => allOptions[i].pinyin);

		return {
			swedish: correctItem.swedish,
			correctAnswer: correctItem.characters,
			correctPinyin: correctItem.pinyin,
			options,
			optionsPinyin,
		};
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
			const question = generateQuestion();
			setCurrentQuestion(question);
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
		if (selectedAnswer) return; // Prevent multiple selections

		setSelectedAnswer(answer);
		const correct = answer === currentQuestion?.correctAnswer;
		setShowResult(true);

		if (correct) {
			setScore(score + 1);
		}

		// Add result to results array
		if (currentQuestion) {
			const result: QuizResult = {
				question: currentQuestion.swedish,
				correctAnswer: currentQuestion.correctAnswer,
				correctPinyin: currentQuestion.correctPinyin,
				userAnswer: answer,
				userPinyin: currentQuestion.optionsPinyin[currentQuestion.options.indexOf(answer)] || "",
				isCorrect: correct,
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
		setCurrentQuestion(generateQuestion());
	};

	const resetQuiz = () => {
		clearQuizState(); // Clear saved state
		setQuizStarted(false);
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

	const showResults = () => {
		setShowDetailedResults(true);
	};

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
						<FontAwesomeIcon icon="chevron-left" style={{ marginRight: "8px" }} />
						Back to Setup
					</Button>
				</div>
			</div>
		);
	}

	// Quiz setup screen
	if (!quizStarted) {
		return (
			<div className="quiz-container">
				<div className="setup-container">
					<h2 className="mb-2">{t.quiz.setup.title}</h2>
					<p className="text-muted mb-4">{t.quiz.setup.description}</p>
				</div>

				<Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 700, margin: "0 auto" }}>
					{/* Category selector */}
					<FormControl>
						<FormLabel>{t.quiz.setup.category}</FormLabel>
						<IconsRadio value={category} onChange={setCategory} options={categoryOptions} />
					</FormControl>

					{/* Difficulty selector */}
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

					{/* Question count selector */}
					<FormControl>
						<FormLabel>{t.quiz.setup.questionCount}</FormLabel>
						<Select value={questionCount} onChange={(_, newValue) => setQuestionCount(Number(newValue) || 5)}>
							{[5, 10, 15, 20].map((count) => (
								<Option key={count} value={count}>
									{count} {t.quiz.setup.questionPlural}
								</Option>
							))}
						</Select>
					</FormControl>

					{/* Warning if not enough vocabulary */}
					{allVocabulary.length < questionCount && (
						<Box
							sx={{
								p: 2,
								backgroundColor: "warning.50",
								border: "1px solid",
								borderColor: "warning.300",
								borderRadius: "sm",
							}}
						>
							<Typography fontSize="sm" color="warning">
								<FontAwesomeIcon icon="times" style={{ marginRight: "8px" }} />
								Not enough unique words available. Found {allVocabulary.length} words but need {questionCount}. Please select fewer questions or change your filters.
							</Typography>
						</Box>
					)}

					<Button variant="solid" color="primary" onClick={startQuiz} disabled={allVocabulary.length < questionCount}>
						<FontAwesomeIcon icon="play" style={{ marginRight: "8px" }} />
						{t.quiz.setup.startButton}
					</Button>
				</Box>
			</div>
		);
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

				<Sheet variant="outlined" sx={{ borderRadius: "sm", overflow: "auto", mb: 2 }}>
					<Table size="sm" hoverRow>
						<thead>
							<tr>
								<th style={{ width: "8%", textAlign: "center" }}>#</th>
								<th style={{ width: "25%" }}>Question</th>
								<th style={{ width: "28%" }}>{t.quiz.results.yourAnswer}</th>
								<th style={{ width: "28%" }}>{t.quiz.results.correctAnswer}</th>
								<th style={{ width: "11%", textAlign: "center" }}>Result</th>
							</tr>
						</thead>
						<tbody>
							{quizResults.map((result, index) => (
								<tr key={index} className={result.isCorrect ? "table-row-correct" : "table-row-incorrect"}>
									<td style={{ textAlign: "center", fontWeight: "bold" }}>{index + 1}</td>
									<td style={{ fontWeight: "500", fontSize: "0.9rem" }}>{result.question}</td>
									<td style={{ fontSize: "0.85rem" }}>
										<div>
											{result.userAnswer}
											{showPinyin && result.userPinyin && <div style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#666" }}>{result.userPinyin.toLowerCase()}</div>}
										</div>
									</td>
									<td style={{ fontSize: "0.85rem" }}>
										<div>
											{result.correctAnswer}
											{showPinyin && <div style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#666" }}>{result.correctPinyin.toLowerCase()}</div>}
										</div>
									</td>
									<td style={{ textAlign: "center" }}>
										<FontAwesomeIcon
											icon={result.isCorrect ? "check" : "times"}
											style={{
												color: result.isCorrect ? "var(--correct-color)" : "var(--incorrect-color)",
												fontSize: "1.1rem",
											}}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Sheet>

				<div className="text-center">
					<Button variant="solid" color="primary" onClick={resetQuiz}>
						<FontAwesomeIcon icon="rotate-right" style={{ marginRight: "8px" }} />
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
						<FontAwesomeIcon icon="eye" style={{ marginRight: "8px" }} />
						{t.quiz.results.title}
					</Button>
					<Button variant="solid" color="primary" onClick={resetQuiz}>
						<FontAwesomeIcon icon="rotate-right" style={{ marginRight: "8px" }} />
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
		<div className="quiz-container">
			{/* Category title */}
			<div className="quiz-header">
				<h2 className="category-title">{getCategoryDisplayName()}</h2>
				<p className="difficulty-display">
					{difficulty === "all"
						? t.filters.difficulty.all
						: difficulty === "easy"
						? t.filters.difficulty.easy
						: difficulty === "medium"
						? t.filters.difficulty.medium
						: difficulty === "hard"
						? t.filters.difficulty.hard
						: t.filters.difficulty.all}
				</p>
			</div>

			{/* Progress bar */}
			<Box sx={{ marginBottom: 2 }}>
				<Typography level="body-sm" sx={{ marginBottom: 1 }}>
					{translate(t.quiz.questionNumber, { current: questionNumber.toString(), total: questionCount.toString() })}
				</Typography>
				<LinearProgress determinate value={(questionNumber / questionCount) * 100} sx={{ borderRadius: "4px", height: "8px" }} />
			</Box>

			{/* Score */}
			<h5 className="score-display">
				{t.quiz.score}: {score}/{questionNumber - 1}
			</h5>

			{/* Question and Answer options - Grid-like layout */}
			<div className="quiz-layout">
				{/* Question */}
				<div className="question-container">
					<h3 className="question-text">{currentQuestion.swedish}</h3>
				</div>

				{/* Answer options */}
				<div className="options-container">
					{currentQuestion.options.map((option, index) => {
						const isSelected = selectedAnswer === option;
						const isCorrectAnswer = option === currentQuestion.correctAnswer;
						const optionPinyin = currentQuestion.optionsPinyin[index];

						let buttonClasses = `answer-button option-${index + 1}`;
						if (isSelected) buttonClasses += " btn-primary selected";
						if (showResult && isCorrectAnswer) buttonClasses += " correct correct-answer";
						if (showResult && !isCorrectAnswer) buttonClasses += " incorrect";
						if (showResult && isSelected && !isCorrectAnswer) buttonClasses += " selected-incorrect";

						return (
							<div key={index} className="button-wrapper">
								<Button variant={isSelected ? "solid" : "outlined"} color="primary" className={buttonClasses} onClick={() => handleAnswerSelect(option)} disabled={showResult}>
									<span className="main-text">{option}</span>
									<span className="pinyin-text">{showPinyin ? `(${optionPinyin.toLowerCase()})` : ""}</span>
								</Button>
							</div>
						);
					})}
				</div>
			</div>

			{/* Next button */}
			{showResult && (
				<div className="next-button-container">
					<Button variant="solid" color="primary" onClick={handleNextQuestion}>
						{questionNumber >= questionCount ? t.quiz.viewResults : t.quiz.nextQuestion}
					</Button>
				</div>
			)}
		</div>
	);
};

export default Quiz;

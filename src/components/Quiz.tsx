import "./Quiz.scss";

import React, { useEffect, useState } from "react";
import { Button, Form, ProgressBar } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import actionsData from "../actions.json";
import animalsData from "../animals.json";
import familyData from "../family.json";
import foodData from "../food.json";
import itemsData from "../items.json";
import { useT } from "../translations";

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
			vocabulary = [...animalsData, ...foodData, ...familyData, ...actionsData, ...itemsData];
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
				default:
					vocabulary = [...animalsData, ...foodData, ...familyData, ...actionsData, ...itemsData];
			}
		}

		// Filter by difficulty
		if (difficulty !== "all") {
			switch (difficulty) {
				case "easy":
					vocabulary = vocabulary.filter((item) => item.difficulty === 1);
					break;
				case "medium":
					vocabulary = vocabulary.filter((item) => item.difficulty >= 2 && item.difficulty <= 3);
					break;
				case "hard":
					vocabulary = vocabulary.filter((item) => item.difficulty >= 4 && item.difficulty <= 5);
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
		const allItems = [...animalsData, ...foodData, ...familyData, ...actionsData, ...itemsData];
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

	// Clear saved state when quiz is completed
	useEffect(() => {
		if (quizComplete) {
			clearQuizState();
		}
	}, [quizComplete]);

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
					<Button variant="primary" onClick={resetQuiz}>
						<FontAwesomeIcon icon="chevron-left" className="me-2" />
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

				<div className="setup-form-container">
					{/* Category selector */}
					<Form.Group>
						<Form.Label>{t.quiz.setup.category}</Form.Label>
						<Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
							<option value="all">{t.filters.category.all}</option>
							<option value="animals">{t.filters.category.animals}</option>
							<option value="food">{t.filters.category.food}</option>
							<option value="family">{t.filters.category.family}</option>
							<option value="actions">{t.filters.category.actions}</option>
							<option value="items">{t.filters.category.items}</option>
						</Form.Select>
					</Form.Group>

					{/* Difficulty selector */}
					<Form.Group>
						<Form.Label>{t.quiz.setup.difficulty}</Form.Label>
						<Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
							<option value="all">{t.filters.difficulty.all}</option>
							<option value="easy">{t.filters.difficulty.easy}</option>
							<option value="medium">{t.filters.difficulty.medium}</option>
							<option value="hard">{t.filters.difficulty.hard}</option>
						</Form.Select>
					</Form.Group>

					{/* Question count selector */}
					<Form.Group>
						<Form.Label>{t.quiz.setup.questionCount}</Form.Label>
						<Form.Select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))}>
							{[5, 10, 15, 20].map((count) => (
								<option key={count} value={count}>
									{count} {t.quiz.setup.questionPlural}
								</option>
							))}
						</Form.Select>
					</Form.Group>

					{/* Warning if not enough vocabulary */}
					{allVocabulary.length < questionCount && (
						<div className="warning-box">
							<small>
								<FontAwesomeIcon icon="times" className="text-warning me-1" />
								Not enough unique words available. Found {allVocabulary.length} words but need {questionCount}. Please select fewer questions or change your filters.
							</small>
						</div>
					)}

					<Button className="start-button" variant="primary" onClick={startQuiz} disabled={allVocabulary.length < questionCount}>
						<FontAwesomeIcon icon="play" className="me-2" />
						{t.quiz.setup.startButton}
					</Button>
				</div>
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

				<div className="mb-4">
					{quizResults.map((result, index) => (
						<div key={index} className={`result-item ${result.isCorrect ? "result-correct" : "result-incorrect"}`}>
							<h6 className="result-question">
								{index + 1}. {result.question}
							</h6>

							<div className="result-answers">
								<div>
									<small className="text-muted">{t.quiz.results.yourAnswer}:</small>
									<p className="mb-1">
										{result.userAnswer}
										{showPinyin && result.userPinyin && ` (${result.userPinyin.toLowerCase()})`}
									</p>
								</div>

								<div>
									<small className="text-muted">{t.quiz.results.correctAnswer}:</small>
									<p className="mb-1">
										{result.correctAnswer}
										{showPinyin && ` (${result.correctPinyin.toLowerCase()})`}
									</p>
								</div>
							</div>

							<small className={`result-status ${result.isCorrect ? "status-correct" : "status-incorrect"}`}>
								<FontAwesomeIcon icon={result.isCorrect ? "check" : "times"} className="me-1" />
								{result.isCorrect ? t.quiz.results.correct : t.quiz.results.incorrect}
							</small>
						</div>
					))}
				</div>

				<div className="text-center">
					<Button variant="primary" onClick={resetQuiz}>
						<FontAwesomeIcon icon="rotate-right" className="me-2" />
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
					<Button variant="outline-primary" onClick={showResults}>
						<FontAwesomeIcon icon="eye" className="me-2" />
						{t.quiz.results.title}
					</Button>
					<Button variant="primary" onClick={resetQuiz}>
						<FontAwesomeIcon icon="rotate-right" className="me-2" />
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

	return (
		<div className="quiz-container">
			{/* Progress bar */}
			<div className="progress-section">
				<small className="mb-2 d-block">{translate(t.quiz.questionNumber, { current: questionNumber.toString(), total: questionCount.toString() })}</small>
				<ProgressBar now={(questionNumber / questionCount) * 100} />
			</div>

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

						let buttonClasses = "answer-button";
						if (isSelected) buttonClasses += " btn-primary";
						if (showResult && isCorrectAnswer) buttonClasses += " correct";
						if (showResult && !isCorrectAnswer) buttonClasses += " incorrect";

						return (
							<div key={index} className="button-wrapper">
								<Button variant={isSelected ? "primary" : "outline-secondary"} className={buttonClasses} onClick={() => handleAnswerSelect(option)} disabled={showResult}>
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
					<Button variant="primary" onClick={handleNextQuestion}>
						{questionNumber >= questionCount ? t.quiz.viewResults : t.quiz.nextQuestion}
					</Button>
				</div>
			)}
		</div>
	);
};

export default Quiz;

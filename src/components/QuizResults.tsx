import "../styles/components/Quiz.scss";

import React, { useEffect, useRef } from "react";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button, Sheet, Table } from "@mui/joy";

import { useT } from "../translations";

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

interface QuizResultsProps {
	score: number;
	questionCount: number;
	results: QuizResult[];
	showJyutping?: boolean;
	showDetailedResults?: boolean;
	onShowDetailedResults?: () => void;
	onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ score, questionCount, results, showJyutping = false, showDetailedResults = false, onShowDetailedResults, onRestart }) => {
	const { t, translate } = useT();
	const bottomRef = useRef<HTMLDivElement>(null);

	// Scroll to bottom when component mounts (for detailed results)
	useEffect(() => {
		if (showDetailedResults && bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [showDetailedResults]);

	const getScoreMessage = () => {
		if (score >= 8) return t.quiz.complete.excellent;
		if (score >= 6) return t.quiz.complete.good;
		if (score >= 4) return t.quiz.complete.keepPracticing;
		return t.quiz.complete.tryAgain;
	};

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
							{results.map((result, index) => {
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
										<td className="table-cell-result">{result.isCorrect ? <CheckIcon className="table-result-icon correct" /> : <CloseIcon className="table-result-icon incorrect" />}</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</Sheet>

				<div className="text-center">
					<Button variant="solid" color="primary" onClick={onRestart}>
						<RefreshIcon className="icon-spacing" />
						{t.quiz.complete.restartButton}
					</Button>
				</div>
				<div ref={bottomRef} />
			</div>
		);
	}

	// Quiz completion screen
	return (
		<div className="completion-container">
			<h2 className="completion-title">{t.quiz.complete.title}</h2>
			<h5 className="completion-score">{translate(t.quiz.complete.score, { score: score.toString(), total: questionCount.toString() })}</h5>
			<p className="completion-message">{getScoreMessage()}</p>
			<div className="completion-actions">
				{onShowDetailedResults && (
					<Button variant="outlined" color="primary" onClick={onShowDetailedResults}>
						<VisibilityIcon className="icon-spacing" />
						{t.quiz.results.title}
					</Button>
				)}
				<Button variant="solid" color="primary" onClick={onRestart}>
					<RefreshIcon className="icon-spacing" />
					{t.quiz.complete.restartButton}
				</Button>
			</div>
		</div>
	);
};

export default QuizResults;

import "bootstrap/dist/css/bootstrap.min.css";
import "./fontawesome";

import React, { useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";

import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import { TranslationProvider, useT } from "./translations";

function AppContent() {
	// Load saved pinyin setting from localStorage
	const getSavedSetting = (key: string, defaultValue: any) => {
		try {
			const saved = localStorage.getItem(`cantonese-quiz-${key}`);
			return saved ? JSON.parse(saved) : defaultValue;
		} catch {
			return defaultValue;
		}
	};

	// Save setting to localStorage
	const saveSetting = (key: string, value: any) => {
		try {
			localStorage.setItem(`cantonese-quiz-${key}`, JSON.stringify(value));
		} catch {
			// Silently ignore localStorage errors
		}
	};

	const [showPinyin, setShowPinyin] = useState<boolean>(getSavedSetting("showPinyin", false));
	const { t } = useT();
	const location = useLocation();

	const handlePinyinToggle = () => {
		const newValue = !showPinyin;
		setShowPinyin(newValue);
		saveSetting("showPinyin", newValue); // Save the setting when it changes
	};

	// Determine current view from URL path
	const getCurrentView = () => {
		switch (location.pathname) {
			case "/":
				return "home";
			case "/quiz":
				return "quiz";
			case "/lessons":
				return "lessons";
			case "/profile":
				return "profile";
			case "/settings":
				return "settings";
			default:
				return "home";
		}
	};

	const currentView = getCurrentView();

	const renderComingSoon = (title: string) => (
		<div className="p-4 text-center">
			<h2 className="mb-3">{t.general.comingSoon}</h2>
			<p className="text-muted">{t.general.underDevelopment}</p>
		</div>
	);

	return (
		<div className="d-flex flex-column min-vh-100">
			<Header showPinyin={showPinyin} onPinyinToggle={handlePinyinToggle} showToggle={currentView === "quiz"} />
			<main
				className="flex-grow-1 d-flex justify-content-center py-4"
				style={{
					alignItems: currentView === "home" ? "center" : "flex-start",
					paddingBottom: "11.125rem", // Increased padding (8rem + 50px) for fixed bottom navigation
				}}
			>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/quiz" element={<Quiz showPinyin={showPinyin} />} />
					<Route path="/lessons" element={renderComingSoon("Lessons")} />
					<Route path="/profile" element={renderComingSoon("Profile")} />
					<Route path="/settings" element={renderComingSoon("Settings")} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
			<BottomNav currentView={currentView} />
		</div>
	);
}

function App() {
	return (
		<Router>
			<TranslationProvider defaultLanguage="sv">
				<AppContent />
			</TranslationProvider>
		</Router>
	);
}

export default App;

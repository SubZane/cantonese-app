import "./fontawesome";

import React, { useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";

import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";

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
		<div className="app-layout-container">
			<div className="sticky-header">
				<Header showPinyin={showPinyin} onPinyinToggle={handlePinyinToggle} showToggle={currentView === "quiz"} />
			</div>
			<main className="main-content-area">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/quiz" element={<Quiz showPinyin={showPinyin} />} />
					<Route path="/lessons" element={renderComingSoon("Lessons")} />
					<Route path="/profile" element={renderComingSoon("Profile")} />
					<Route path="/settings" element={renderComingSoon("Settings")} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
			<div className="bottom-nav-fixed">
				<BottomNav currentView={currentView} />
			</div>
		</div>
	);
}

const customTheme = extendTheme({
	colorSchemes: {
		light: {
			palette: {
				text: {
					primary: "#292A37",
					secondary: "#292A37",
				},

				success: {
					50: "#f6faf2",
					100: "#ecf5e4",
					200: "#d9ebc9",
					300: "#c7e1a7",
					400: "#c7e1a7",
					500: "#c7e1a7",
					600: "#b5d191",
					700: "#a3c17b",
					800: "#91b165",
					900: "#7fa14f",
				},
				danger: {
					50: "#fef5f4",
					100: "#fdeae8",
					200: "#fbd5d1",
					300: "#f9c0ba",
					400: "#e8786e",
					500: "#e8786e",
					600: "#d65e54",
					700: "#c4443a",
					800: "#b22a20",
					900: "#a01006",
				},
			},
		},
	},
});

function App() {
	return (
		<CssVarsProvider theme={customTheme}>
			<CssBaseline />
			<Router>
				<TranslationProvider defaultLanguage="sv">
					<AppContent />
				</TranslationProvider>
			</Router>
		</CssVarsProvider>
	);
}

export default App;

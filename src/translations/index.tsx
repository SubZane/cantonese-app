import React, { createContext, ReactNode, useContext, useState } from "react";

import { en } from "./en";
import { sv } from "./sv";

// Define available languages
export type Language = "sv" | "en";

// Define translation type based on Swedish translations structure
export type TranslationKeys = typeof sv;

// Available translations
const translations: Record<Language, TranslationKeys> = {
	sv,
	en,
};

// Translation context type
interface TranslationContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: TranslationKeys;
	// Helper function for string interpolation
	translate: (key: string, params?: Record<string, string | number>) => string;
}

// Create context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation provider component
interface TranslationProviderProps {
	children: ReactNode;
	defaultLanguage?: Language;
}

const LANGUAGE_STORAGE_KEY = "cantonese-quiz-language";

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children, defaultLanguage = "sv" }) => {
	// Load saved language from localStorage or use default
	const getSavedLanguage = (): Language => {
		try {
			const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
			if (saved) {
				const parsedLanguage = JSON.parse(saved) as Language;
				// Validate that it's a valid language
				if (parsedLanguage === "sv" || parsedLanguage === "en") {
					return parsedLanguage;
				}
			}
		} catch {
			// If there's any error reading from localStorage, fall back to default
		}
		return defaultLanguage;
	};

	const [language, setLanguageState] = useState<Language>(getSavedLanguage);

	// Save language to localStorage whenever it changes
	const setLanguage = (lang: Language) => {
		try {
			localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(lang));
		} catch {
			// Silently ignore localStorage errors
		}
		setLanguageState(lang);
	};

	const currentTranslations = translations[language];

	// Helper function to handle string interpolation
	const translate = (text: string, params?: Record<string, string | number>): string => {
		if (!params) return text;

		return Object.entries(params).reduce((result, [key, value]) => {
			return result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
		}, text);
	};

	const value: TranslationContextType = {
		language,
		setLanguage,
		t: currentTranslations,
		translate,
	};

	return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

// Custom hook to use translations
export const useTranslation = (): TranslationContextType => {
	const context = useContext(TranslationContext);
	if (!context) {
		throw new Error("useTranslation must be used within a TranslationProvider");
	}
	return context;
};

// Helper hook for easier access to translation functions
export const useT = () => {
	const { t, translate } = useTranslation();
	return { t, translate };
};

export default TranslationContext;

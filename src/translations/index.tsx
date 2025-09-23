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

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children, defaultLanguage = "sv" }) => {
	const [language, setLanguage] = useState<Language>(defaultLanguage);

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

import { useCallback, useEffect, useState } from "react";

import vocabularyAPI, { Category, VocabularyItem } from "../services/vocabularyAPI";

/**
 * Hook for vocabulary data management
 */
export const useVocabulary = () => {
	const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Load all vocabulary with optional filters
	 */
	const loadVocabulary = useCallback(
		async (
			filters: {
				category?: string;
				difficulty?: string;
				search?: string;
				has_hk_variant?: boolean;
				limit?: number;
			} = {}
		) => {
			setLoading(true);
			setError(null);

			try {
				const response = await vocabularyAPI.getAllVocabulary(filters);
				setVocabulary(response.data || []);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Failed to load vocabulary";
				setError(errorMessage);
				console.error("Error loading vocabulary:", err);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	/**
	 * Load vocabulary by category
	 */
	const loadVocabularyByCategory = useCallback(
		async (
			categorySlug: string,
			filters: {
				difficulty?: string;
				limit?: number;
			} = {}
		) => {
			setLoading(true);
			setError(null);

			try {
				const response = await vocabularyAPI.getVocabularyByCategory(categorySlug, filters);
				setVocabulary(response.data || []);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Failed to load vocabulary";
				setError(errorMessage);
				console.error("Error loading vocabulary by category:", err);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	/**
	 * Load all categories
	 */
	const loadCategories = useCallback(async () => {
		try {
			const response = await vocabularyAPI.getCategories();
			setCategories(response.data || []);
		} catch (err) {
			console.error("Error loading categories:", err);
		}
	}, []);

	/**
	 * Get vocabulary filtered by criteria (client-side filtering)
	 */
	const getFilteredVocabulary = useCallback(
		(filters: { category?: string; difficulty?: number | string }) => {
			return vocabulary.filter((item) => {
				if (filters.category && filters.category !== "all" && item.category_slug !== filters.category) {
					return false;
				}

				if (filters.difficulty && filters.difficulty !== "all") {
					const difficultyNum = typeof filters.difficulty === "string" ? parseInt(filters.difficulty) : filters.difficulty;
					if (item.difficulty !== difficultyNum) {
						return false;
					}
				}

				return true;
			});
		},
		[vocabulary]
	);

	/**
	 * Convert API vocabulary items to the format expected by the Quiz component
	 */
	const convertToQuizFormat = useCallback((items: VocabularyItem[]) => {
		return items.map((item) => ({
			swedish: item.swedish,
			mainland_cantonese: item.mainland_cantonese,
			hongkong_cantonese: item.hongkong_cantonese,
			jyutping: item.jyutping,
			hongkong_jyutping: item.hongkong_jyutping || undefined,
			difficulty: item.difficulty,
			has_hk_variant: item.has_hk_variant,
		}));
	}, []);

	// Load categories on mount
	useEffect(() => {
		loadCategories();
	}, [loadCategories]);

	return {
		vocabulary,
		categories,
		loading,
		error,
		loadVocabulary,
		loadVocabularyByCategory,
		loadCategories,
		getFilteredVocabulary,
		convertToQuizFormat,
	};
};

/**
 * Hook for quiz generation
 */
export const useQuizGeneration = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generateQuiz = useCallback(
		async (
			params: {
				count?: number;
				difficulty?: string;
				category?: string;
				exclude_used?: string[];
			} = {}
		) => {
			setLoading(true);
			setError(null);

			try {
				const response = await vocabularyAPI.generateQuiz(params);
				return response.data;
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Failed to generate quiz";
				setError(errorMessage);
				console.error("Error generating quiz:", err);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	return {
		generateQuiz,
		loading,
		error,
	};
};

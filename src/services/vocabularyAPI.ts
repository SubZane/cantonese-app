/**
 * API service for Cantonese Vocabulary App
 */

import { getApiUrl } from "../utils/urlUtils";

interface VocabularyItem {
	id: number;
	swedish: string;
	mainland_cantonese: string;
	hongkong_cantonese: string;
	jyutping: string;
	hongkong_jyutping?: string;
	difficulty: number;
	has_hk_variant: boolean;
	category_name: string;
	category_slug: string;
}

interface Category {
	id: number;
	name: string;
	slug: string;
	description: string;
	icon: string;
	vocabulary_count: number;
}

interface QuizQuestion {
	id: number;
	question: string;
	category: string;
	difficulty: number;
	options: {
		mainland_cantonese: string;
		hongkong_cantonese: string;
		jyutping: string;
		hongkong_jyutping?: string;
		has_hk_variant: boolean;
		is_correct: boolean;
	}[];
	correct_answer: {
		mainland_cantonese: string;
		hongkong_cantonese: string;
		jyutping: string;
		hongkong_jyutping?: string;
		has_hk_variant: boolean;
	};
}

interface APIResponse<T> {
	data?: T;
	count?: number;
	error?: boolean;
	message?: string;
	code?: number;
}

class VocabularyAPIService {
	private baseUrl: string;

	constructor() {
		this.baseUrl = getApiUrl();
	}

	/**
	 * Generic API call method
	 */
	private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}/${endpoint.replace(/^\//, "")}`;

		const defaultOptions: RequestInit = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const response = await fetch(url, { ...defaultOptions, ...options });

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: "Network error" }));
			throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Get all vocabulary with optional filters
	 */
	async getAllVocabulary(
		filters: {
			category?: string;
			difficulty?: string;
			search?: string;
			has_hk_variant?: boolean;
			limit?: number;
		} = {}
	): Promise<APIResponse<VocabularyItem[]>> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				params.append(key, String(value));
			}
		});

		const query = params.toString();
		const endpoint = `vocabulary${query ? `?${query}` : ""}`;

		return this.apiCall<APIResponse<VocabularyItem[]>>(endpoint);
	}

	/**
	 * Get vocabulary by category
	 */
	async getVocabularyByCategory(
		categorySlug: string,
		filters: {
			difficulty?: string;
			limit?: number;
		} = {}
	): Promise<APIResponse<VocabularyItem[]>> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				params.append(key, String(value));
			}
		});

		const query = params.toString();
		const endpoint = `categories/${categorySlug}/vocabulary${query ? `?${query}` : ""}`;

		return this.apiCall<APIResponse<VocabularyItem[]>>(endpoint);
	}

	/**
	 * Get all categories
	 */
	async getCategories(): Promise<APIResponse<Category[]>> {
		return this.apiCall<APIResponse<Category[]>>("categories");
	}

	/**
	 * Generate quiz questions
	 */
	async generateQuiz(
		params: {
			count?: number;
			difficulty?: string;
			category?: string;
			exclude_used?: string[];
		} = {}
	): Promise<APIResponse<{ questions: QuizQuestion[]; count: number; parameters: any }>> {
		const queryParams = new URLSearchParams();

		if (params.count) queryParams.append("count", String(params.count));
		if (params.difficulty) queryParams.append("difficulty", params.difficulty);
		if (params.category) queryParams.append("category", params.category);
		if (params.exclude_used && params.exclude_used.length > 0) {
			queryParams.append("exclude_used", params.exclude_used.join(","));
		}

		const query = queryParams.toString();
		const endpoint = `quiz/generate${query ? `?${query}` : ""}`;

		return this.apiCall<APIResponse<{ questions: QuizQuestion[]; count: number; parameters: any }>>(endpoint);
	}

	/**
	 * Get API health status
	 */
	async getHealth(): Promise<{ status: string; timestamp: string; database: any }> {
		return this.apiCall<{ status: string; timestamp: string; database: any }>("health");
	}
}

// Create singleton instance
const vocabularyAPI = new VocabularyAPIService();

export default vocabularyAPI;
export type { VocabularyItem, Category, QuizQuestion, APIResponse };

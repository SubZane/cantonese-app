/**
 * URL utilities for the Cantonese App
 */

/**
 * Get the base app URL from environment variables
 */
export const getAppUrl = (): string => {
	return process.env.REACT_APP_URL || window.location.origin;
};

/**
 * Get the API base URL from environment variables
 */
export const getApiUrl = (): string => {
	return process.env.REACT_APP_API_BASE_URL || "http://localhost/backend/api";
};

/**
 * Generate an absolute URL for a given path
 * @param path - The path to append to the app URL (with or without leading slash)
 */
export const getAbsoluteUrl = (path: string): string => {
	const baseUrl = getAppUrl();
	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return `${baseUrl}${cleanPath}`;
};

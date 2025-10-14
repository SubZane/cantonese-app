<?php

/**
 * CORS Configuration Helper
 * Handles Cross-Origin Resource Sharing for the Cantonese App API
 */

class CORSHandler
{
	private static $allowedOrigins = [
		'http://localhost:3000',     // React development server
		'http://localhost:3001',     // Alternative React port
		'http://127.0.0.1:3000',     // Alternative localhost format
	];

	/**
	 * Set CORS headers based on request origin
	 */
	public static function setCORSHeaders()
	{
		$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

		// Check if origin is allowed
		if (in_array($origin, self::$allowedOrigins)) {
			header("Access-Control-Allow-Origin: $origin");
		} else {
			// For development, allow localhost:3000 as fallback
			header('Access-Control-Allow-Origin: http://localhost:3000');
		}

		// Set other CORS headers
		header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, PATCH');
		header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, X-HTTP-Method-Override');
		header('Access-Control-Allow-Credentials: true');
		header('Access-Control-Max-Age: 86400'); // Cache preflight for 24 hours
		header('Vary: Origin');
	}

	/**
	 * Handle preflight OPTIONS requests
	 */
	public static function handlePreflight()
	{
		if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
			self::setCORSHeaders();
			http_response_code(204); // No Content
			exit();
		}
	}

	/**
	 * Add production origins (call this when deploying)
	 */
	public static function addProductionOrigins($origins = [])
	{
		self::$allowedOrigins = array_merge(self::$allowedOrigins, $origins);
	}
}

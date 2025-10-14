<?php

/**
 * Production CORS Configuration
 * 
 * To use this in production:
 * 1. Update the $productionOrigins array with your actual domain(s)
 * 2. Include this file in your main index.php
 * 3. Set environment variable ENVIRONMENT=production
 */

// Add production origins when deploying
if (isset($_ENV['ENVIRONMENT']) && $_ENV['ENVIRONMENT'] === 'production') {
	$productionOrigins = [
		'https://your-domain.com',
		'https://www.your-domain.com',
		// Add your production domains here
	];

	CORSHandler::addProductionOrigins($productionOrigins);
}

/**
 * Environment-specific CORS settings
 */
class ProductionCORS
{
	/**
	 * Set stricter CORS for production
	 */
	public static function setProductionCORS()
	{
		if (self::isProduction()) {
			// More restrictive headers for production
			header('Access-Control-Max-Age: 3600'); // Shorter cache time
			header('X-Content-Type-Options: nosniff');
			header('X-Frame-Options: DENY');
			header('X-XSS-Protection: 1; mode=block');
		}
	}

	/**
	 * Check if running in production
	 */
	private static function isProduction()
	{
		return isset($_ENV['ENVIRONMENT']) && $_ENV['ENVIRONMENT'] === 'production';
	}
}

// Apply production-specific headers
ProductionCORS::setProductionCORS();

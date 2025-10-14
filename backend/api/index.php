<?php

/**
 * Main API router for Cantonese App
 */

// Set CORS headers immediately - MUST be first!
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, PATCH');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, X-HTTP-Method-Override');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header('Vary: Origin');

// Handle preflight OPTIONS requests immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(204);
	exit();
}

// Set content type for API responses
header('Content-Type: application/json; charset=utf-8');

// Get the request path - try multiple methods
$path = '';

if (isset($_SERVER['PATH_INFO'])) {
	// If PATH_INFO is available, use it
	$path = $_SERVER['PATH_INFO'];
} else {
	// Otherwise, parse from REQUEST_URI
	$request_uri = $_SERVER['REQUEST_URI'];
	$path = parse_url($request_uri, PHP_URL_PATH);

	// Remove base path if present
	$basePath = '/cantonese-app/backend/api';
	if (strpos($path, $basePath) === 0) {
		$path = substr($path, strlen($basePath));
	}
}

// Remove leading slash and get segments
$path = ltrim($path, '/');
$segments = explode('/', $path);
$endpoint = $segments[0] ?? '';

try {
	// Only require database and API classes when needed (not for health check)
	if ($endpoint !== 'health' && $endpoint !== '') {
		require_once __DIR__ . '/../config/database.php';
		require_once __DIR__ . '/VocabularyAPI.php';
		$vocabularyAPI = new VocabularyAPI();
	}

	switch ($endpoint) {
		case 'health':
			echo json_encode([
				'status' => 'healthy',
				'timestamp' => date('Y-m-d H:i:s'),
				'message' => 'Cantonese Vocabulary API is running',
				'database' => 'connected'
			]);
			break;

		case 'vocabulary':
			if (!isset($vocabularyAPI)) {
				require_once __DIR__ . '/../config/database.php';
				require_once __DIR__ . '/VocabularyAPI.php';
				$vocabularyAPI = new VocabularyAPI();
			}

			$filters = [];
			if (isset($_GET['limit'])) $filters['limit'] = (int)$_GET['limit'];
			if (isset($_GET['offset'])) $filters['offset'] = (int)$_GET['offset'];
			if (isset($_GET['category'])) $filters['category'] = $_GET['category'];
			if (isset($_GET['difficulty'])) $filters['difficulty'] = (int)$_GET['difficulty'];
			if (isset($_GET['search'])) $filters['search'] = $_GET['search'];

			$result = $vocabularyAPI->getAllVocabulary($filters);
			echo json_encode($result);
			break;

		case 'categories':
			if (!isset($vocabularyAPI)) {
				require_once __DIR__ . '/../config/database.php';
				require_once __DIR__ . '/VocabularyAPI.php';
				$vocabularyAPI = new VocabularyAPI();
			}

			if (isset($segments[1]) && !empty($segments[1])) {
				$category = $segments[1];
				if (isset($segments[2]) && $segments[2] === 'vocabulary') {
					$filters = [];
					if (isset($_GET['limit'])) $filters['limit'] = (int)$_GET['limit'];
					if (isset($_GET['offset'])) $filters['offset'] = (int)$_GET['offset'];
					if (isset($_GET['difficulty'])) $filters['difficulty'] = (int)$_GET['difficulty'];
					if (isset($_GET['search'])) $filters['search'] = $_GET['search'];

					$result = $vocabularyAPI->getVocabularyByCategory($category, $filters);
					echo json_encode($result);
				} else {
					http_response_code(404);
					echo json_encode(['error' => 'Endpoint not found']);
				}
			} else {
				$result = $vocabularyAPI->getCategories();
				echo json_encode($result);
			}
			break;

		case 'quiz':
			if (!isset($vocabularyAPI)) {
				require_once __DIR__ . '/../config/database.php';
				require_once __DIR__ . '/VocabularyAPI.php';
				$vocabularyAPI = new VocabularyAPI();
			}

			if (isset($segments[1]) && $segments[1] === 'generate') {
				$params = [];
				if (isset($_GET['count'])) $params['count'] = (int)$_GET['count'];
				if (isset($_GET['category'])) $params['category'] = $_GET['category'];
				if (isset($_GET['difficulty'])) $params['difficulty'] = (int)$_GET['difficulty'];

				$result = $vocabularyAPI->generateQuiz($params);
				echo json_encode($result);
			} else {
				http_response_code(404);
				echo json_encode(['error' => 'Endpoint not found']);
			}
			break;

		case '':
			// Root endpoint
			echo json_encode([
				'message' => 'Cantonese Vocabulary API',
				'version' => '1.0.0',
				'endpoints' => [
					'/health' => 'Health check',
					'/vocabulary' => 'Get all vocabulary',
					'/categories' => 'Get all categories',
					'/categories/{category}/vocabulary' => 'Get vocabulary by category',
					'/quiz/generate' => 'Generate quiz questions'
				]
			]);
			break;

		default:
			http_response_code(404);
			echo json_encode(['error' => 'Endpoint not found: ' . $endpoint]);
			break;
	}
} catch (Exception $e) {
	http_response_code(500);
	echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
}

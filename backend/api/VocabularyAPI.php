<?php

/**
 * Vocabulary API endpoints
 */

class VocabularyAPI
{
	private $pdo;

	public function __construct()
	{
		$this->pdo = getDB();
	}

	/**
	 * Get all vocabulary with optional filters
	 */
	public function getAllVocabulary($filters = [])
	{
		$sql = "
            SELECT v.*, c.name as category_name, c.slug as category_slug
            FROM vocabulary v 
            JOIN categories c ON v.category_id = c.id
        ";

		$where = [];
		$params = [];

		// Apply filters
		if (!empty($filters['category'])) {
			$where[] = "c.slug = ?";
			$params[] = $filters['category'];
		}

		if (!empty($filters['difficulty'])) {
			$where[] = "v.difficulty = ?";
			$params[] = (int)$filters['difficulty'];
		}

		if (!empty($filters['search'])) {
			$where[] = "v.id IN (SELECT rowid FROM vocabulary_fts WHERE vocabulary_fts MATCH ?)";
			$params[] = $filters['search'] . "*";
		}

		if (!empty($filters['has_hk_variant'])) {
			$where[] = "v.has_hk_variant = ?";
			$params[] = $filters['has_hk_variant'] === 'true' ? 1 : 0;
		}

		if (!empty($where)) {
			$sql .= " WHERE " . implode(" AND ", $where);
		}

		$sql .= " ORDER BY v.swedish ASC";

		// Add limit if specified
		if (!empty($filters['limit'])) {
			$sql .= " LIMIT " . (int)$filters['limit'];
		}

		$stmt = $this->pdo->prepare($sql);
		$stmt->execute($params);

		return [
			'data' => $stmt->fetchAll(),
			'count' => $stmt->rowCount(),
			'filters' => $filters
		];
	}

	/**
	 * Get vocabulary by ID
	 */
	public function getVocabularyById($id)
	{
		$sql = "
            SELECT v.*, c.name as category_name, c.slug as category_slug
            FROM vocabulary v 
            JOIN categories c ON v.category_id = c.id
            WHERE v.id = ?
        ";

		$stmt = $this->pdo->prepare($sql);
		$stmt->execute([$id]);
		$result = $stmt->fetch();

		if (!$result) {
			throw new Exception('Vocabulary entry not found', 404);
		}

		return $result;
	}

	/**
	 * Get vocabulary by category
	 */
	public function getVocabularyByCategory($categorySlug, $filters = [])
	{
		$filters['category'] = $categorySlug;
		return $this->getAllVocabulary($filters);
	}

	/**
	 * Get all categories
	 */
	public function getCategories()
	{
		$sql = "
            SELECT c.*, COUNT(v.id) as vocabulary_count
            FROM categories c 
            LEFT JOIN vocabulary v ON c.id = v.category_id
            GROUP BY c.id
            ORDER BY c.name ASC
        ";

		$stmt = $this->pdo->query($sql);

		return [
			'data' => $stmt->fetchAll()
		];
	}

	/**
	 * Generate quiz questions
	 */
	public function generateQuiz($params = [])
	{
		$questionCount = min((int)($params['count'] ?? 10), 50); // Max 50 questions
		$difficulty = $params['difficulty'] ?? 'all';
		$category = $params['category'] ?? 'all';
		$excludeUsed = $params['exclude_used'] ?? '';

		// Build base query
		$sql = "
            SELECT v.*, c.slug as category_slug
            FROM vocabulary v 
            JOIN categories c ON v.category_id = c.id
        ";

		$where = [];
		$queryParams = [];

		// Apply filters
		if ($difficulty !== 'all') {
			$where[] = "v.difficulty = ?";
			$queryParams[] = (int)$difficulty;
		}

		if ($category !== 'all') {
			$where[] = "c.slug = ?";
			$queryParams[] = $category;
		}

		// Exclude previously used words
		if (!empty($excludeUsed)) {
			$usedWords = explode(',', $excludeUsed);
			$placeholders = str_repeat('?,', count($usedWords) - 1) . '?';
			$where[] = "v.swedish NOT IN ($placeholders)";
			$queryParams = array_merge($queryParams, $usedWords);
		}

		if (!empty($where)) {
			$sql .= " WHERE " . implode(" AND ", $where);
		}

		$sql .= " ORDER BY RANDOM() LIMIT ?";
		$queryParams[] = $questionCount;

		$stmt = $this->pdo->prepare($sql);
		$stmt->execute($queryParams);
		$correctAnswers = $stmt->fetchAll();

		if (count($correctAnswers) < $questionCount) {
			throw new Exception("Not enough vocabulary entries found. Found " .
				count($correctAnswers) . " but need " . $questionCount, 400);
		}

		// Generate quiz questions with wrong options
		$questions = [];
		foreach ($correctAnswers as $correct) {
			$questions[] = $this->generateQuizQuestion($correct, $category);
		}

		return [
			'questions' => $questions,
			'count' => count($questions),
			'parameters' => [
				'difficulty' => $difficulty,
				'category' => $category,
				'question_count' => $questionCount
			]
		];
	}

	/**
	 * Generate a single quiz question with wrong options
	 */
	private function generateQuizQuestion($correct, $categoryFilter = 'all')
	{
		// Get wrong options from the same or all categories
		$sql = "
            SELECT DISTINCT v.mainland_cantonese, v.hongkong_cantonese, v.jyutping, 
                   v.hongkong_jyutping, v.has_hk_variant
            FROM vocabulary v
            JOIN categories c ON v.category_id = c.id
            WHERE v.swedish != ?
        ";

		$params = [$correct['swedish']];

		if ($categoryFilter !== 'all') {
			$sql .= " AND c.slug = ?";
			$params[] = $categoryFilter;
		}

		$sql .= " ORDER BY RANDOM() LIMIT 20"; // Get more than needed to ensure variety

		$stmt = $this->pdo->prepare($sql);
		$stmt->execute($params);
		$wrongOptions = $stmt->fetchAll();

		// If not enough wrong options from same category, get from all categories
		if (count($wrongOptions) < 3 && $categoryFilter !== 'all') {
			$sql = "
                SELECT DISTINCT v.mainland_cantonese, v.hongkong_cantonese, v.jyutping,
                       v.hongkong_jyutping, v.has_hk_variant
                FROM vocabulary v
                WHERE v.swedish != ?
                ORDER BY RANDOM() LIMIT 20
            ";

			$stmt = $this->pdo->prepare($sql);
			$stmt->execute([$correct['swedish']]);
			$wrongOptions = $stmt->fetchAll();
		}

		// Select 3 random wrong options
		$selectedWrong = array_slice($wrongOptions, 0, 3);

		// Create options array with correct answer
		$options = [];

		// Add correct answer
		$options[] = [
			'mainland_cantonese' => $correct['mainland_cantonese'],
			'hongkong_cantonese' => $correct['hongkong_cantonese'],
			'jyutping' => $correct['jyutping'],
			'hongkong_jyutping' => $correct['hongkong_jyutping'],
			'has_hk_variant' => (bool)$correct['has_hk_variant'],
			'is_correct' => true
		];

		// Add wrong options
		foreach ($selectedWrong as $wrong) {
			$options[] = [
				'mainland_cantonese' => $wrong['mainland_cantonese'],
				'hongkong_cantonese' => $wrong['hongkong_cantonese'],
				'jyutping' => $wrong['jyutping'],
				'hongkong_jyutping' => $wrong['hongkong_jyutping'],
				'has_hk_variant' => (bool)$wrong['has_hk_variant'],
				'is_correct' => false
			];
		}

		// Shuffle options
		shuffle($options);

		return [
			'id' => $correct['id'],
			'question' => $correct['swedish'],
			'category' => $correct['category_slug'],
			'difficulty' => $correct['difficulty'],
			'options' => $options,
			'correct_answer' => [
				'mainland_cantonese' => $correct['mainland_cantonese'],
				'hongkong_cantonese' => $correct['hongkong_cantonese'],
				'jyutping' => $correct['jyutping'],
				'hongkong_jyutping' => $correct['hongkong_jyutping'],
				'has_hk_variant' => (bool)$correct['has_hk_variant']
			]
		];
	}

	/**
	 * Get statistics about the vocabulary database
	 */
	public function getStatistics()
	{
		$stats = [];

		// Total count
		$stmt = $this->pdo->query('SELECT COUNT(*) as total FROM vocabulary');
		$stats['total'] = $stmt->fetch()['total'];

		// By category
		$stmt = $this->pdo->query('
            SELECT c.name, c.slug, COUNT(v.id) as count 
            FROM categories c 
            LEFT JOIN vocabulary v ON c.id = v.category_id 
            GROUP BY c.id 
            ORDER BY count DESC
        ');
		$stats['by_category'] = $stmt->fetchAll();

		// By difficulty
		$stmt = $this->pdo->query('
            SELECT difficulty, COUNT(*) as count 
            FROM vocabulary 
            GROUP BY difficulty 
            ORDER BY difficulty
        ');
		$stats['by_difficulty'] = $stmt->fetchAll();

		// HK variants
		$stmt = $this->pdo->query('
            SELECT has_hk_variant, COUNT(*) as count 
            FROM vocabulary 
            GROUP BY has_hk_variant
        ');
		$stats['hk_variants'] = $stmt->fetchAll();

		return $stats;
	}
}

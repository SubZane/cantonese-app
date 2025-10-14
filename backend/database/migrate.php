<?php

/**
 * Migration script to import JSON vocabulary data into SQLite database
 */

require_once __DIR__ . '/../config/database.php';

class VocabularyMigration
{
	private $pdo;
	private $categoryMapping = [
		'animals' => 1,
		'food' => 2,
		'family' => 3,
		'actions' => 4,
		'items' => 5,
		'fun-play' => 6,
		'time' => 7,
		'movement-directions' => 8
	];

	public function __construct()
	{
		$this->pdo = getDB();
	}

	public function migrate()
	{
		echo "Starting vocabulary migration...\n";

		// Initialize database schema
		echo "Initializing database schema...\n";
		initDB();

		// Clear existing vocabulary data
		echo "Clearing existing vocabulary data...\n";
		$this->clearVocabularyData();

		// Import JSON files
		$jsonPath = __DIR__ . '/../../src/data/';
		$files = [
			'animals.json' => 'animals',
			'food.json' => 'food',
			'family.json' => 'family',
			'actions.json' => 'actions',
			'items.json' => 'items',
			'fun-play.json' => 'fun-play',
			'time.json' => 'time',
			'movement-directions.json' => 'movement-directions'
		];

		$totalImported = 0;

		foreach ($files as $filename => $category) {
			$filePath = $jsonPath . $filename;
			if (file_exists($filePath)) {
				echo "Importing {$filename}...\n";
				$imported = $this->importJsonFile($filePath, $category);
				echo "Imported {$imported} entries from {$filename}\n";
				$totalImported += $imported;
			} else {
				echo "Warning: File {$filename} not found at {$filePath}\n";
			}
		}

		echo "\nMigration completed successfully!\n";
		echo "Total entries imported: {$totalImported}\n";

		// Display statistics
		$this->displayStatistics();

		return $totalImported;
	}

	private function clearVocabularyData()
	{
		$this->pdo->exec('DELETE FROM vocabulary_fts');
		$this->pdo->exec('DELETE FROM vocabulary');
		$this->pdo->exec('DELETE FROM sqlite_sequence WHERE name="vocabulary"');
	}

	private function importJsonFile($filePath, $category)
	{
		$data = json_decode(file_get_contents($filePath), true);

		if (!$data) {
			throw new Exception("Failed to parse JSON file: {$filePath}");
		}

		$categoryId = $this->categoryMapping[$category];
		$imported = 0;

		$stmt = $this->pdo->prepare("
            INSERT INTO vocabulary (
                swedish, 
                mainland_cantonese, 
                hongkong_cantonese, 
                jyutping, 
                hongkong_jyutping,
                difficulty, 
                has_hk_variant, 
                category_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");

		foreach ($data as $entry) {
			try {
				// Validate required fields
				if (
					empty($entry['swedish']) || empty($entry['mainland_cantonese']) ||
					empty($entry['hongkong_cantonese']) || empty($entry['jyutping'])
				) {
					echo "Warning: Skipping entry with missing required fields: " .
						json_encode($entry) . "\n";
					continue;
				}

				$stmt->execute([
					$entry['swedish'],
					$entry['mainland_cantonese'],
					$entry['hongkong_cantonese'],
					$entry['jyutping'],
					$entry['hongkong_jyutping'] ?? null,
					$entry['difficulty'] ?? 1,
					isset($entry['has_hk_variant']) ? ($entry['has_hk_variant'] ? 1 : 0) : 0,
					$categoryId
				]);

				$imported++;
			} catch (PDOException $e) {
				echo "Warning: Failed to import entry '{$entry['swedish']}': " .
					$e->getMessage() . "\n";
			}
		}

		return $imported;
	}

	private function displayStatistics()
	{
		echo "\n=== Database Statistics ===\n";

		// Total entries
		$stmt = $this->pdo->query('SELECT COUNT(*) as total FROM vocabulary');
		$total = $stmt->fetch()['total'];
		echo "Total vocabulary entries: {$total}\n";

		// By category
		$stmt = $this->pdo->query('
            SELECT c.name, COUNT(v.id) as count 
            FROM categories c 
            LEFT JOIN vocabulary v ON c.id = v.category_id 
            GROUP BY c.id, c.name 
            ORDER BY count DESC
        ');

		echo "\nBy category:\n";
		while ($row = $stmt->fetch()) {
			echo "  {$row['name']}: {$row['count']}\n";
		}

		// By difficulty
		$stmt = $this->pdo->query('
            SELECT difficulty, COUNT(*) as count 
            FROM vocabulary 
            GROUP BY difficulty 
            ORDER BY difficulty
        ');

		echo "\nBy difficulty:\n";
		while ($row = $stmt->fetch()) {
			echo "  Level {$row['difficulty']}: {$row['count']}\n";
		}

		// HK variants
		$stmt = $this->pdo->query('
            SELECT has_hk_variant, COUNT(*) as count 
            FROM vocabulary 
            GROUP BY has_hk_variant
        ');

		echo "\nHK Variants:\n";
		while ($row = $stmt->fetch()) {
			$label = $row['has_hk_variant'] ? 'Has HK variant' : 'No HK variant';
			echo "  {$label}: {$row['count']}\n";
		}
	}

	public function verify()
	{
		echo "\n=== Verification ===\n";

		// Check for duplicates
		$stmt = $this->pdo->query('
            SELECT swedish, COUNT(*) as count 
            FROM vocabulary 
            GROUP BY swedish 
            HAVING count > 1
        ');

		$duplicates = $stmt->fetchAll();
		if (count($duplicates) > 0) {
			echo "Warning: Found " . count($duplicates) . " duplicate Swedish words:\n";
			foreach ($duplicates as $dup) {
				echo "  {$dup['swedish']} ({$dup['count']} occurrences)\n";
			}
		} else {
			echo "✓ No duplicate Swedish words found\n";
		}

		// Check for empty fields
		$stmt = $this->pdo->query('
            SELECT COUNT(*) as count 
            FROM vocabulary 
            WHERE swedish IS NULL OR swedish = "" OR 
                  mainland_cantonese IS NULL OR mainland_cantonese = "" OR
                  hongkong_cantonese IS NULL OR hongkong_cantonese = "" OR
                  jyutping IS NULL OR jyutping = ""
        ');

		$emptyFields = $stmt->fetch()['count'];
		if ($emptyFields > 0) {
			echo "Warning: Found {$emptyFields} entries with empty required fields\n";
		} else {
			echo "✓ All entries have required fields populated\n";
		}

		echo "\nVerification completed.\n";
	}
}

// Run migration if called directly
if (basename(__FILE__) == basename($_SERVER['PHP_SELF'])) {
	try {
		$migration = new VocabularyMigration();
		$migration->migrate();
		$migration->verify();

		echo "\n🎉 Migration completed successfully!\n";
	} catch (Exception $e) {
		echo "\n❌ Migration failed: " . $e->getMessage() . "\n";
		exit(1);
	}
}

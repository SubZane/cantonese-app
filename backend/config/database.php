<?php

/**
 * Database Configuration for Cantonese App
 */

class DatabaseConfig
{
	private static $instance = null;
	private $pdo;

	// Database settings
	private $dbPath;
	private $options = [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES => false,
	];

	private function __construct()
	{
		$this->dbPath = $this->getDatabasePath();
		$this->connect();
	}

	public static function getInstance()
	{
		if (self::$instance === null) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function getDatabasePath()
	{
		// Load environment configuration
		$env = $this->loadEnv();

		if (isset($env['DB_PATH'])) {
			return $env['DB_PATH'];
		}

		// Default path
		return __DIR__ . '/cantonese_vocabulary.db';
	}

	private function loadEnv()
	{
		$envFile = __DIR__ . '/../.env';
		$env = [];

		if (file_exists($envFile)) {
			$lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
			foreach ($lines as $line) {
				if (strpos($line, '=') !== false && !str_starts_with(trim($line), '#')) {
					list($key, $value) = explode('=', $line, 2);
					$env[trim($key)] = trim($value, '"\'');
				}
			}
		}

		return $env;
	}

	private function connect()
	{
		try {
			$dsn = "sqlite:" . $this->dbPath;
			$this->pdo = new PDO($dsn, null, null, $this->options);

			// Enable foreign keys
			$this->pdo->exec('PRAGMA foreign_keys = ON');
			$this->pdo->exec('PRAGMA journal_mode = WAL');
		} catch (PDOException $e) {
			throw new Exception("Database connection failed: " . $e->getMessage());
		}
	}

	public function getConnection()
	{
		return $this->pdo;
	}

	public function initializeDatabase()
	{
		$schemaFile = __DIR__ . '/../database/schema.sql';

		if (!file_exists($schemaFile)) {
			throw new Exception("Schema file not found: " . $schemaFile);
		}

		// Execute schema directly - SQLite can handle multiple statements
		$schema = file_get_contents($schemaFile);

		try {
			$this->pdo->exec($schema);
		} catch (PDOException $e) {
			// If there's an error, try executing statement by statement
			$statements = explode(';', $schema);

			foreach ($statements as $statement) {
				$statement = trim($statement);
				if (!empty($statement)) {
					try {
						$this->pdo->exec($statement);
					} catch (PDOException $e2) {
						// Skip if already exists
						if (strpos($e2->getMessage(), 'already exists') === false) {
							throw new Exception("Failed to execute SQL: $statement. Error: " . $e2->getMessage());
						}
					}
				}
			}
		}

		return true;
	}

	public function getDbPath()
	{
		return $this->dbPath;
	}

	// Prevent cloning
	private function __clone() {}

	// Prevent unserialization
	public function __wakeup()
	{
		throw new Exception("Cannot unserialize singleton");
	}
}

/**
 * Helper function to get database connection
 */
function getDB()
{
	return DatabaseConfig::getInstance()->getConnection();
}

/**
 * Initialize database with schema
 */
function initDB()
{
	return DatabaseConfig::getInstance()->initializeDatabase();
}

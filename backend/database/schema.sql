-- Cantonese Vocabulary Database Schema
-- SQLite database structure for vocabulary data

-- Main vocabulary table
CREATE TABLE IF NOT EXISTS vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    swedish TEXT NOT NULL UNIQUE,
    mainland_cantonese TEXT NOT NULL,
    hongkong_cantonese TEXT NOT NULL,
    jyutping TEXT NOT NULL,
    hongkong_jyutping TEXT DEFAULT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 3),
    has_hk_variant BOOLEAN DEFAULT FALSE,
    category_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT OR IGNORE INTO categories (id, name, slug, description, icon) VALUES
(1, 'Animals', 'animals', 'Animal vocabulary', 'dog'),
(2, 'Food', 'food', 'Food and drinks', 'utensils'),
(3, 'Family', 'family', 'Family members and relationships', 'users'),
(4, 'Actions', 'actions', 'Verbs and actions', 'running'),
(5, 'Items', 'items', 'Common objects and items', 'box'),
(6, 'Fun & Play', 'fun-play', 'Entertainment and games', 'gamepad'),
(7, 'Time', 'time', 'Time-related vocabulary', 'clock'),
(8, 'Movement & Directions', 'movement-directions', 'Movement and directional terms', 'arrows-alt');

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vocabulary_category ON vocabulary(category_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_difficulty ON vocabulary(difficulty);
CREATE INDEX IF NOT EXISTS idx_vocabulary_swedish ON vocabulary(swedish);
CREATE INDEX IF NOT EXISTS idx_vocabulary_has_hk_variant ON vocabulary(has_hk_variant);

-- Full-text search index for vocabulary
CREATE VIRTUAL TABLE IF NOT EXISTS vocabulary_fts USING fts5(
    swedish, 
    mainland_cantonese, 
    hongkong_cantonese, 
    jyutping,
    content='vocabulary',
    content_rowid='id'
);

-- Trigger to maintain FTS index
CREATE TRIGGER IF NOT EXISTS vocabulary_fts_insert AFTER INSERT ON vocabulary BEGIN
    INSERT INTO vocabulary_fts(rowid, swedish, mainland_cantonese, hongkong_cantonese, jyutping) 
    VALUES (new.id, new.swedish, new.mainland_cantonese, new.hongkong_cantonese, new.jyutping);
END;

CREATE TRIGGER IF NOT EXISTS vocabulary_fts_delete AFTER DELETE ON vocabulary BEGIN
    DELETE FROM vocabulary_fts WHERE rowid = old.id;
END;

CREATE TRIGGER IF NOT EXISTS vocabulary_fts_update AFTER UPDATE ON vocabulary BEGIN
    DELETE FROM vocabulary_fts WHERE rowid = old.id;
    INSERT INTO vocabulary_fts(rowid, swedish, mainland_cantonese, hongkong_cantonese, jyutping) 
    VALUES (new.id, new.swedish, new.mainland_cantonese, new.hongkong_cantonese, new.jyutping);
END;

-- Update timestamp trigger
CREATE TRIGGER IF NOT EXISTS vocabulary_updated_at AFTER UPDATE ON vocabulary BEGIN
    UPDATE vocabulary SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
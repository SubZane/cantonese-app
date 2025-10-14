# Cantonese App Backend

SQLite database backend with PHP REST API for the Cantonese vocabulary learning application.

## 🗄️ Database Structure

### Tables

- **vocabulary** - Main vocabulary entries with Swedish, Cantonese variants, Jyutping, difficulty levels
- **categories** - Vocabulary categories (animals, food, family, etc.)
- **vocabulary_fts** - Full-text search index for vocabulary

### Features

- SQLite database with foreign key constraints
- Full-text search capabilities
- Indexed queries for performance
- Automatic timestamp tracking

## 🚀 Setup Instructions

### 1. Initialize Database

```bash
cd backend/database
php migrate.php
```

This will:

- Create the SQLite database schema
- Import all JSON vocabulary data
- Set up full-text search indexes
- Display import statistics and verification

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
```

Edit `.env` file with your database path and API settings:

```
DB_PATH="/path/to/your/database/cantonese_vocabulary.db"
API_BASE_URL="http://localhost/backend/api"
DEBUG=true
```

### 3. Set up Web Server

The PHP backend requires a web server. For development:

**Option A: PHP Built-in Server**

```bash
cd backend/api
php -S localhost:8080
```

**Option B: Use existing Apache/Nginx**

- Place the `backend` folder in your web root
- Access via `http://localhost/backend/api`

## 📡 API Endpoints

### Health Check

```
GET /health
```

Returns API and database status.

### Vocabulary

```
GET /vocabulary                    # Get all vocabulary
GET /vocabulary?category=animals   # Filter by category
GET /vocabulary?difficulty=1       # Filter by difficulty
GET /vocabulary?search=狗          # Search vocabulary
GET /vocabulary/{id}               # Get specific entry
```

### Categories

```
GET /categories                           # Get all categories
GET /categories/{slug}/vocabulary         # Get vocabulary by category
```

### Quiz Generation

```
GET /quiz/generate?count=10&category=animals&difficulty=1
```

Parameters:

- `count` - Number of questions (max 50)
- `category` - Category slug or 'all'
- `difficulty` - Difficulty level (1-3) or 'all'
- `exclude_used` - Comma-separated list of Swedish words to exclude

## 🔧 Development Configuration

### React App Environment

Create `.env.development` in the React app root:

```
REACT_APP_API_BASE_URL=http://localhost/backend/api
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

### Production Configuration

Create `.env.production`:

```
REACT_APP_API_BASE_URL=https://your-domain.com/backend/api
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
```

## 📊 Database Statistics

After migration, you'll see statistics like:

- Total vocabulary entries: 653
- By category (Food: 115, Actions: 114, etc.)
- By difficulty level (1-3)
- Hong Kong variant availability

## 🔍 API Usage Examples

### JavaScript/React

```javascript
import vocabularyAPI from "./services/vocabularyAPI";

// Get all animals vocabulary
const animals = await vocabularyAPI.getVocabularyByCategory("animals");

// Generate a quiz
const quiz = await vocabularyAPI.generateQuiz({
	count: 10,
	category: "food",
	difficulty: "1",
});

// Search vocabulary
const results = await vocabularyAPI.getAllVocabulary({
	search: "狗",
	limit: 20,
});
```

### cURL Examples

```bash
# Get health status
curl http://localhost/backend/api/health

# Get all categories
curl http://localhost/backend/api/categories

# Get animals vocabulary
curl http://localhost/backend/api/categories/animals/vocabulary

# Generate quiz
curl "http://localhost/backend/api/quiz/generate?count=5&category=food"
```

## 🛠️ Troubleshooting

### Database Issues

- Ensure SQLite extension is enabled in PHP
- Check file permissions on database directory
- Verify database path in `.env` file

### API Issues

- Check CORS headers if accessing from React app
- Verify web server configuration
- Check PHP error logs

### Import Issues

- Ensure JSON files exist in `src/data/` directory
- Check for duplicate Swedish entries (will be skipped)
- Verify JSON file format matches expected structure

## 📁 File Structure

```
backend/
├── api/
│   ├── index.php          # API router
│   └── VocabularyAPI.php  # API endpoints
├── config/
│   └── database.php       # Database configuration
├── database/
│   ├── migrate.php        # Migration script
│   ├── schema.sql         # Database schema
│   └── cantonese_vocabulary.db (generated)
├── .env.example           # Environment template
└── .env                   # Environment configuration
```

## 🔄 Migration from JSON

The system automatically converts the existing JSON vocabulary files:

- `animals.json` → Animals category
- `food.json` → Food category
- `family.json` → Family category
- `actions.json` → Actions category
- `items.json` → Items category
- `fun-play.json` → Fun & Play category
- `time.json` → Time category
- `movement-directions.json` → Movement & Directions category

All data including Hong Kong variants, Jyutping pronunciation, and difficulty levels are preserved.

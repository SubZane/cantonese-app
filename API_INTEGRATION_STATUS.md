# Cantonese App - API Integration Status

## ✅ Completed Components

### 1. SQLite Database

- **Location**: `backend/database/vocabulary.db`
- **Entries**: 653 vocabulary items imported
- **Categories**: 8 categories with proper relationships
- **Features**: Full-text search enabled, proper indexing

### 2. PHP REST API

- **Location**: `backend/api/`
- **Base URL**: `http://localhost/cantonese-app/backend/api`
- **Endpoints**:
  - `GET /health` - API status check
  - `GET /categories` - List all categories
  - `GET /vocabulary` - Get vocabulary (with filtering/pagination)
  - `GET /quiz/generate` - Generate quiz questions
- **Features**: CORS enabled, error handling, JSON responses

### 3. React App Integration

- **API Service**: `src/services/vocabularyAPI.ts`
- **Custom Hook**: `src/hooks/useVocabulary.ts`
- **Environment**: `.env.development` with API URL
- **Updated Components**: `Quiz.tsx` now uses API instead of JSON files

## 🔧 Setup Required

### Web Server Configuration

You need to make your project accessible via the web server at `http://localhost/cantonese-app/`.

**Option 1: Run Setup Script**

```bash
chmod +x setup-webserver.sh
sudo ./setup-webserver.sh
```

**Option 2: Manual Symlink**

```bash
# For Apache (adjust path as needed)
sudo ln -sf /Users/subzane/Sites/cantonese-app /var/www/html/cantonese-app

# For MAMP/Homebrew
sudo ln -sf /Users/subzane/Sites/cantonese-app /usr/local/var/www/cantonese-app
```

**Option 3: Copy Project**

```bash
# Copy entire project to web root
sudo cp -r /Users/subzane/Sites/cantonese-app /var/www/html/
```

## 🧪 Testing

### Test API Integration

```bash
chmod +x test-integration.sh
./test-integration.sh
```

### Test React App

```bash
npm start
# App will use API at http://localhost/cantonese-app/backend/api
```

## 📁 Project Structure

```
cantonese-app/
├── backend/
│   ├── database/
│   │   ├── vocabulary.db         # SQLite database
│   │   ├── schema.sql           # Database schema
│   │   └── migrate.php          # Data migration script
│   ├── api/
│   │   ├── index.php            # Main API router
│   │   ├── VocabularyAPI.php    # API endpoints
│   │   └── database.php         # Database connection
│   └── config/
├── src/
│   ├── services/
│   │   └── vocabularyAPI.ts     # API service layer
│   ├── hooks/
│   │   └── useVocabulary.ts     # React hook for API
│   └── components/
│       └── Quiz.tsx             # Updated to use API
├── .env.development             # Environment config
├── setup-webserver.sh           # Web server setup
└── test-integration.sh          # API testing
```

## 🎯 Usage

1. **Start your web server** (localhost:80)
2. **Run setup script** to make project accessible
3. **Test API endpoints** using the test script
4. **Start React app** with `npm start`
5. **Quiz component** will now load data from SQLite via PHP API

The system is complete and ready to use once the web server configuration is set up!

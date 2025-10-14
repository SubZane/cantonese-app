# Web Server Setup for Cantonese App Backend

## Option 1: Symlink (Recommended)

If your web server document root is `/var/www/html` or similar:

```bash
# Create symlink to make the project accessible via web server
sudo ln -sf /Users/subzane/Sites/cantonese-app /var/www/html/cantonese-app
```

If using MAMP, XAMPP, or similar with document root in `/Applications/MAMP/htdocs`:

```bash
# Create symlink for MAMP
ln -sf /Users/subzane/Sites/cantonese-app /Applications/MAMP/htdocs/cantonese-app
```

## Option 2: Apache Virtual Host

Create a virtual host configuration file (e.g., `/etc/apache2/sites-available/cantonese-app.conf`):

```apache
<VirtualHost *:80>
    ServerName cantonese-app.local
    DocumentRoot /Users/subzane/Sites/cantonese-app

    <Directory /Users/subzane/Sites/cantonese-app>
        AllowOverride All
        Require all granted
    </Directory>

    # Backend API alias
    Alias /cantonese-app/backend/api /Users/subzane/Sites/cantonese-app/backend/api

    <Directory /Users/subzane/Sites/cantonese-app/backend/api>
        AllowOverride All
        Require all granted
        DirectoryIndex index.php
    </Directory>
</VirtualHost>
```

Then:

```bash
sudo a2ensite cantonese-app
sudo systemctl reload apache2
echo "127.0.0.1 cantonese-app.local" | sudo tee -a /etc/hosts
```

## Option 3: Copy Backend to Web Server

```bash
# Copy just the backend folder to web server document root
sudo cp -r /Users/subzane/Sites/cantonese-app/backend /var/www/html/cantonese-app/backend
sudo chown -R www-data:www-data /var/www/html/cantonese-app
```

## Option 4: Use PHP Built-in Server (Development)

Start the backend API on a separate port:

```bash
cd /Users/subzane/Sites/cantonese-app/backend/api
php -S localhost:8080
```

Then update `.env.development`:

```
REACT_APP_API_BASE_URL=http://localhost:8080
```

## Test API Access

After setup, test the API:

```bash
curl http://localhost/cantonese-app/backend/api/health
```

Should return:

```json
{"status":"healthy","timestamp":"...","database":{...}}
```

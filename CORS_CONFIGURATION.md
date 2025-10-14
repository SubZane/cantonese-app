# CORS Configuration for Cantonese App API

## Overview

The PHP backend now has comprehensive CORS (Cross-Origin Resource Sharing) support to enable secure communication between your React app and the API.

## Features

### ✅ **Enhanced CORS Headers**

- `Access-Control-Allow-Origin`: Dynamically set based on request origin
- `Access-Control-Allow-Methods`: GET, POST, OPTIONS, PUT, DELETE, PATCH
- `Access-Control-Allow-Headers`: Comprehensive header support
- `Access-Control-Allow-Credentials`: Enabled for authenticated requests
- `Access-Control-Max-Age`: 24-hour preflight caching
- `Vary: Origin`: Proper caching behavior

### ✅ **Preflight Request Handling**

- Proper OPTIONS request handling with 204 No Content response
- Efficient preflight caching to reduce unnecessary requests
- Support for complex CORS requests

### ✅ **Multiple Origin Support**

- Development: `http://localhost:3000`, `http://localhost:3001`, `http://127.0.0.1:3000`
- Production: Configurable via `production-cors.php`
- Dynamic origin validation

### ✅ **Security Features**

- Origin whitelist validation
- Production-specific security headers
- Environment-aware configuration

## Files Structure

```
backend/
├── api/
│   ├── index.php              # Main API with CORS integration
│   ├── CORSHandler.php        # CORS logic handler
│   └── .htaccess             # Apache CORS headers
└── config/
    └── production-cors.php    # Production CORS configuration
```

## Configuration

### Development

Works out of the box with React development server on `http://localhost:3000`

### Production

1. Update `backend/config/production-cors.php`:

   ```php
   $productionOrigins = [
       'https://your-domain.com',
       'https://www.your-domain.com',
   ];
   ```

2. Set environment variable:
   ```bash
   export ENVIRONMENT=production
   ```

## Testing

Run the CORS test script:

```bash
./test-cors-enhanced.sh
```

Expected results:

- ✅ OPTIONS requests return 204 No Content
- ✅ GET requests return proper CORS headers
- ✅ Origin validation works correctly
- ✅ API responses are properly formatted

## Troubleshooting

### Common Issues

1. **CORS still blocked**: Check browser network tab for actual origin
2. **Headers not appearing**: Verify Apache mod_headers is enabled
3. **Preflight fails**: Ensure OPTIONS method is allowed

### Debug Steps

1. Check browser developer tools → Network tab
2. Look for preflight OPTIONS request
3. Verify response headers include `Access-Control-Allow-Origin`
4. Test with curl to isolate browser-specific issues

## React App Integration

Your React app can now make requests without CORS issues:

```javascript
// This will now work without CORS errors
fetch("http://localhost/cantonese-app/backend/api/categories", {
	method: "GET",
	credentials: "include", // If you need cookies/auth
	headers: {
		"Content-Type": "application/json",
	},
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

## Security Notes

- Origins are validated against a whitelist
- Production configuration includes additional security headers
- Credentials are supported but require explicit origin matching
- Preflight caching reduces server load while maintaining security

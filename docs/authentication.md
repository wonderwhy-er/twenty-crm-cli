# Authentication

## Overview
Twenty API uses API keys for authentication. All API requests must include a valid API key in the Authorization header.

## Getting Your API Key

### From Twenty Application
1. Log in to your Twenty application
2. Navigate to **Settings** > **API & Webhooks** (under Developers section)
3. Create a new API key or copy an existing one
4. Store the API key securely

### API Key Format
```
Authorization: Bearer YOUR_API_KEY_HERE
```

## Making Authenticated Requests

### Header Format
Every API request must include the Authorization header:

```http
GET /rest/people HTTP/1.1
Host: api.twenty.com
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Example with cURL
```bash
curl -X GET \
  'https://api.twenty.com/rest/people' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json'
```

### Example with JavaScript/Node.js
```javascript
const fetch = require('node-fetch');

const apiKey = 'YOUR_API_KEY';
const baseUrl = 'https://api.twenty.com';

async function makeRequest(endpoint, options = {}) {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Usage example
makeRequest('/rest/people')
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Example with Python
```python
import requests

API_KEY = 'YOUR_API_KEY'
BASE_URL = 'https://api.twenty.com'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

def make_request(endpoint, method='GET', data=None):
    url = f"{BASE_URL}{endpoint}"
    
    if method == 'GET':
        response = requests.get(url, headers=headers)
    elif method == 'POST':
        response = requests.post(url, headers=headers, json=data)
    elif method == 'PATCH':
        response = requests.patch(url, headers=headers, json=data)
    elif method == 'DELETE':
        response = requests.delete(url, headers=headers)
    
    response.raise_for_status()  # Raises an HTTPError for bad responses
    return response.json()

# Usage example
people = make_request('/rest/people')
print(people)
```

## Authentication Errors

### Invalid API Key (401 Unauthorized)
```json
{
  "error": {
    "message": "Invalid API key",
    "code": "UNAUTHORIZED",
    "details": {}
  }
}
```

### Missing Authorization Header (401 Unauthorized)
```json
{
  "error": {
    "message": "Authorization header is required",
    "code": "MISSING_AUTH_HEADER",
    "details": {}
  }
}
```

### Expired API Key (401 Unauthorized)
```json
{
  "error": {
    "message": "API key has expired",
    "code": "EXPIRED_API_KEY",
    "details": {}
  }
}
```

## Security Best Practices

### 1. Keep API Keys Secure
- Never commit API keys to version control
- Use environment variables or secure configuration files
- Rotate API keys regularly
- Use different keys for development and production

### 2. Environment Variables
```bash
# .env file
TWENTY_API_KEY=your_api_key_here
TWENTY_BASE_URL=https://api.twenty.com
```

```javascript
// Load from environment
const apiKey = process.env.TWENTY_API_KEY;
const baseUrl = process.env.TWENTY_BASE_URL;
```

### 3. Use HTTPS
Always use HTTPS when making API requests to protect your API key in transit.

### 4. Implement Proper Error Handling
```javascript
async function authenticatedRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      throw new Error('Authentication failed. Check your API key.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error.message);
    throw error;
  }
}
```

## Testing Authentication

### Quick Test
Test your API key with a simple request:

```bash
curl -X GET \
  'https://api.twenty.com/rest/people?limit=1' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json'
```

If successful, you should receive a response with people data. If authentication fails, you'll receive a 401 error.

## Self-Hosted Instances

For self-hosted Twenty instances, replace the base URL:
```
https://your-twenty-domain.com/rest/people
```

The authentication mechanism remains the same - you'll still need to obtain API keys from your instance's settings.

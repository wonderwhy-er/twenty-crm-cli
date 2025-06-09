# Testing Tools and Scripts

This folder contains testing utilities and scripts for Twenty CRM REST API.

## Files

### Test Scripts
- `api-health-check.js` - Verify API connectivity and authentication
- `endpoint-tests.js` - Comprehensive endpoint testing suite
- `load-test.js` - Performance and load testing
- `webhook-test-server.js` - Local webhook testing server

### Test Data
- `sample-data.json` - Sample data for testing
- `test-scenarios.js` - Predefined test scenarios

### Utilities
- `test-utils.js` - Common testing utilities and helpers
- `validation.js` - Data validation functions

## Usage

### Quick Health Check
```bash
node api-health-check.js
```

### Run Full Test Suite
```bash
node endpoint-tests.js
```

### Start Webhook Test Server
```bash
node webhook-test-server.js
```

## Configuration

Update your API credentials in each test file:
```javascript
const API_KEY = 'your-api-key-here';
const BASE_URL = 'https://api.twenty.com/rest';
```

## Test Results
Test results will be logged to console and optionally saved to log files for review.

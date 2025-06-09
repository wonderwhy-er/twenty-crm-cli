# Webhooks Configuration and Usage

## Overview
Webhooks in Twenty enable real-time notifications to your applications when specific events occur in your CRM. Instead of continuously polling the API for changes, webhooks push data to your system instantly when events happen.

## Key Benefits
- **Real-time updates**: Instant notifications when data changes
- **Efficient**: No need for continuous polling
- **Scalable**: Handle multiple event types with a single endpoint
- **Reliable**: Built-in retry mechanisms for failed deliveries

## Setting Up Webhooks

### Via Twenty Application
1. Log in to your Twenty application
2. Navigate to **Settings** > **API & Webhooks** (under Developers)
3. Click **Create Webhook**
4. Configure the webhook settings:
   - **Endpoint URL**: Your application's webhook handler URL
   - **Events**: Select which events to subscribe to
   - **Filters**: Optional filters for specific objects or conditions
5. Save the webhook configuration

### Webhook Configuration
```json
{
  "id": "webhook-uuid",
  "name": "My Application Webhook",
  "endpointUrl": "https://your-app.com/webhooks/twenty",
  "events": [
    "person.created",
    "person.updated",
    "company.created",
    "company.updated"
  ],
  "filters": {
    "objects": ["people", "companies"],
    "conditions": {}
  },
  "isActive": true,
  "secret": "webhook-secret-for-verification"
}
```

## Event Types

### Core Object Events
Events follow the pattern: `{object}.{action}`

#### People Events
- `person.created`: A new person is added
- `person.updated`: An existing person is modified
- `person.deleted`: A person is deleted

#### Company Events
- `company.created`: A new company is added
- `company.updated`: An existing company is modified
- `company.deleted`: A company is deleted

#### Note Events
- `note.created`: A new note is created
- `note.updated`: An existing note is modified
- `note.deleted`: A note is deleted

#### Task Events
- `task.created`: A new task is created
- `task.updated`: An existing task is modified
- `task.deleted`: A task is deleted

### Custom Object Events
For custom objects, events follow the same pattern:
- `customObject.created`
- `customObject.updated`
- `customObject.deleted`

## Webhook Payload Structure

### Standard Payload Format
```json
{
  "id": "event-uuid",
  "event": "person.created",
  "timestamp": "2024-01-01T12:00:00Z",
  "workspaceId": "workspace-uuid",
  "data": {
    "object": "person",
    "id": "person-uuid",
    "attributes": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "companyId": "company-uuid",
      "createdAt": "2024-01-01T12:00:00Z",
      "updatedAt": "2024-01-01T12:00:00Z"
    },
    "previousAttributes": null
  }
}
```

### Create Event Payload
```json
{
  "id": "event-123",
  "event": "person.created",
  "timestamp": "2024-01-01T12:00:00Z",
  "workspaceId": "workspace-456",
  "data": {
    "object": "person",
    "id": "person-789",
    "attributes": {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "createdAt": "2024-01-01T12:00:00Z",
      "updatedAt": "2024-01-01T12:00:00Z"
    },
    "previousAttributes": null
  }
}
```

### Update Event Payload
```json
{
  "id": "event-124",
  "event": "person.updated",
  "timestamp": "2024-01-01T13:00:00Z",
  "workspaceId": "workspace-456",
  "data": {
    "object": "person",
    "id": "person-789",
    "attributes": {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "phone": "+1987654321",
      "updatedAt": "2024-01-01T13:00:00Z"
    },
    "previousAttributes": {
      "lastName": "Smith",
      "phone": null
    }
  }
}
```

### Delete Event Payload
```json
{
  "id": "event-125",
  "event": "person.deleted",
  "timestamp": "2024-01-01T14:00:00Z",
  "workspaceId": "workspace-456",
  "data": {
    "object": "person",
    "id": "person-789",
    "attributes": null,
    "previousAttributes": {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "deletedAt": "2024-01-01T14:00:00Z"
    }
  }
}
```

## Implementing Webhook Handlers

### Node.js/Express Example
```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

// Middleware to verify webhook signature
function verifyWebhookSignature(req, res, next) {
  const signature = req.headers['x-twenty-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.TWENTY_WEBHOOK_SECRET;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  if (signature !== `sha256=${expectedSignature}`) {
    return res.status(401).send('Invalid signature');
  }
  
  next();
}

// Webhook endpoint
app.post('/webhooks/twenty', 
  express.raw({ type: 'application/json' }),
  verifyWebhookSignature,
  (req, res) => {
    const event = JSON.parse(req.body);
    
    console.log('Received webhook:', event.event);
    
    // Handle different event types
    switch (event.event) {
      case 'person.created':
        handlePersonCreated(event.data);
        break;
      case 'person.updated':
        handlePersonUpdated(event.data);
        break;
      case 'company.created':
        handleCompanyCreated(event.data);
        break;
      default:
        console.log('Unknown event type:', event.event);
    }
    
    // Respond with 200 to acknowledge receipt
    res.status(200).send('OK');
  }
);

function handlePersonCreated(data) {
  console.log('New person created:', data.attributes.firstName, data.attributes.lastName);
  // Sync to your database, send notifications, etc.
}

function handlePersonUpdated(data) {
  console.log('Person updated:', data.id);
  console.log('Changed fields:', Object.keys(data.previousAttributes || {}));
  // Update your local records
}

function handleCompanyCreated(data) {
  console.log('New company created:', data.attributes.name);
  // Handle company creation
}

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

### Python/Flask Example
```python
import os
import json
import hmac
import hashlib
from flask import Flask, request, jsonify

app = Flask(__name__)

def verify_webhook_signature(payload, signature):
    secret = os.environ.get('TWENTY_WEBHOOK_SECRET')
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return signature == f'sha256={expected_signature}'

@app.route('/webhooks/twenty', methods=['POST'])
def handle_webhook():
    # Verify signature
    signature = request.headers.get('X-Twenty-Signature')
    payload = request.get_data()
    
    if not verify_webhook_signature(payload, signature):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Parse event
    event = json.loads(payload)
    
    print(f"Received webhook: {event['event']}")
    
    # Handle different event types
    if event['event'] == 'person.created':
        handle_person_created(event['data'])
    elif event['event'] == 'person.updated':
        handle_person_updated(event['data'])
    elif event['event'] == 'company.created':
        handle_company_created(event['data'])
    else:
        print(f"Unknown event type: {event['event']}")
    
    return jsonify({'status': 'success'}), 200

def handle_person_created(data):
    attrs = data['attributes']
    print(f"New person created: {attrs['firstName']} {attrs['lastName']}")
    # Sync to your database, send notifications, etc.

def handle_person_updated(data):
    print(f"Person updated: {data['id']}")
    if data.get('previousAttributes'):
        print(f"Changed fields: {list(data['previousAttributes'].keys())}")
    # Update your local records

def handle_company_created(data):
    attrs = data['attributes']
    print(f"New company created: {attrs['name']}")
    # Handle company creation

if __name__ == '__main__':
    app.run(port=3000, debug=True)
```

## Security

### Signature Verification
Twenty signs webhook payloads with HMAC-SHA256 using your webhook secret:

```javascript
// Verify signature
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}
```

### Best Practices
1. **Always verify signatures**: Protect against spoofed requests
2. **Use HTTPS**: Secure data transmission
3. **Implement idempotency**: Handle duplicate events gracefully
4. **Store webhook secrets securely**: Use environment variables
5. **Log events**: Keep audit trails for debugging

## Testing Webhooks

### Using webhook-test.com
1. Go to [webhook-test.com](https://webhook-test.com)
2. Copy your unique webhook URL
3. Create a webhook in Twenty with this URL
4. Trigger events in Twenty (create/update records)
5. Check webhook-test.com for received requests

### Local Testing with ngrok
```bash
# Install ngrok
npm install -g ngrok

# Start your local webhook server
node webhook-server.js

# In another terminal, expose local server
ngrok http 3000

# Use the ngrok URL in Twenty webhook configuration
# Example: https://abc123.ngrok.io/webhooks/twenty
```

### Manual Testing
```bash
# Send test webhook to your endpoint
curl -X POST https://your-app.com/webhooks/twenty \
  -H 'Content-Type: application/json' \
  -H 'X-Twenty-Signature: sha256=test-signature' \
  -d '{
    "id": "test-event",
    "event": "person.created",
    "timestamp": "2024-01-01T12:00:00Z",
    "workspaceId": "test-workspace",
    "data": {
      "object": "person",
      "id": "test-person",
      "attributes": {
        "firstName": "Test",
        "lastName": "User",
        "email": "test@example.com"
      }
    }
  }'
```

## Error Handling and Retries

### Webhook Delivery
- Twenty expects a `200` status code for successful delivery
- Failed deliveries (non-200 responses) will be retried
- Retry schedule: 1m, 5m, 30m, 2h, 12h, 24h intervals
- After 6 failed attempts, the webhook may be disabled

### Handling Errors
```javascript
app.post('/webhooks/twenty', (req, res) => {
  try {
    const event = req.body;
    
    // Process the event
    processEvent(event);
    
    // Always respond with 200 for successful processing
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Return 500 to trigger retry
    res.status(500).send('Internal Server Error');
  }
});
```

### Idempotency
```javascript
const processedEvents = new Set();

function processEvent(event) {
  // Check if event was already processed
  if (processedEvents.has(event.id)) {
    console.log('Event already processed:', event.id);
    return;
  }
  
  // Process the event
  handleEvent(event);
  
  // Mark as processed
  processedEvents.add(event.id);
}
```

## Monitoring and Debugging

### Webhook Logs
Monitor webhook delivery status in Twenty:
1. Go to Settings > API & Webhooks
2. Click on your webhook
3. View delivery logs and status

### Common Issues
- **Timeouts**: Ensure your endpoint responds within 30 seconds
- **SSL Certificate**: Use valid SSL certificates for HTTPS endpoints
- **Firewalls**: Ensure your endpoint is accessible from the internet
- **Rate Limiting**: Don't rate limit webhook requests from Twenty

### Debugging Tips
1. **Log all requests**: Keep detailed logs for troubleshooting
2. **Check response times**: Optimize for fast responses
3. **Monitor error rates**: Track failed deliveries
4. **Test endpoint health**: Regularly verify your webhook endpoint

## Use Cases

### Data Synchronization
```javascript
// Sync Twenty data to external CRM
function handlePersonUpdated(data) {
  const externalCrmAPI = new ExternalCRM();
  
  externalCrmAPI.updateContact(data.id, {
    firstName: data.attributes.firstName,
    lastName: data.attributes.lastName,
    email: data.attributes.email
  });
}
```

### Notifications
```javascript
// Send Slack notification for new leads
function handlePersonCreated(data) {
  const slack = new SlackAPI();
  
  slack.sendMessage({
    channel: '#sales',
    text: `New lead: ${data.attributes.firstName} ${data.attributes.lastName} (${data.attributes.email})`
  });
}
```

### Automation
```javascript
// Trigger automated workflows
function handleCompanyCreated(data) {
  const workflow = new WorkflowEngine();
  
  workflow.trigger('new-company-onboarding', {
    companyId: data.id,
    companyName: data.attributes.name
  });
}
```

This completes the webhooks documentation. The webhooks system allows for powerful real-time integrations with your Twenty CRM instance.

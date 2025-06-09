# Core API Endpoints

## Overview
The Core API provides endpoints for managing the primary CRM entities: People, Companies, Notes, and Tasks. All endpoints follow REST conventions and return JSON responses.

## Base URL
```
https://api.twenty.com/rest
```

## Common Parameters

### Pagination
- `limit`: Number of records to return (default: 20, max: 100)
- `startingAfter`: Cursor for pagination (next page)
- `endingBefore`: Cursor for pagination (previous page)

### Sorting
- `orderBy`: Field to sort by (e.g., `createdAt`, `updatedAt`, `name`)
- `orderDirection`: Sort direction (`asc` or `desc`)

### Example
```
GET /rest/people?limit=50&orderBy=createdAt&orderDirection=desc
```

## People Endpoints

### List People
```http
GET /rest/people
```

**Parameters:**
- Standard pagination and sorting parameters
- Field-specific filters (implementation may vary)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "companyId": "company-uuid",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pageInfo": {
    "hasNextPage": true,
    "hasPreviousPage": false,
    "startCursor": "cursor1",
    "endCursor": "cursor2"
  }
}
```

### Get Person by ID
```http
GET /rest/people/{id}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "companyId": "company-uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Create Person
```http
POST /rest/people
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1987654321",
  "companyId": "company-uuid"
}
```

### Update Person
```http
PATCH /rest/people/{id}
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "phone": "+1987654321"
}
```

### Delete Person
```http
DELETE /rest/people/{id}
```

## Companies Endpoints

### List Companies
```http
GET /rest/companies
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "domainName": "acme.com",
      "address": "123 Business St",
      "employees": 100,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Company by ID
```http
GET /rest/companies/{id}
```

### Create Company
```http
POST /rest/companies
```

**Request Body:**
```json
{
  "name": "New Company Inc",
  "domainName": "newcompany.com",
  "address": "456 Corporate Ave",
  "employees": 50
}
```

### Update Company
```http
PATCH /rest/companies/{id}
```

### Delete Company
```http
DELETE /rest/companies/{id}
```

## Notes Endpoints

### List Notes
```http
GET /rest/notes
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Meeting Notes",
      "body": "Discussed project timeline and deliverables",
      "authorId": "user-uuid",
      "personId": "person-uuid",
      "companyId": "company-uuid",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Note by ID
```http
GET /rest/notes/{id}
```

### Create Note
```http
POST /rest/notes
```

**Request Body:**
```json
{
  "title": "Follow-up Note",
  "body": "Need to follow up on proposal next week",
  "personId": "person-uuid",
  "companyId": "company-uuid"
}
```

### Update Note
```http
PATCH /rest/notes/{id}
```

### Delete Note
```http
DELETE /rest/notes/{id}
```

## Tasks Endpoints

### List Tasks
```http
GET /rest/tasks
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Call prospect",
      "body": "Follow up on demo feedback",
      "status": "TODO",
      "dueAt": "2024-01-15T10:00:00Z",
      "assigneeId": "user-uuid",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Task by ID
```http
GET /rest/tasks/{id}
```

### Create Task
```http
POST /rest/tasks
```

**Request Body:**
```json
{
  "title": "Send proposal",
  "body": "Prepare and send proposal document",
  "status": "TODO",
  "dueAt": "2024-01-20T15:00:00Z",
  "assigneeId": "user-uuid"
}
```

### Update Task
```http
PATCH /rest/tasks/{id}
```

### Delete Task
```http
DELETE /rest/tasks/{id}
```

## Common Field Types

### Standard Fields
- `id`: UUID (read-only)
- `createdAt`: ISO 8601 timestamp (read-only)
- `updatedAt`: ISO 8601 timestamp (read-only)
- `deletedAt`: ISO 8601 timestamp (soft delete)

### Text Fields
- Single line text: `firstName`, `lastName`, `title`
- Multi-line text: `body`, `description`, `address`
- Email: `email` (with validation)
- Phone: `phone`
- URL: `domainName`, `website`

### Number Fields
- Integer: `employees`, `revenue`
- Decimal: `value`, `amount`

### Date/Time Fields
- Date: `birthDate`, `startDate`
- DateTime: `dueAt`, `scheduledAt`

### Boolean Fields
- True/false values: `isActive`, `isCompleted`

### Reference Fields
- Foreign keys: `companyId`, `personId`, `assigneeId`

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": ["Email is required"]
    }
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "message": "Record not found",
    "code": "NOT_FOUND",
    "details": {}
  }
}
```

### 422 Unprocessable Entity
```json
{
  "error": {
    "message": "Invalid data provided",
    "code": "UNPROCESSABLE_ENTITY",
    "details": {
      "email": ["Email format is invalid"]
    }
  }
}
```

## Rate Limiting
Responses include rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

## Best Practices

1. **Use appropriate HTTP methods**: GET for reading, POST for creating, PATCH for partial updates
2. **Handle pagination**: Always check `pageInfo` for large datasets
3. **Implement retry logic**: Handle rate limits and temporary failures
4. **Validate before sending**: Check required fields and data formats
5. **Use filtering**: Reduce payload size by requesting only needed data
6. **Cache responses**: Store frequently accessed data locally when appropriate

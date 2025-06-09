# Twenty CRM REST API Overview

## Introduction
The Twenty API allows developers to interact programmatically with the Twenty CRM platform. Using the API, you can integrate Twenty with other systems, automate data synchronization, and build custom solutions around your customer data.

## API Types
Twenty provides two main API interfaces:

### 1. REST API
- **Purpose**: The simplest way to build integrations
- **Best for**: Standard CRUD operations, simple integrations
- **Base URL**: `https://api.twenty.com/rest` (or your self-hosted URL + `/rest`)
- **Format**: JSON requests and responses
- **HTTP Methods**: GET, POST, PATCH, DELETE

### 2. GraphQL API
- **Purpose**: The most powerful way to build integrations
- **Best for**: Complex queries, efficient data fetching, advanced integrations
- **Endpoint**: `https://api.twenty.com/graphql` (or your self-hosted URL + `/graphql`)

## API Categories

### Core API
The Core API serves as a unified interface for managing core CRM entities and their relationships:
- **People**: Individual contacts and leads
- **Companies**: Organizations and businesses
- **Notes**: Text notes and observations
- **Tasks**: To-do items and reminders
- **Activities**: Meetings, calls, and interactions

**Key Features**:
- Standard CRUD operations via resource-oriented endpoints
- Relationship management between entities
- Flexible querying and filtering
- Pagination support

### Metadata API
The Metadata API provides information about your Twenty CRM schema and configuration:
- **Object Definitions**: Schema for all object types
- **Field Metadata**: Custom fields and their properties
- **Picklist Options**: Dropdown field values
- **Relationships**: Object relationships and dependencies

**Base Path**: `/rest/metadata`

## Core Concepts

### Objects
Twenty CRM is built around objects (entities) that represent different types of data:
- **Standard Objects**: People, Companies, Notes, Tasks (built-in)
- **Custom Objects**: User-defined objects for specific business needs

### Fields
Each object contains fields that store specific data:
- **Standard Fields**: Built-in fields like name, email, phone
- **Custom Fields**: User-defined fields for additional data
- **Field Types**: Text, Number, Date, Boolean, Picklist, etc.

### Relationships
Objects can be related to each other:
- **One-to-Many**: One company has many people
- **Many-to-Many**: People can have multiple tasks
- **Lookup**: Reference to another object

## Request/Response Format

### Request Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

### Standard Response Structure
```json
{
  "data": {
    // Response data here
  },
  "pageInfo": {
    // Pagination info (for list endpoints)
    "hasNextPage": boolean,
    "hasPreviousPage": boolean,
    "startCursor": "string",
    "endCursor": "string"
  }
}
```

### Error Response Structure
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Pagination
List endpoints support cursor-based pagination:
- **startingAfter**: Cursor for the next page
- **endingBefore**: Cursor for the previous page
- **limit**: Number of records to return (default: 20, max: 100)

Example: `GET /rest/people?limit=50&startingAfter=cursor_value`

## Filtering and Sorting
Many endpoints support filtering and sorting:
- **Filtering**: Query parameters for field-based filtering
- **Sorting**: `orderBy` parameter for result ordering

## Rate Limiting
API requests are subject to rate limiting to ensure service quality:
- Monitor response headers for rate limit information
- Implement exponential backoff for retry logic
- Contact support if you need higher limits

## Best Practices
1. **Use appropriate HTTP methods**: GET for reading, POST for creating, PATCH for updating
2. **Handle errors gracefully**: Implement proper error handling and retry logic
3. **Cache when possible**: Store frequently accessed data locally
4. **Use webhooks**: For real-time data synchronization instead of polling
5. **Validate data**: Ensure data integrity before sending requests
6. **Monitor usage**: Track API usage and performance

## Next Steps
- Review authentication setup in `authentication.md`
- Explore core endpoints in `core-endpoints.md`
- Check out metadata endpoints in `metadata-endpoints.md`
- Set up webhooks using `webhooks.md`

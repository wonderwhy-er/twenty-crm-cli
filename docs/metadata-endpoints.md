# Metadata API Endpoints

## Overview
The Metadata API provides information about your Twenty CRM schema and configuration. These endpoints allow you to understand the structure of data, retrieve field definitions, and get configuration details for dynamic integrations.

## Base URL
```
https://api.twenty.com/rest/metadata
```

## Key Concepts

### Objects
Objects represent different types of data entities in Twenty CRM:
- **Standard Objects**: Built-in objects like People, Companies, Notes, Tasks
- **Custom Objects**: User-defined objects for specific business needs

### Fields
Fields define the structure and properties of data within objects:
- **Field Types**: Text, Number, Date, Boolean, Picklist, Relation, etc.
- **Field Properties**: Required, default values, validation rules
- **Custom Fields**: User-defined fields for additional data

### Relationships
Define how objects relate to each other:
- **One-to-Many**: One company has many people
- **Many-to-Many**: People can have multiple tasks
- **Lookup**: Reference to another object

## Objects Endpoints

### List All Objects
```http
GET /rest/metadata/objects
```

**Description**: Retrieve metadata for all object types and their configurations.

**Response:**
```json
{
  "data": [
    {
      "id": "people",
      "nameSingular": "person",
      "namePlural": "people",
      "labelSingular": "Person",
      "labelPlural": "People",
      "description": "Individual contacts and leads",
      "isCustom": false,
      "isActive": true,
      "fields": [
        {
          "id": "firstName",
          "name": "firstName",
          "label": "First Name",
          "type": "TEXT",
          "isRequired": false,
          "isCustom": false,
          "defaultValue": null
        },
        {
          "id": "email",
          "name": "email",
          "label": "Email",
          "type": "EMAIL",
          "isRequired": true,
          "isCustom": false,
          "validation": {
            "format": "email"
          }
        }
      ],
      "relationships": [
        {
          "id": "company",
          "type": "BELONGS_TO",
          "targetObject": "companies",
          "foreignKey": "companyId"
        }
      ]
    },
    {
      "id": "companies",
      "nameSingular": "company",
      "namePlural": "companies",
      "labelSingular": "Company",
      "labelPlural": "Companies",
      "description": "Organizations and businesses",
      "isCustom": false,
      "isActive": true
    }
  ]
}
```

### Get Specific Object Metadata
```http
GET /rest/metadata/objects/{objectName}
```

**Parameters:**
- `objectName`: The name of the object (e.g., "people", "companies")

**Example:**
```http
GET /rest/metadata/objects/people
```

**Response:**
```json
{
  "data": {
    "id": "people",
    "nameSingular": "person",
    "namePlural": "people",
    "labelSingular": "Person",
    "labelPlural": "People",
    "description": "Individual contacts and leads",
    "isCustom": false,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "fields": [
      {
        "id": "firstName",
        "name": "firstName",
        "label": "First Name",
        "type": "TEXT",
        "isRequired": false,
        "isCustom": false,
        "isActive": true,
        "defaultValue": null,
        "description": "Person's first name",
        "position": 1
      },
      {
        "id": "lastName",
        "name": "lastName",
        "label": "Last Name",
        "type": "TEXT",
        "isRequired": false,
        "isCustom": false,
        "isActive": true,
        "position": 2
      },
      {
        "id": "email",
        "name": "email",
        "label": "Email",
        "type": "EMAIL",
        "isRequired": true,
        "isCustom": false,
        "isActive": true,
        "validation": {
          "format": "email"
        },
        "position": 3
      }
    ],
    "relationships": [
      {
        "id": "company",
        "name": "company",
        "label": "Company",
        "type": "BELONGS_TO",
        "targetObject": "companies",
        "foreignKey": "companyId",
        "isRequired": false
      }
    ]
  }
}
```

## Fields Endpoints

### List Fields for Object
```http
GET /rest/metadata/objects/{objectName}/fields
```

**Response:**
```json
{
  "data": [
    {
      "id": "firstName",
      "name": "firstName",
      "label": "First Name",
      "type": "TEXT",
      "isRequired": false,
      "isCustom": false,
      "isActive": true,
      "defaultValue": null,
      "maxLength": 255,
      "position": 1
    },
    {
      "id": "status",
      "name": "status",
      "label": "Status",
      "type": "PICKLIST",
      "isRequired": false,
      "isCustom": true,
      "isActive": true,
      "options": [
        {
          "label": "Active",
          "value": "active",
          "color": "#green"
        },
        {
          "label": "Inactive",
          "value": "inactive",
          "color": "#red"
        }
      ],
      "position": 10
    }
  ]
}
```

### Get Specific Field Metadata
```http
GET /rest/metadata/objects/{objectName}/fields/{fieldName}
```

## Picklists Endpoints

### List All Picklists
```http
GET /rest/metadata/picklists
```

**Description**: Retrieve all dropdown field options defined in the CRM.

**Response:**
```json
{
  "data": [
    {
      "objectName": "people",
      "fieldName": "status",
      "options": [
        {
          "label": "Active",
          "value": "active",
          "color": "#22c55e",
          "position": 1
        },
        {
          "label": "Inactive",
          "value": "inactive",
          "color": "#ef4444",
          "position": 2
        }
      ]
    },
    {
      "objectName": "companies",
      "fieldName": "industry",
      "options": [
        {
          "label": "Technology",
          "value": "technology",
          "color": "#3b82f6",
          "position": 1
        },
        {
          "label": "Healthcare",
          "value": "healthcare",
          "color": "#10b981",
          "position": 2
        }
      ]
    }
  ]
}
```

### Get Picklist for Specific Field
```http
GET /rest/metadata/picklists/{objectName}/{fieldName}
```

## Field Types

### Standard Field Types
- **TEXT**: Single line text
- **TEXTAREA**: Multi-line text
- **EMAIL**: Email address with validation
- **PHONE**: Phone number
- **URL**: Website URL
- **NUMBER**: Numeric value
- **CURRENCY**: Monetary value
- **PERCENT**: Percentage value
- **DATE**: Date only
- **DATETIME**: Date and time
- **BOOLEAN**: True/false checkbox
- **PICKLIST**: Dropdown selection
- **MULTI_PICKLIST**: Multiple dropdown selections

### Relationship Field Types
- **BELONGS_TO**: Many-to-one relationship
- **HAS_MANY**: One-to-many relationship
- **HAS_AND_BELONGS_TO_MANY**: Many-to-many relationship

### Field Properties
```json
{
  "id": "field-uuid",
  "name": "fieldName",
  "label": "Field Label",
  "type": "TEXT",
  "isRequired": false,
  "isCustom": true,
  "isActive": true,
  "defaultValue": "Default text",
  "description": "Field description",
  "position": 5,
  "validation": {
    "maxLength": 255,
    "minLength": 1,
    "pattern": "regex_pattern"
  },
  "options": [
    {
      "label": "Option 1",
      "value": "option1",
      "color": "#color"
    }
  ]
}
```

## Relationships Endpoints

### List Object Relationships
```http
GET /rest/metadata/objects/{objectName}/relationships
```

**Response:**
```json
{
  "data": [
    {
      "id": "company",
      "name": "company",
      "label": "Company",
      "type": "BELONGS_TO",
      "sourceObject": "people",
      "targetObject": "companies",
      "foreignKey": "companyId",
      "isRequired": false,
      "onDelete": "SET_NULL"
    },
    {
      "id": "notes",
      "name": "notes",
      "label": "Notes",
      "type": "HAS_MANY",
      "sourceObject": "people",
      "targetObject": "notes",
      "foreignKey": "personId",
      "inverse": "person"
    }
  ]
}
```

## Usage Examples

### Dynamic Form Generation
```javascript
// Fetch object metadata to build a dynamic form
async function buildForm(objectName) {
  const response = await fetch(`/rest/metadata/objects/${objectName}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  const { data } = await response.json();
  
  // Build form fields based on metadata
  const formFields = data.fields.map(field => ({
    name: field.name,
    label: field.label,
    type: field.type,
    required: field.isRequired,
    options: field.options || null
  }));
  
  return formFields;
}
```

### Validation Based on Metadata
```javascript
// Validate data against field metadata
async function validateRecord(objectName, recordData) {
  const metadata = await getObjectMetadata(objectName);
  const errors = {};
  
  for (const field of metadata.fields) {
    const value = recordData[field.name];
    
    if (field.isRequired && !value) {
      errors[field.name] = ['This field is required'];
    }
    
    if (field.type === 'EMAIL' && value && !isValidEmail(value)) {
      errors[field.name] = ['Invalid email format'];
    }
    
    if (field.validation?.maxLength && value?.length > field.validation.maxLength) {
      errors[field.name] = [`Maximum length is ${field.validation.maxLength}`];
    }
  }
  
  return errors;
}
```

## Best Practices

1. **Cache Metadata**: Metadata changes infrequently, so cache responses to improve performance
2. **Use for Dynamic UIs**: Build forms and interfaces that adapt to schema changes
3. **Validate Client-Side**: Use field metadata for client-side validation before API calls
4. **Handle Custom Fields**: Account for custom fields when processing data
5. **Check Field Activity**: Only process active fields (`isActive: true`)
6. **Respect Field Positions**: Use position values for consistent field ordering

## Authentication
All metadata endpoints require authentication. Include your API key in the Authorization header:

```http
Authorization: Bearer YOUR_API_KEY
```

## Rate Limiting
Metadata endpoints are subject to the same rate limiting as other API endpoints. Since metadata doesn't change frequently, consider caching responses to reduce API calls.

#!/bin/bash
# Twenty CRM REST API cURL Examples
# Replace YOUR_API_KEY with your actual API key

API_KEY="YOUR_API_KEY"
BASE_URL="https://api.twenty.com/rest"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Twenty CRM REST API cURL Examples ===${NC}"

# Check if API key is set
if [ "$API_KEY" = "YOUR_API_KEY" ]; then
    echo -e "${RED}Error: Please set your API key in the script${NC}"
    exit 1
fi

echo -e "\n${GREEN}1. Authentication Test${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  "$BASE_URL/people?limit=1"

echo -e "\n${GREEN}2. Get All People (Limited)${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  "$BASE_URL/people?limit=5&orderBy=createdAt"

echo -e "\n${GREEN}3. Get All Companies${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  "$BASE_URL/companies?limit=5"

echo -e "\n${GREEN}4. Create a New Person${NC}"
PERSON_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test.user@example.com",
    "phone": "+1234567890"
  }' \
  "$BASE_URL/people")

echo "$PERSON_RESPONSE"

# Extract person ID from response (basic parsing)
PERSON_ID=$(echo "$PERSON_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ ! -z "$PERSON_ID" ]; then
    echo -e "\n${GREEN}5. Get Person by ID${NC}"
    curl -s -w "\nHTTP Status: %{http_code}\n" \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      "$BASE_URL/people/$PERSON_ID"

    echo -e "\n${GREEN}6. Update Person${NC}"
    curl -s -w "\nHTTP Status: %{http_code}\n" \
      -X PATCH \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "phone": "+1987654321",
        "firstName": "Updated"
      }' \
      "$BASE_URL/people/$PERSON_ID"

    echo -e "\n${GREEN}7. Delete Person (Cleanup)${NC}"
    curl -s -w "\nHTTP Status: %{http_code}\n" \
      -X DELETE \
      -H "Authorization: Bearer $API_KEY" \
      "$BASE_URL/people/$PERSON_ID"
else
    echo -e "${RED}Could not extract person ID from response${NC}"
fi

echo -e "\n${GREEN}8. Create a Company${NC}"
COMPANY_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company Inc",
    "domainName": "testcompany.com",
    "address": "123 Test Street",
    "employees": 50
  }' \
  "$BASE_URL/companies")

echo "$COMPANY_RESPONSE"

# Extract company ID
COMPANY_ID=$(echo "$COMPANY_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ ! -z "$COMPANY_ID" ]; then
    echo -e "\n${GREEN}9. Update Company${NC}"
    curl -s -w "\nHTTP Status: %{http_code}\n" \
      -X PATCH \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "employees": 75,
        "address": "456 Updated Street"
      }' \
      "$BASE_URL/companies/$COMPANY_ID"

    echo -e "\n${GREEN}10. Create Person with Company${NC}"
    PERSON_WITH_COMPANY_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
      -X POST \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"firstName\": \"Employee\",
        \"lastName\": \"Test\",
        \"email\": \"employee@testcompany.com\",
        \"companyId\": \"$COMPANY_ID\"
      }" \
      "$BASE_URL/people")

    echo "$PERSON_WITH_COMPANY_RESPONSE"

    # Extract employee ID
    EMPLOYEE_ID=$(echo "$PERSON_WITH_COMPANY_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ ! -z "$EMPLOYEE_ID" ]; then
        echo -e "\n${GREEN}11. Cleanup - Delete Employee${NC}"
        curl -s -w "\nHTTP Status: %{http_code}\n" \
          -X DELETE \
          -H "Authorization: Bearer $API_KEY" \
          "$BASE_URL/people/$EMPLOYEE_ID"
    fi

    echo -e "\n${GREEN}12. Cleanup - Delete Company${NC}"
    curl -s -w "\nHTTP Status: %{http_code}\n" \
      -X DELETE \
      -H "Authorization: Bearer $API_KEY" \
      "$BASE_URL/companies/$COMPANY_ID"
fi

echo -e "\n${GREEN}13. Get Metadata - Objects${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  "$BASE_URL/metadata/objects"

echo -e "\n${GREEN}14. Get People Object Metadata${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  "$BASE_URL/metadata/objects/people"

echo -e "\n${GREEN}15. Get Picklists${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  "$BASE_URL/metadata/picklists"

echo -e "\n${GREEN}16. Pagination Example${NC}"
echo "First page:"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  "$BASE_URL/people?limit=2"

echo -e "\n${GREEN}17. Error Handling Example (Invalid Data)${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "email": "invalid-email-format"
  }' \
  "$BASE_URL/people"

echo -e "\n${GREEN}18. Error Handling Example (Unauthorized)${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Bearer invalid-api-key" \
  -H "Content-Type: application/json" \
  "$BASE_URL/people?limit=1"

echo -e "\n${BLUE}=== cURL Examples Complete ===${NC}"

# Additional examples for specific use cases

echo -e "\n${BLUE}=== Additional Examples ===${NC}"

echo -e "\n${GREEN}19. Create Note${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Note",
    "body": "This is a test note created via cURL"
  }' \
  "$BASE_URL/notes"

echo -e "\n${GREEN}20. Create Task${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "body": "This is a test task created via cURL",
    "status": "TODO",
    "dueAt": "2024-12-31T23:59:59Z"
  }' \
  "$BASE_URL/tasks"

echo -e "\n${GREEN}21. Search with Filters (if supported)${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  "$BASE_URL/people?limit=10&orderBy=createdAt&orderDirection=desc"

echo -e "\n${GREEN}22. Batch Request Example (Multiple in sequence)${NC}"
echo "Creating multiple people..."
for i in {1..3}; do
    echo "Creating person $i:"
    curl -s -w "\nHTTP Status: %{http_code}\n" \
      -X POST \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"firstName\": \"Batch$i\",
        \"lastName\": \"Test\",
        \"email\": \"batch$i@example.com\"
      }" \
      "$BASE_URL/people"
done

echo -e "\n${BLUE}=== All Examples Complete ===${NC}"
echo -e "${GREEN}Note: Remember to clean up any test data created during these examples${NC}"

// Basic CRUD Operations for Twenty CRM REST API
// Replace YOUR_API_KEY with your actual API key from Twenty Settings

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.twenty.com/rest';

// Helper function to make authenticated requests
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP ${response.status}: ${error.message || 'Request failed'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error.message);
    throw error;
  }
}

// CREATE OPERATIONS

async function createPerson(personData) {
  console.log('Creating person...');
  
  const newPerson = await apiRequest('/people', {
    method: 'POST',
    body: JSON.stringify(personData)
  });
  
  console.log('Person created:', newPerson.data);
  return newPerson.data;
}

async function createCompany(companyData) {
  console.log('Creating company...');
  
  const newCompany = await apiRequest('/companies', {
    method: 'POST',
    body: JSON.stringify(companyData)
  });
  
  console.log('Company created:', newCompany.data);
  return newCompany.data;
}

// READ OPERATIONS

async function getAllPeople(options = {}) {
  console.log('Fetching all people...');
  
  const queryParams = new URLSearchParams();
  if (options.limit) queryParams.set('limit', options.limit);
  if (options.startingAfter) queryParams.set('startingAfter', options.startingAfter);
  if (options.orderBy) queryParams.set('orderBy', options.orderBy);
  
  const endpoint = `/people${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  const result = await apiRequest(endpoint);
  
  console.log(`Found ${result.data.length} people`);
  return result;
}

async function getPersonById(personId) {
  console.log(`Fetching person ${personId}...`);
  
  const result = await apiRequest(`/people/${personId}`);
  console.log('Person found:', result.data);
  return result.data;
}

async function getAllCompanies(options = {}) {
  console.log('Fetching all companies...');
  
  const queryParams = new URLSearchParams();
  if (options.limit) queryParams.set('limit', options.limit);
  if (options.orderBy) queryParams.set('orderBy', options.orderBy);
  
  const endpoint = `/companies${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  const result = await apiRequest(endpoint);
  
  console.log(`Found ${result.data.length} companies`);
  return result;
}

// UPDATE OPERATIONS

async function updatePerson(personId, updateData) {
  console.log(`Updating person ${personId}...`);
  
  const updatedPerson = await apiRequest(`/people/${personId}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData)
  });
  
  console.log('Person updated:', updatedPerson.data);
  return updatedPerson.data;
}

async function updateCompany(companyId, updateData) {
  console.log(`Updating company ${companyId}...`);
  
  const updatedCompany = await apiRequest(`/companies/${companyId}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData)
  });
  
  console.log('Company updated:', updatedCompany.data);
  return updatedCompany.data;
}

// DELETE OPERATIONS

async function deletePerson(personId) {
  console.log(`Deleting person ${personId}...`);
  
  await apiRequest(`/people/${personId}`, {
    method: 'DELETE'
  });
  
  console.log('Person deleted successfully');
}

async function deleteCompany(companyId) {
  console.log(`Deleting company ${companyId}...`);
  
  await apiRequest(`/companies/${companyId}`, {
    method: 'DELETE'
  });
  
  console.log('Company deleted successfully');
}

// DEMO FUNCTIONS

async function runBasicCRUDDemo() {
  try {
    console.log('=== Twenty CRM Basic CRUD Demo ===\n');
    
    // 1. Create a company
    const companyData = {
      name: 'Demo Company Inc',
      domainName: 'democompany.com',
      address: '123 Business Street',
      employees: 50
    };
    
    const company = await createCompany(companyData);
    console.log('');
    
    // 2. Create a person associated with the company
    const personData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@democompany.com',
      phone: '+1234567890',
      companyId: company.id
    };
    
    const person = await createPerson(personData);
    console.log('');
    
    // 3. Read operations
    await getAllPeople({ limit: 5, orderBy: 'createdAt' });
    console.log('');
    
    await getPersonById(person.id);
    console.log('');
    
    await getAllCompanies({ limit: 5 });
    console.log('');
    
    // 4. Update operations
    const personUpdate = {
      phone: '+1987654321',
      firstName: 'Jane'
    };
    
    await updatePerson(person.id, personUpdate);
    console.log('');
    
    const companyUpdate = {
      employees: 75,
      address: '456 Corporate Avenue'
    };
    
    await updateCompany(company.id, companyUpdate);
    console.log('');
    
    // 5. Verify updates
    const updatedPerson = await getPersonById(person.id);
    console.log('Verified person update - New phone:', updatedPerson.phone);
    console.log('');
    
    // 6. Clean up (optional - comment out if you want to keep the test data)
    // await deletePerson(person.id);
    // console.log('');
    // await deleteCompany(company.id);
    
    console.log('=== Demo completed successfully! ===');
    
  } catch (error) {
    console.error('Demo failed:', error.message);
  }
}

// SEARCH AND FILTER EXAMPLES

async function searchPeopleByEmail(emailPattern) {
  console.log(`Searching for people with email containing: ${emailPattern}`);
  
  // Note: Exact filtering syntax may vary - check Twenty documentation
  const people = await getAllPeople();
  const filtered = people.data.filter(person => 
    person.email && person.email.includes(emailPattern)
  );
  
  console.log(`Found ${filtered.length} people matching email pattern`);
  return filtered;
}

async function getRecentlyCreatedPeople(days = 7) {
  console.log(`Getting people created in last ${days} days...`);
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const people = await getAllPeople({ orderBy: 'createdAt' });
  const recent = people.data.filter(person => 
    new Date(person.createdAt) > cutoffDate
  );
  
  console.log(`Found ${recent.length} recently created people`);
  return recent;
}

// PAGINATION EXAMPLE

async function getAllPeopleWithPagination() {
  console.log('Fetching all people with pagination...');
  
  let allPeople = [];
  let cursor = null;
  let pageCount = 0;
  
  do {
    const options = { limit: 20 };
    if (cursor) options.startingAfter = cursor;
    
    const result = await getAllPeople(options);
    allPeople = allPeople.concat(result.data);
    pageCount++;
    
    console.log(`Page ${pageCount}: ${result.data.length} people`);
    
    // Check if there's a next page
    if (result.pageInfo && result.pageInfo.hasNextPage) {
      cursor = result.pageInfo.endCursor;
    } else {
      cursor = null;
    }
    
  } while (cursor);
  
  console.log(`Total people fetched: ${allPeople.length}`);
  return allPeople;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    apiRequest,
    createPerson,
    createCompany,
    getAllPeople,
    getPersonById,
    getAllCompanies,
    updatePerson,
    updateCompany,
    deletePerson,
    deleteCompany,
    runBasicCRUDDemo,
    searchPeopleByEmail,
    getRecentlyCreatedPeople,
    getAllPeopleWithPagination
  };
}

// Run demo if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runBasicCRUDDemo();
}

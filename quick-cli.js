#!/usr/bin/env node

/**
 * Enhanced Twenty CRM CLI Tool with better output formatting
 */

const API_KEY = 'YOUR_API_KEY'; // This will be read from config

// Quick metadata display
async function displayMetadata() {
  const fs = require('fs');
  const path = require('path');
  
  // Load config
  const configFile = path.join(__dirname, '.twenty-config.json');
  let config = {};
  try {
    if (fs.existsSync(configFile)) {
      config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    }
  } catch (error) {
    console.error('❌ Error loading config:', error.message);
    return;
  }

  if (!config.apiKey) {
    console.error('❌ API key not configured. Run: node cli-tool.js setup');
    return;
  }

  if (!config.baseUrl) {
    console.error('❌ Base URL not configured. Run: node cli-tool.js setup');
    return;
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${config.baseUrl}/metadata/objects`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = await response.json();
    
    console.log('🏗️  Your Twenty CRM Schema:');
    console.log('');
    
    if (result && result.data && result.data.objects) {
      const objects = result.data.objects;
      
      // Separate standard and custom objects
      const standardObjects = objects.filter(obj => !obj.isCustom);
      const customObjects = objects.filter(obj => obj.isCustom);
      
      console.log(`📊 Total Objects: ${objects.length}`);
      console.log(`🔧 Standard Objects: ${standardObjects.length}`);
      console.log(`⚙️  Custom Objects: ${customObjects.length}`);
      console.log('');
      
      // Display key standard objects
      console.log('🔧 **Key Standard Objects:**');
      const keyObjects = ['person', 'company', 'note', 'task', 'opportunity', 'workflow'];
      standardObjects
        .filter(obj => keyObjects.includes(obj.nameSingular))
        .forEach(obj => {
          console.log(`   📋 ${obj.labelPlural} (${obj.namePlural})`);
          console.log(`       📝 ${obj.description || 'No description'}`);
          console.log(`       🆔 ${obj.id}`);
          console.log('');
        });
      
      // Display custom objects
      if (customObjects.length > 0) {
        console.log('⚙️  **Custom Objects:**');
        customObjects.forEach(obj => {
          console.log(`   📋 ${obj.labelPlural || obj.namePlural}`);
          console.log(`       📝 ${obj.description || 'Custom object'}`);
          console.log(`       🆔 ${obj.id}`);
          console.log('');
        });
      }
      
      // Available endpoints summary
      console.log('🚀 **Available REST Endpoints:**');
      const mainObjects = objects.filter(obj => 
        ['person', 'company', 'note', 'task', 'opportunity', 'activity'].includes(obj.nameSingular)
      );
      
      mainObjects.forEach(obj => {
        console.log(`   🔗 /rest/${obj.namePlural}`);
      });
      console.log('');
      
    } else {
      console.log('❌ Unexpected response format');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Create test data
async function createTestData() {
  const fs = require('fs');
  const path = require('path');
  
  const configFile = path.join(__dirname, '.twenty-config.json');
  let config = {};
  try {
    config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading config');
    return;
  }

  if (!config.apiKey) {
    console.error('❌ API key not configured');
    return;
  }

  if (!config.baseUrl) {
    console.error('❌ Base URL not configured');
    return;
  }

  try {
    const fetch = (await import('node-fetch')).default;
    
    console.log('🏗️  Creating test data for your CRM...');
    
    // Create a test company first
    console.log('\n1️⃣  Creating test company...');
    const companyData = {
      name: 'Acme Corporation',
      domainName: 'acme.com',
      address: '123 Business Street, Tech City, TC 12345',
      employees: 150
    };
    
    const companyResponse = await fetch(`${config.baseUrl}/companies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(companyData)
    });
    
    if (!companyResponse.ok) {
      throw new Error(`Failed to create company: ${await companyResponse.text()}`);
    }
    
    const company = await companyResponse.json();
    console.log(`✅ Company created: ${company.data.name} (ID: ${company.data.id})`);
    
    // Create test people
    console.log('\n2️⃣  Creating test people...');
    const peopleData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@acme.com',
        phone: '+1-555-0101',
        companyId: company.data.id
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@acme.com', 
        phone: '+1-555-0102',
        companyId: company.data.id
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@techstart.io',
        phone: '+1-555-0201'
      }
    ];
    
    const createdPeople = [];
    for (const personData of peopleData) {
      const personResponse = await fetch(`${config.baseUrl}/people`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(personData)
      });
      
      if (personResponse.ok) {
        const person = await personResponse.json();
        createdPeople.push(person.data);
        console.log(`✅ Person created: ${person.data.firstName} ${person.data.lastName}`);
      } else {
        console.log(`❌ Failed to create person: ${personData.firstName} ${personData.lastName}`);
      }
    }
    
    console.log('\n🎉 Test data creation complete!');
    console.log(`📊 Created: 1 company, ${createdPeople.length} people`);
    console.log('\nNow try:');
    console.log('  node cli-tool.js companies list');
    console.log('  node cli-tool.js people list');
    
  } catch (error) {
    console.error('❌ Error creating test data:', error.message);
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'schema':
    case 'metadata':
      await displayMetadata();
      break;
      
    case 'create-test-data':
    case 'demo':
      await createTestData();
      break;
      
    default:
      console.log(`
🚀 Enhanced Twenty CRM CLI

QUICK COMMANDS:
  node quick-cli.js schema          Show your CRM schema
  node quick-cli.js create-test-data Create demo data
  
MAIN CLI:
  node cli-tool.js interactive     Full interactive mode
  node cli-tool.js health          Health check
  node cli-tool.js companies list  List companies
  node cli-tool.js people list     List people
      `);
  }
}

if (require.main === module) {
  main();
}

#!/usr/bin/env node

/**
 * Debug script to see raw API responses from Twenty CRM
 */

const fs = require('fs');
const path = require('path');

async function debugAPIResponse() {
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

  const BASE_URL = 'https://crm.desktopcommander.app/rest';

  try {
    const fetch = (await import('node-fetch')).default;
    
    console.log('🔍 Testing API endpoints...\n');
    
    // Test companies endpoint
    console.log('1️⃣ Testing /companies endpoint:');
    console.log(`URL: ${BASE_URL}/companies?limit=5`);
    
    const companiesResponse = await fetch(`${BASE_URL}/companies?limit=5`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status: ${companiesResponse.status} ${companiesResponse.statusText}`);
    
    if (companiesResponse.ok) {
      const companiesData = await companiesResponse.json();
      console.log('Raw response structure:');
      console.log(JSON.stringify(companiesData, null, 2));
    } else {
      const errorText = await companiesResponse.text();
      console.log(`Error response: ${errorText}`);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Test people endpoint
    console.log('2️⃣ Testing /people endpoint:');
    console.log(`URL: ${BASE_URL}/people?limit=5`);
    
    const peopleResponse = await fetch(`${BASE_URL}/people?limit=5`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status: ${peopleResponse.status} ${peopleResponse.statusText}`);
    
    if (peopleResponse.ok) {
      const peopleData = await peopleResponse.json();
      console.log('Raw response structure:');
      console.log(JSON.stringify(peopleData, null, 2));
    } else {
      const errorText = await peopleResponse.text();
      console.log(`Error response: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugAPIResponse();

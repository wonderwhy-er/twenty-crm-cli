// Twenty CRM API Health Check
// This script verifies API connectivity and basic functionality

const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.twenty.com/rest'; // Update for self-hosted instances

class APIHealthChecker {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? await response.json() : await response.text()
    };
  }

  async runCheck(name, testFunction) {
    console.log(`\n🔍 Running: ${name}`);
    const startTime = Date.now();
    
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      this.results.push({
        name,
        status: 'PASS',
        duration,
        result
      });
      
      console.log(`✅ ${name} - PASSED (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        name,
        status: 'FAIL',
        duration,
        error: error.message
      });
      
      console.log(`❌ ${name} - FAILED (${duration}ms)`);
      console.log(`   Error: ${error.message}`);
      return null;
    }
  }

  async checkAuthentication() {
    return this.runCheck('Authentication', async () => {
      const response = await this.makeRequest('/people?limit=1');
      
      if (response.status === 401) {
        throw new Error('Authentication failed - check your API key');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.data}`);
      }
      
      return 'Authentication successful';
    });
  }

  async checkPeopleEndpoint() {
    return this.runCheck('People Endpoint', async () => {
      const response = await this.makeRequest('/people?limit=5');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.data}`);
      }
      
      const data = response.data;
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format');
      }
      
      return `Found ${data.data.length} people`;
    });
  }

  async checkCompaniesEndpoint() {
    return this.runCheck('Companies Endpoint', async () => {
      const response = await this.makeRequest('/companies?limit=5');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.data}`);
      }
      
      const data = response.data;
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format');
      }
      
      return `Found ${data.data.length} companies`;
    });
  }

  async checkMetadataEndpoint() {
    return this.runCheck('Metadata Endpoint', async () => {
      const response = await this.makeRequest('/metadata/objects');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.data}`);
      }
      
      const data = response.data;
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format');
      }
      
      const objectCount = data.data.length;
      const standardObjects = data.data.filter(obj => !obj.isCustom).length;
      const customObjects = data.data.filter(obj => obj.isCustom).length;
      
      return `Found ${objectCount} objects (${standardObjects} standard, ${customObjects} custom)`;
    });
  }

  async checkCreateOperation() {
    return this.runCheck('Create Operation', async () => {
      // Create a test person
      const testPerson = {
        firstName: 'Test',
        lastName: 'HealthCheck',
        email: `healthcheck-${Date.now()}@example.com`
      };
      
      const response = await this.makeRequest('/people', {
        method: 'POST',
        body: JSON.stringify(testPerson)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.data}`);
      }
      
      const createdPerson = response.data.data;
      
      // Clean up - delete the test person
      try {
        await this.makeRequest(`/people/${createdPerson.id}`, {
          method: 'DELETE'
        });
      } catch (cleanupError) {
        console.log(`   ⚠️  Cleanup warning: ${cleanupError.message}`);
      }
      
      return `Created and deleted test person: ${createdPerson.firstName} ${createdPerson.lastName}`;
    });
  }

  async checkResponseTimes() {
    return this.runCheck('Response Times', async () => {
      const times = [];
      
      for (let i = 0; i < 3; i++) {
        const startTime = Date.now();
        const response = await this.makeRequest('/people?limit=1');
        const endTime = Date.now();
        
        if (!response.ok) {
          throw new Error(`Request ${i + 1} failed: HTTP ${response.status}`);
        }
        
        times.push(endTime - startTime);
      }
      
      const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);
      
      if (avgTime > 5000) {
        throw new Error(`Average response time too slow: ${avgTime}ms`);
      }
      
      return `Avg: ${avgTime}ms, Min: ${minTime}ms, Max: ${maxTime}ms`;
    });
  }

  async checkRateLimits() {
    return this.runCheck('Rate Limit Headers', async () => {
      const response = await fetch(`${this.baseUrl}/people?limit=1`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const rateLimitHeaders = {
        limit: response.headers.get('X-RateLimit-Limit'),
        remaining: response.headers.get('X-RateLimit-Remaining'),
        reset: response.headers.get('X-RateLimit-Reset')
      };
      
      if (!rateLimitHeaders.limit && !rateLimitHeaders.remaining) {
        return 'Rate limit headers not present (may not be implemented)';
      }
      
      return `Limit: ${rateLimitHeaders.limit}, Remaining: ${rateLimitHeaders.remaining}`;
    });
  }

  async runAllChecks() {
    console.log('🚀 Twenty CRM API Health Check Starting...');
    console.log(`📍 Base URL: ${this.baseUrl}`);
    console.log(`🔑 API Key: ${this.apiKey ? this.apiKey.substring(0, 8) + '...' : 'NOT SET'}`);
    
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY') {
      console.log('\n❌ Error: Please set your API key in the script');
      return;
    }
    
    const startTime = Date.now();
    
    // Core checks
    await this.checkAuthentication();
    await this.checkPeopleEndpoint();
    await this.checkCompaniesEndpoint();
    await this.checkMetadataEndpoint();
    
    // Operational checks
    await this.checkCreateOperation();
    await this.checkResponseTimes();
    await this.checkRateLimits();
    
    const totalTime = Date.now() - startTime;
    
    // Summary
    console.log('\n📊 Health Check Summary:');
    console.log('=' * 50);
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total time: ${totalTime}ms`);
    
    if (failed === 0) {
      console.log('\n🎉 All checks passed! Your Twenty CRM API is healthy.');
    } else {
      console.log('\n⚠️  Some checks failed. Review the errors above.');
    }
    
    // Detailed results
    console.log('\n📋 Detailed Results:');
    this.results.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.name} (${result.duration}ms)`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
  }
}

// Connection test for self-hosted instances
async function testConnection(baseUrl) {
  console.log(`🔗 Testing connection to: ${baseUrl}`);
  
  try {
    const response = await fetch(baseUrl.replace('/rest', ''), {
      method: 'HEAD',
      timeout: 5000
    });
    
    console.log(`✅ Connection successful (${response.status})`);
    return true;
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    return false;
  }
}

// Run health check
async function main() {
  try {
    // Test connection first for self-hosted instances
    if (!BASE_URL.includes('api.twenty.com')) {
      const connected = await testConnection(BASE_URL);
      if (!connected) {
        console.log('\n💡 If using self-hosted Twenty, ensure:');
        console.log('   - Server is running and accessible');
        console.log('   - Correct base URL is configured');
        console.log('   - No firewall blocking the connection');
        return;
      }
    }
    
    const healthChecker = new APIHealthChecker(API_KEY, BASE_URL);
    await healthChecker.runAllChecks();
    
  } catch (error) {
    console.error('\n💥 Health check failed with error:', error.message);
  }
}

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APIHealthChecker, testConnection };
}

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main();
}

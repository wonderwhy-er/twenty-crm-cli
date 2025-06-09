#!/usr/bin/env node

/**
 * Twenty CRM CLI Tool
 * Command-line interface for interacting with Twenty CRM at https://crm.desktopcommander.app
 * 
 * Usage: node cli-tool.js <command> [options]
 * 
 * Commands:
 * - setup: Configure API key
 * - test: Test connection and authentication
 * - people: Manage people/contacts
 * - companies: Manage companies
 * - notes: Manage notes
 * - tasks: Manage tasks
 * - metadata: Get schema information
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG_FILE = path.join(__dirname, '.twenty-config.json');

class TwentyCLI {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading config:', error.message);
    }
    return {};
  }

  saveConfig() {
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
      console.log('✅ Configuration saved');
    } catch (error) {
      console.error('❌ Error saving config:', error.message);
    }
  }

  async makeRequest(endpoint, options = {}) {
    if (!this.config.apiKey) {
      throw new Error('API key not configured. Run: node cli-tool.js setup');
    }

    if (!this.config.baseUrl) {
      throw new Error('Base URL not configured. Run: node cli-tool.js setup');
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        throw new Error(`Cannot connect to CRM at ${this.config.baseUrl}. Check if the URL is accessible.`);
      }
      throw error;
    }
  }

  // Setup commands
  async setupApiKey() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      console.log('🔧 Twenty CRM CLI Setup');
      console.log('');
      console.log('You need:');
      console.log('1. Your Twenty CRM instance URL (e.g., https://crm.yourcompany.com)');
      console.log('2. An API key from your Twenty CRM settings');
      console.log('');

      // Function to ask for URL
      const askForUrl = () => {
        rl.question('Enter your Twenty CRM URL (without /rest): ', (url) => {
          if (!url.trim()) {
            console.log('❌ URL is required');
            askForUrl();
            return;
          }

          // Clean and validate URL
          let cleanUrl = url.trim();
          
          // Remove trailing slash
          if (cleanUrl.endsWith('/')) {
            cleanUrl = cleanUrl.slice(0, -1);
          }
          
          // Remove /rest if accidentally included
          if (cleanUrl.endsWith('/rest')) {
            cleanUrl = cleanUrl.slice(0, -5);
          }
          
          // Add https:// if not present
          if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
            cleanUrl = 'https://' + cleanUrl;
          }

          const baseUrl = cleanUrl + '/rest';
          
          console.log(`📍 Using: ${baseUrl}`);
          console.log('');
          console.log('To get your API key:');
          console.log(`1. Go to ${cleanUrl}/settings`);
          console.log('2. Navigate to API & Webhooks (under Developers)');
          console.log('3. Create or copy your API key');
          console.log('');

          // Function to ask for API key
          const askForApiKey = () => {
            rl.question('Enter your API key: ', (apiKey) => {
              if (apiKey.trim()) {
                this.config.apiKey = apiKey.trim();
                this.config.baseUrl = baseUrl;
                this.config.instanceUrl = cleanUrl;
                this.saveConfig();
                console.log('🎉 Configuration saved successfully!');
                console.log(`📍 CRM URL: ${cleanUrl}`);
                console.log(`🔗 API URL: ${baseUrl}`);
                console.log('');
                console.log('Next steps:');
                console.log('  node cli-tool.js test      # Test connection');
                console.log('  node cli-tool.js health    # Full health check');
              } else {
                console.log('❌ API key is required');
                askForApiKey();
                return;
              }
              rl.close();
              resolve();
            });
          };

          askForApiKey();
        });
      };

      askForUrl();
    });
  }

  async testConnection() {
    console.log('🔍 Testing connection to Twenty CRM...');
    console.log(`📍 URL: ${this.config.baseUrl || 'Not configured'}`);
    
    if (!this.config.baseUrl) {
      console.log('❌ Base URL not configured. Run: node cli-tool.js setup');
      return false;
    }
    
    try {
      const result = await this.makeRequest('/people?limit=1');
      console.log('✅ Connection successful!');
      console.log(`📊 API Response: Found ${result.data?.people?.length || 0} people (limited to 1)`);
      
      if (this.config.apiKey) {
        console.log(`🔑 API Key: ${this.config.apiKey.substring(0, 8)}...`);
      }
      
      return true;
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
      
      if (error.message.includes('401')) {
        console.log('💡 This usually means your API key is invalid. Run: node cli-tool.js setup');
      } else if (error.message.includes('Cannot connect')) {
        console.log('💡 Check your Twenty CRM URL and ensure it\'s accessible.');
      }
      
      return false;
    }
  }

  // People management
  async listPeople(options = {}) {
    const { limit = 10, orderBy = 'createdAt' } = options;
    
    try {
      console.log(`📋 Fetching people (limit: ${limit})...`);
      const result = await this.makeRequest(`/people?limit=${limit}&orderBy=${orderBy}`);
      
      if (result.data && result.data.people && result.data.people.length > 0) {
        console.log(`\n👥 Found ${result.data.people.length} people:\n`);
        
        result.data.people.forEach((person, index) => {
          const firstName = person.name?.firstName || '';
          const lastName = person.name?.lastName || '';
          const email = person.emails?.primaryEmail || 'No email';
          const phone = person.phones?.primaryPhoneNumber || 'No phone';
          
          console.log(`${index + 1}. ${firstName} ${lastName}`);
          console.log(`   📧 ${email}`);
          console.log(`   📞 ${phone}`);
          console.log(`   💼 ${person.jobTitle || 'No job title'}`);
          console.log(`   🏢 Company ID: ${person.companyId || 'No company'}`);
          console.log(`   🆔 ID: ${person.id}`);
          console.log(`   📅 Created: ${new Date(person.createdAt).toLocaleDateString()}`);
          console.log('');
        });
        
        if (result.pageInfo && result.pageInfo.hasNextPage) {
          console.log('📄 More results available (use pagination)');
        }
        
        console.log(`📊 Total people in CRM: ${result.totalCount || result.data.people.length}`);
      } else {
        console.log('📭 No people found');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error fetching people:', error.message);
      return null;
    }
  }

  async createPerson(personData) {
    try {
      console.log('➕ Creating new person...');
      const result = await this.makeRequest('/people', {
        method: 'POST',
        body: JSON.stringify(personData)
      });
      
      if (result.data) {
        console.log('✅ Person created successfully!');
        console.log(`👤 ${result.data.firstName} ${result.data.lastName}`);
        console.log(`📧 ${result.data.email}`);
        console.log(`🆔 ID: ${result.data.id}`);
      }
      
      return result.data;
    } catch (error) {
      console.error('❌ Error creating person:', error.message);
      return null;
    }
  }

  async getPerson(personId) {
    try {
      console.log(`🔍 Fetching person ${personId}...`);
      const result = await this.makeRequest(`/people/${personId}`);
      
      if (result.data) {
        const person = result.data;
        console.log('\n👤 Person Details:');
        console.log(`Name: ${person.firstName || ''} ${person.lastName || ''}`);
        console.log(`Email: ${person.email || 'Not set'}`);
        console.log(`Phone: ${person.phone || 'Not set'}`);
        console.log(`Company ID: ${person.companyId || 'Not set'}`);
        console.log(`Created: ${new Date(person.createdAt).toLocaleString()}`);
        console.log(`Updated: ${new Date(person.updatedAt).toLocaleString()}`);
        console.log(`ID: ${person.id}`);
      }
      
      return result.data;
    } catch (error) {
      console.error('❌ Error fetching person:', error.message);
      return null;
    }
  }

  // Companies management
  async listCompanies(options = {}) {
    const { limit = 10, orderBy = 'createdAt' } = options;
    
    try {
      console.log(`🏢 Fetching companies (limit: ${limit})...`);
      const result = await this.makeRequest(`/companies?limit=${limit}&orderBy=${orderBy}`);
      
      if (result.data && result.data.companies && result.data.companies.length > 0) {
        console.log(`\n🏢 Found ${result.data.companies.length} companies:\n`);
        
        result.data.companies.forEach((company, index) => {
          console.log(`${index + 1}. ${company.name || 'Unnamed Company'}`);
          console.log(`   🌐 ${company.domainName?.primaryLinkUrl || 'No domain'}`);
          console.log(`   🏷️  ${company.industry ? company.industry.join(', ') : 'No industry'}`);
          console.log(`   👥 ${company.employees || 'Unknown'} employees`);
          console.log(`   🆔 ID: ${company.id}`);
          console.log(`   📅 Created: ${new Date(company.createdAt).toLocaleDateString()}`);
          console.log('');
        });
        
        if (result.pageInfo && result.pageInfo.hasNextPage) {
          console.log('📄 More results available (use pagination)');
        }
        
        console.log(`📊 Total companies in CRM: ${result.totalCount || result.data.companies.length}`);
      } else {
        console.log('📭 No companies found');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error fetching companies:', error.message);
      return null;
    }
  }

  async createCompany(companyData) {
    try {
      console.log('🏢 Creating new company...');
      const result = await this.makeRequest('/companies', {
        method: 'POST',
        body: JSON.stringify(companyData)
      });
      
      if (result.data) {
        console.log('✅ Company created successfully!');
        console.log(`🏢 ${result.data.name}`);
        console.log(`🌐 ${result.data.domainName || 'No domain'}`);
        console.log(`🆔 ID: ${result.data.id}`);
      }
      
      return result.data;
    } catch (error) {
      console.error('❌ Error creating company:', error.message);
      return null;
    }
  }

  // Metadata
  async getMetadata() {
    try {
      console.log('📊 Fetching CRM metadata...');
      const result = await this.makeRequest('/metadata/objects');
      
      if (result && result.data && Array.isArray(result.data)) {
        console.log(`\n📋 Available objects (${result.data.length}):\n`);
        
        result.data.forEach((object, index) => {
          console.log(`${index + 1}. ${object.namePlural || object.labelPlural || object.name}`);
          console.log(`   📝 ${object.description || 'No description'}`);
          console.log(`   🔧 Custom: ${object.isCustom ? 'Yes' : 'No'}`);
          console.log(`   ✅ Active: ${object.isActive ? 'Yes' : 'No'}`);
          console.log(`   🆔 ID: ${object.id}`);
          console.log('');
        });
      } else {
        console.log('📋 Metadata structure:', JSON.stringify(result, null, 2));
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error fetching metadata:', error.message);
      return null;
    }
  }

  // Health check
  async healthCheck() {
    console.log('🏥 Running comprehensive health check...\n');
    
    const checks = [
      { name: 'API Connection', test: () => this.testConnection() },
      { name: 'People Endpoint', test: () => this.makeRequest('/people?limit=1') },
      { name: 'Companies Endpoint', test: () => this.makeRequest('/companies?limit=1') },
      { name: 'Metadata Endpoint', test: () => this.makeRequest('/metadata/objects') }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const check of checks) {
      try {
        console.log(`🔍 Testing ${check.name}...`);
        await check.test();
        console.log(`✅ ${check.name} - PASSED\n`);
        passed++;
      } catch (error) {
        console.log(`❌ ${check.name} - FAILED: ${error.message}\n`);
        failed++;
      }
    }
    
    console.log('📊 Health Check Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed === 0) {
      console.log('🎉 All systems operational!');
    } else {
      console.log('⚠️  Some issues detected. Check the errors above.');
    }
  }

  // Interactive mode
  async interactive() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('🚀 Twenty CRM Interactive Mode');
    console.log('Type "help" for available commands, "exit" to quit\n');

    const askQuestion = () => {
      rl.question('twenty> ', async (input) => {
        const [command, ...args] = input.trim().split(' ');
        
        switch (command.toLowerCase()) {
          case 'help':
            console.log('\nAvailable commands:');
            console.log('- people [limit] - List people');
            console.log('- companies [limit] - List companies');
            console.log('- person <id> - Get person by ID');
            console.log('- metadata - Show CRM schema');
            console.log('- test - Test connection');
            console.log('- health - Run health check');
            console.log('- exit - Quit interactive mode\n');
            break;
            
          case 'people':
            const limit = parseInt(args[0]) || 10;
            await this.listPeople({ limit });
            break;
            
          case 'companies':
            const companyLimit = parseInt(args[0]) || 10;
            await this.listCompanies({ limit: companyLimit });
            break;
            
          case 'person':
            if (args[0]) {
              await this.getPerson(args[0]);
            } else {
              console.log('Usage: person <id>');
            }
            break;
            
          case 'metadata':
            await this.getMetadata();
            break;
            
          case 'test':
            await this.testConnection();
            break;
            
          case 'health':
            await this.healthCheck();
            break;
            
          case 'exit':
          case 'quit':
            console.log('👋 Goodbye!');
            rl.close();
            return;
            
          case '':
            break;
            
          default:
            console.log(`Unknown command: ${command}. Type "help" for available commands.`);
        }
        
        console.log('');
        askQuestion();
      });
    };

    askQuestion();
  }

  // Display help
  showHelp() {
    const currentUrl = this.config.instanceUrl || 'Not configured - run setup first';
    console.log(`
🚀 Twenty CRM CLI Tool

USAGE:
  node cli-tool.js <command> [options]

COMMANDS:
  setup                           Configure CRM URL and API key
  test                           Test connection and authentication
  health                         Run comprehensive health check
  interactive                    Start interactive mode
  
  people list [--limit=10]       List people/contacts
  people get <id>                Get person by ID
  people create                  Create new person (interactive)
  
  companies list [--limit=10]    List companies
  companies get <id>             Get company by ID
  companies create               Create new company (interactive)
  
  metadata                       Get CRM schema information

EXAMPLES:
  node cli-tool.js setup
  node cli-tool.js test
  node cli-tool.js people list --limit=5
  node cli-tool.js interactive

Current CRM: ${currentUrl}
Supports any Twenty CRM instance (self-hosted, cloud, enterprise)
    `);
  }
}

// CLI Entry point
async function main() {
  const cli = new TwentyCLI();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    cli.showHelp();
    return;
  }
  
  const [command, subCommand, ...options] = args;
  
  try {
    switch (command.toLowerCase()) {
      case 'setup':
        await cli.setupApiKey();
        break;
        
      case 'test':
        await cli.testConnection();
        break;
        
      case 'health':
        await cli.healthCheck();
        break;
        
      case 'interactive':
        await cli.interactive();
        break;
        
      case 'people':
        if (subCommand === 'list') {
          const limit = options.find(opt => opt.startsWith('--limit='))?.split('=')[1] || 10;
          await cli.listPeople({ limit: parseInt(limit) });
        } else if (subCommand === 'get' && options[0]) {
          await cli.getPerson(options[0]);
        } else if (subCommand === 'create') {
          console.log('Interactive person creation not implemented yet. Use interactive mode.');
        } else {
          console.log('Usage: people list [--limit=10] | people get <id> | people create');
        }
        break;
        
      case 'companies':
        if (subCommand === 'list') {
          const limit = options.find(opt => opt.startsWith('--limit='))?.split('=')[1] || 10;
          await cli.listCompanies({ limit: parseInt(limit) });
        } else {
          console.log('Usage: companies list [--limit=10]');
        }
        break;
        
      case 'metadata':
        await cli.getMetadata();
        break;
        
      case 'help':
      case '--help':
      case '-h':
        cli.showHelp();
        break;
        
      default:
        console.log(`Unknown command: ${command}`);
        cli.showHelp();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Check if this script is being run directly
if (require.main === module) {
  main();
}

module.exports = TwentyCLI;

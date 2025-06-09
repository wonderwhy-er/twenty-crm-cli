# Twenty CRM CLI Tool

A powerful command-line interface for interacting with Twenty CRM instances. Built with [Desktop Commander](https://desktopcommander.app/) for seamless integration with Claude AI chat sessions.

## 🎯 Purpose

This CLI tool was specifically designed to be used by [Desktop Commander](https://desktopcommander.app/) through terminal interactions with Claude AI. It enables direct CRM management from chat conversations, making it perfect for:

- Quick CRM data queries during conversations
- Automated CRM operations from AI workflows  
- Real-time data access without switching applications
- Integration with AI-powered business processes

## 🏗️ Built With

- **[Desktop Commander](https://desktopcommander.app/)** - AI-powered terminal automation
- **Node.js** - Runtime environment
- **Twenty CRM REST API** - Open-source CRM platform

## ✨ Features

- 🔗 **Direct API Integration** - Connect to any Twenty CRM instance
- 👥 **People Management** - List, view, and search contacts
- 🏢 **Company Management** - Manage company records
- 📊 **Schema Exploration** - View CRM structure and metadata
- 🩺 **Health Monitoring** - Comprehensive system checks
- 🎮 **Interactive Mode** - Live CLI for exploration
- 🔧 **Debug Tools** - API response inspection

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Twenty CRM instance (self-hosted or cloud)
- API key from your Twenty CRM settings

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/twenty-crm-cli.git
cd twenty-crm-cli

# Install dependencies
npm install

# Configure your API key
node cli-tool.js setup
```

### First Run

```bash
# Test connection
node cli-tool.js health

# View your CRM schema
node quick-cli.js schema

# List companies
node cli-tool.js companies list

# Start interactive mode
node cli-tool.js interactive
```

## 📖 Usage

### Basic Commands

```bash
# Setup and testing
node cli-tool.js setup              # Configure API key
node cli-tool.js test               # Test connection
node cli-tool.js health             # Full health check

# Data operations
node cli-tool.js people list        # List contacts
node cli-tool.js companies list     # List companies
node cli-tool.js people get <id>    # Get specific person

# Schema and metadata
node quick-cli.js schema            # View CRM structure
node cli-tool.js metadata          # Detailed metadata

# Interactive mode
node cli-tool.js interactive        # Start live CLI
```

### Advanced Usage

```bash
# Pagination and filtering
node cli-tool.js people list --limit=20
node cli-tool.js companies list --limit=15

# Debug API responses
node debug-api.js

# Create test data
node quick-cli.js create-test-data
```

### Interactive Mode Commands

Once in interactive mode (`node cli-tool.js interactive`):

```
twenty> people 10          # List 10 people
twenty> companies 5        # List 5 companies
twenty> person <id>        # Get person details
twenty> metadata           # Show schema
twenty> test               # Test connection
twenty> health             # Health check
twenty> help               # Show help
twenty> exit               # Quit
```

## 🔧 Configuration

The tool stores configuration in `.twenty-config.json`:

```json
{
  "apiKey": "your-api-key-here",
  "baseUrl": "https://your-crm-instance.com/rest",
  "instanceUrl": "https://your-crm-instance.com"
}
```

### Getting Your API Key

1. Go to your Twenty CRM instance (e.g., `https://your-crm.company.com`)
2. Navigate to **Settings** > **API & Webhooks**
3. Create or copy your API key
4. Run `node cli-tool.js setup` and provide both your CRM URL and API key

## 🎮 Desktop Commander Integration

This tool is optimized for [Desktop Commander](https://desktopcommander.app/) usage:

### In Claude Chat:
```
"List the companies in my CRM"
→ Desktop Commander runs: node cli-tool.js companies list

"Get details for person John Doe"  
→ Desktop Commander runs: node cli-tool.js people get <id>

"Show me my CRM health status"
→ Desktop Commander runs: node cli-tool.js health
```

### Automation Examples:
```bash
# Daily CRM health check
node cli-tool.js health > daily-report.txt

# Export company list
node cli-tool.js companies list --limit=100 > companies.txt

# Monitor CRM activity
while true; do
  node cli-tool.js health
  sleep 3600  # Check every hour
done
```

## 📁 Project Structure

```
twenty-crm-cli/
├── cli-tool.js           # Main CLI application
├── quick-cli.js          # Quick commands (schema, test data)
├── debug-api.js          # API debugging tool
├── package.json          # Dependencies
├── .twenty-config.json   # Configuration (auto-generated)
├── docs/                 # Documentation
│   ├── README.md         # API documentation
│   ├── rest-api-overview.md
│   ├── authentication.md
│   ├── core-endpoints.md
│   ├── metadata-endpoints.md
│   ├── webhooks.md
│   └── examples/         # Code examples
└── README.md            # This file
```

## 🔍 Supported Twenty CRM Objects

### Standard Objects
- **People** - Individual contacts and leads
- **Companies** - Organizations and businesses  
- **Notes** - Text notes and observations
- **Tasks** - To-do items and reminders
- **Opportunities** - Sales opportunities
- **Activities** - Meetings, calls, interactions
- **Workflows** - Automated processes

### API Endpoints
- `/rest/people` - Manage contacts
- `/rest/companies` - Manage companies
- `/rest/notes` - Manage notes
- `/rest/tasks` - Manage tasks
- `/rest/opportunities` - Manage opportunities
- `/rest/metadata/objects` - Schema information

## 🛠️ Development

### Adding New Commands

1. Add command logic to `TwentyCLI` class in `cli-tool.js`
2. Update the CLI parser in the `main()` function
3. Add help text and examples

### API Integration

The tool uses the Twenty CRM REST API:
- Base URL: `https://your-instance.com/rest`
- Authentication: Bearer token
- Response format: JSON with nested data structure

### Testing

```bash
# Test all functionality
node cli-tool.js health

# Debug API responses  
node debug-api.js

# Test specific endpoints
node cli-tool.js test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Twenty](https://twenty.com/)** - The amazing open-source CRM platform
- **[Desktop Commander](https://desktopcommander.app/)** - AI-powered terminal automation that made this project possible
- **Claude AI** - For intelligent conversation-driven development

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/twenty-crm-cli/issues)
- **Twenty CRM Docs**: [https://twenty.com/developers](https://twenty.com/developers)
- **Desktop Commander**: [https://desktopcommander.app/](https://desktopcommander.app/)

## 🏷️ Version

Current version: 1.0.0

Built for seamless AI-driven CRM management through [Desktop Commander](https://desktopcommander.app/).

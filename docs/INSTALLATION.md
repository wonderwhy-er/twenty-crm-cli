# Installation and Quick Start Guide

## 🚀 Installation

### Option 1: Clone from GitHub (Recommended)
```bash
git clone https://github.com/wonderwhy-er/twenty-crm-cli.git
cd twenty-crm-cli
npm install
```

### Option 2: Download Release
1. Go to [Releases](https://github.com/wonderwhy-er/twenty-crm-cli/releases)
2. Download the latest version
3. Extract and run `npm install`

## ⚡ Quick Setup

### 1. Configure API Key and URL
```bash
node cli-tool.js setup
```
*Enter your Twenty CRM URL and API key when prompted*

### 2. Test Connection
```bash
node cli-tool.js health
```

### 3. Explore Your Data
```bash
# View CRM schema
node quick-cli.js schema

# List companies
node cli-tool.js companies list

# List people  
node cli-tool.js people list

# Interactive mode
node cli-tool.js interactive
```

## 🔑 Getting Your API Key

1. **Go to your Twenty CRM instance**
   - Example: `https://crm.yourcompany.com`
   - Or `https://app.twenty.com` for cloud
   - Or any self-hosted instance URL

2. **Navigate to Settings**
   - Click Settings (gear icon)
   - Go to "API & Webhooks" under Developers

3. **Create API Key**
   - Click "Create API Key"
   - Copy the generated key
   - Use it during `node cli-tool.js setup` along with your instance URL

## 🎯 Desktop Commander Integration

### Setup with Desktop Commander

1. **Install Desktop Commander**: [https://desktopcommander.app/](https://desktopcommander.app/)

2. **Clone this project to your Desktop Commander workspace**:
   ```bash
   cd ~/Desktop\ Commander\ Projects
   git clone https://github.com/wonderwhy-er/twenty-crm-cli.git
   ```

3. **Test from Claude chat**:
   ```
   User: "List my CRM companies"
   Claude: I'll check your CRM companies...
   → Desktop Commander runs: node twenty-crm-cli/cli-tool.js companies list
   ```

### Example AI Conversations

**CRM Health Check**:
```
User: "How is my CRM doing?"
→ Runs: node cli-tool.js health
→ Shows: ✅ All systems operational!
```

**Find Contact**:
```
User: "Find Magnus in my CRM"
→ Runs: node cli-tool.js people list | grep -i magnus
→ Shows: Magnus Hambleton @ ByFounders
```

**Company Overview**:
```
User: "Show me our portfolio companies"
→ Runs: node cli-tool.js companies list --limit=20
→ Shows: List of all companies with details
```

## 🛠️ Advanced Configuration

### Custom Twenty Instance
The tool now supports any Twenty CRM instance:

```bash
# During setup, you'll be prompted for:
# 1. Your Twenty CRM URL (e.g., https://crm.yourcompany.com)
# 2. Your API key

# The tool automatically creates the proper API URLs
# Configuration is saved in .twenty-config.json:
{
  "apiKey": "your-key",
  "baseUrl": "https://your-twenty.com/rest",
  "instanceUrl": "https://your-twenty.com"
}
```

### Environment Variables
```bash
export TWENTY_API_KEY="your-api-key"
export TWENTY_BASE_URL="https://your-twenty.com/rest"
```

## 📖 Command Reference

### Essential Commands
```bash
node cli-tool.js setup           # Initial configuration
node cli-tool.js health          # System health check
node cli-tool.js test            # Quick connection test
node cli-tool.js interactive     # Start interactive mode
```

### Data Commands
```bash
node cli-tool.js people list                    # List contacts
node cli-tool.js people list --limit=50         # List 50 contacts
node cli-tool.js people get <person-id>         # Get person details
node cli-tool.js companies list                 # List companies
node cli-tool.js companies list --limit=30      # List 30 companies
```

### Schema Commands
```bash
node quick-cli.js schema                        # View CRM structure
node cli-tool.js metadata                       # Detailed metadata
```

### Debug Commands
```bash
node debug-api.js                               # Debug API responses
node quick-cli.js create-test-data              # Create sample data
```

## 🔧 Troubleshooting

### Connection Issues
```bash
# Test API connectivity
node debug-api.js

# Check configuration
cat .twenty-config.json

# Verify API key
node cli-tool.js test
```

### Common Errors

**"API key not configured"**
```bash
node cli-tool.js setup
```

**"Cannot connect to CRM"**
- Check your Twenty instance is running
- Verify the URL is correct
- Ensure firewall/VPN isn't blocking

**"Invalid API key"**
- Generate new API key in Twenty settings
- Run setup again with new key

## 📊 Example Workflows

### Daily CRM Check
```bash
#!/bin/bash
echo "Daily CRM Health Report - $(date)"
node cli-tool.js health
echo "Recent contacts:"
node cli-tool.js people list --limit=5
echo "Recent companies:"
node cli-tool.js companies list --limit=5
```

### Contact Search
```bash
# Find all people at a specific company
node cli-tool.js people list | grep -i "acme"

# Health check and data summary
node cli-tool.js health && node quick-cli.js schema
```

### Data Export
```bash
# Export all companies to file
node cli-tool.js companies list --limit=1000 > companies-backup.txt

# Export all people to file  
node cli-tool.js people list --limit=1000 > people-backup.txt
```

## 🎯 Next Steps

1. **Explore Interactive Mode**: `node cli-tool.js interactive`
2. **Set up automation scripts** for daily CRM tasks
3. **Integrate with Desktop Commander** for AI-powered workflows
4. **Check the docs/** folder for API details and examples

## 🆘 Support

- **GitHub Issues**: [Report bugs/features](https://github.com/wonderwhy-er/twenty-crm-cli/issues)
- **Twenty CRM Docs**: [https://twenty.com/developers](https://twenty.com/developers)
- **Desktop Commander**: [https://desktopcommander.app/](https://desktopcommander.app/)

---

Built with ❤️ for the [Desktop Commander](https://desktopcommander.app/) and Twenty CRM communities.

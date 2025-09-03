# Siya Dashboard Menu MCP

A Model Context Protocol (MCP) server for managing Siya dashboard menu configurations via GitHub API. This server provides comprehensive CRUD operations for dashboard menu management with direct GitHub integration.

## Features

- **Complete Menu Management**: Create, read, update, and delete client dashboard configurations
- **Section-Level Operations**: Add, update, and remove individual menu sections
- **GitHub Integration**: Direct integration with GitHub API for configuration management
- **Automatic Commits**: All changes are automatically committed to the repository
- **Validation**: Built-in validation for configuration structure and uniqueness
- **Resource Support**: JSON schema and examples for configuration structure
- **Prompt Support**: Interactive guides for common operations

## Installation

```bash
npm install siya-dashboard-menu-mcp
```

Or install globally:

```bash
npm install -g siya-dashboard-menu-mcp
```

## Configuration

1. Create a `.env` file (or copy from `.env.example`):

```env
# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=syia-ai
GITHUB_REPO=app-insights-v2
GITHUB_CONFIG_PATH=dashboard-config.json

# Logging Configuration
LOG_LEVEL=info
```

2. Ensure your GitHub token has repository access to the target repository.

## Usage

### As MCP Server

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "siya-dashboard-menu": {
      "command": "siya-dashboard-menu-mcp",
      "args": [],
      "env": {
        "GITHUB_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Direct Usage

```bash
# Start the server
npm start

# Development mode
npm run dev

# Build the project
npm run build

# Test the server
npm test
```

## Available Tools

### Configuration Management

- **`get_dashboard_config`**: Get the complete dashboard configuration
- **`list_clients`**: List all available client configurations
- **`get_client_config`**: Get configuration for a specific client

### Client Management

- **`create_client_menu`**: Create a new client menu configuration
- **`update_client_menu`**: Update an existing client menu configuration
- **`delete_client_menu`**: Delete a client menu configuration

### Section Management

- **`add_menu_section`**: Add a new section to a client's menu
- **`update_menu_section`**: Update a specific section in a client's menu
- **`delete_menu_section`**: Delete a section from a client's menu

### Utility Tools

- **`get_repo_info`**: Get information about the GitHub repository

## Configuration Structure

Dashboard configurations follow this structure:

```json
{
  "client_name": {
    "branding": {
      "title": "SIYA Dashboard - Client Name",
      "logo": "client-logo.png",
      "favicon": "client-favicon.png"
    },
    "sections": [
      {
        "name": "Home",
        "link": "https://client.siya.com/home",
        "identifier": "home",
        "tag": "object"
      }
    ]
  }
}
```

## Examples

### Create a New Client

```javascript
await callTool("create_client_menu", {
  clientName: "newclient",
  branding: {
    title: "SIYA Dashboard - New Client",
    logo: "newclient-logo.png",
    favicon: "newclient-favicon.png"
  },
  sections: [
    {
      name: "Home",
      link: "https://newclient.siya.com/home",
      identifier: "home",
      tag: "object"
    }
  ]
});
```

### Add a Menu Section

```javascript
await callTool("add_menu_section", {
  clientName: "onesea",
  section: {
    name: "New Feature",
    link: "https://onesea.siya.com/new-feature",
    identifier: "new-feature",
    tag: "object"
  }
});
```

### Update a Menu Section

```javascript
await callTool("update_menu_section", {
  clientName: "onesea",
  identifier: "home",
  updates: {
    name: "Dashboard Home",
    link: "https://onesea.siya.com/dashboard"
  }
});
```

## Resources

The server provides helpful resources:

- **`dashboard://config/schema`**: JSON schema for configuration validation
- **`dashboard://examples/client`**: Example client configuration

## Prompts

Interactive guides are available:

- **`create_client_guide`**: Step-by-step guide for creating client configurations
- **`section_management_guide`**: Guide for managing menu sections

## Development

```bash
# Clone the repository
git clone https://github.com/syia-ai/siya-dashboard-menu-mcp.git
cd siya-dashboard-menu-mcp

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your GitHub token

# Build the project
npm run build

# Run in development mode
npm run dev

# Test the server
npm test
```

## Requirements

- Node.js >= 18.0.0
- GitHub personal access token with repository permissions
- Access to the target GitHub repository

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/syia-ai/siya-dashboard-menu-mcp/issues) page.
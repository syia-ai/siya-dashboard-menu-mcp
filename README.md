# Siya Dashboard Menu MCP

A Model Context Protocol (MCP) server for managing dashboard menu sections via GitHub API. This server provides focused section management operations for existing client dashboard configurations.

## Features

- **Section Management Only**: Add, update, and remove individual menu sections
- **GitHub Integration**: Direct integration with GitHub API for configuration management
- **Automatic Commits**: All changes are automatically committed to the repository
- **Validation**: Built-in validation for section structure and uniqueness
- **Error Handling**: Comprehensive error messages with helpful suggestions

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

### 🔹 Add Menu Section
**Tool:** `add_menu_section`

Add a new section to an existing client's dashboard menu.

```javascript
await callTool("add_menu_section", {
  clientName: "onesea",
  section: {
    name: "Performance Analytics",
    link: "https://onesea.siya.com/analytics",
    identifier: "performance-analytics",
    tag: "object"
  }
});
```

### 🔹 Update Menu Section
**Tool:** `update_menu_section`

Update specific properties of an existing menu section.

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

### 🔹 Remove Menu Section
**Tool:** `remove_menu_section`

Remove a section from a client's dashboard menu.

```javascript
await callTool("remove_menu_section", {
  clientName: "onesea",
  identifier: "old-feature"
});
```

## Section Structure

Each menu section requires these properties:

```json
{
  "name": "Display Name",           // Required: Shown in menu
  "link": "https://example.com",    // Required: Full URL
  "identifier": "unique-id",        // Required: Unique identifier (kebab-case)
  "tag": "object"                   // Required: Section tag (usually "object")
}
```

## Examples

### Adding a New Analytics Section

```javascript
await callTool("add_menu_section", {
  clientName: "onesea",
  section: {
    name: "Fuel Consumption Analytics",
    link: "https://onesea.siya.com/analytics/fuel-consumption",
    identifier: "fuel-consumption-analytics",
    tag: "object"
  }
});
```

### Updating a Section URL

```javascript
await callTool("update_menu_section", {
  clientName: "onesea",
  identifier: "emissions",
  updates: {
    link: "https://onesea.siya.com/environmental/emissions-tracking"
  }
});
```

### Removing a Deprecated Section

```javascript
await callTool("remove_menu_section", {
  clientName: "onesea",
  identifier: "legacy-reports"
});
```

## Resources

The server provides helpful resources:

- **`dashboard://section/schema`**: JSON schema for section validation
- **`dashboard://examples/section`**: Example section configurations and usage

## Prompts

Interactive guides are available:

- **`section_management_guide`**: Comprehensive guide for section operations
- **`section_best_practices`**: Best practices for section management

## Error Handling

The MCP provides detailed error messages:

- **Client not found**: Lists available clients
- **Section not found**: Shows available section identifiers
- **Duplicate identifier**: Prevents conflicts
- **Invalid format**: Validates section structure

## Best Practices

### Naming Conventions
- **Section Names**: Clear, descriptive, Title Case
- **Identifiers**: kebab-case, descriptive, unique
- **URLs**: HTTPS, complete paths, tested for accessibility

### Operations
- **Before adding**: Verify client exists, plan unique identifier
- **Before updating**: Use exact identifier, test new URLs
- **Before removing**: Confirm section is obsolete, consider dependencies

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
- Existing client configurations (this MCP only manages sections, not clients)

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
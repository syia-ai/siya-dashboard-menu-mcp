/**
 * Prompt handler for Siya Dashboard Menu MCP
 * Section management focused prompts
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Prompt, GetPromptResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";

export class PromptHandler {
  constructor(private server: Server) {}

  getPromptList(): Prompt[] {
    return [
      {
        name: "section_management_guide",
        description: "Comprehensive guide for managing dashboard menu sections",
        arguments: [
          {
            name: "operation",
            description: "Operation type: add, update, or remove",
            required: false
          },
          {
            name: "clientName",
            description: "Name of the client (e.g., onesea)",
            required: false
          }
        ]
      },
      {
        name: "section_best_practices",
        description: "Best practices for dashboard menu section management",
        arguments: []
      }
    ];
  }

  async handleGetPrompt(name: string, args?: Record<string, any>): Promise<GetPromptResult> {
    logger.info(`Getting prompt: ${name}`, { args });

    switch (name) {
      case "section_management_guide":
        const operation = args?.operation || "all";
        const clientName = args?.clientName || "onesea";
        
        return {
          description: `Guide for ${operation === 'all' ? 'all section management operations' : operation + 'ing dashboard menu sections'}`,
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `# Dashboard Menu Section Management Guide

## Available Operations

### 🔹 **ADD SECTION**
Add a new menu section to an existing client dashboard.

**Tool:** \`add_menu_section\`

**Example:**
\`\`\`json
{
  "clientName": "${clientName}",
  "section": {
    "name": "Performance Analytics",
    "link": "https://${clientName}.siya.com/analytics",
    "identifier": "performance-analytics",
    "tag": "object"
  }
}
\`\`\`

### 🔹 **UPDATE SECTION**
Update an existing menu section's properties.

**Tool:** \`update_menu_section\`

**Example:**
\`\`\`json
{
  "clientName": "${clientName}",
  "identifier": "home",
  "updates": {
    "name": "Dashboard Home",
    "link": "https://${clientName}.siya.com/dashboard"
  }
}
\`\`\`

### 🔹 **REMOVE SECTION**
Remove a menu section from the client dashboard.

**Tool:** \`remove_menu_section\`

**Example:**
\`\`\`json
{
  "clientName": "${clientName}",
  "identifier": "old-feature"
}
\`\`\`

## 📋 Section Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| \`name\` | string | ✅ | Display name shown in menu |
| \`link\` | string | ✅ | Full URL to the section |
| \`identifier\` | string | ✅ | Unique ID (kebab-case) |
| \`tag\` | string | ✅ | Section tag (usually "object") |

## ⚠️ Important Notes

- **Client must exist**: Cannot add sections to non-existent clients
- **Unique identifiers**: Each section identifier must be unique within a client
- **Valid URLs**: Links should be complete, accessible URLs
- **Kebab-case**: Use hyphens for identifiers (e.g., "new-feature")
- **Automatic commits**: All changes are automatically committed to GitHub

## 🎯 Common Use Cases

1. **Adding new dashboard features**
2. **Updating existing section links**
3. **Renaming menu items**
4. **Removing deprecated features**
5. **Reorganizing menu structure**

${operation === 'add' ? `
## 🔍 ADD Operation Details
- Validates client exists
- Checks identifier uniqueness
- Adds section to end of menu
- Creates descriptive commit message
` : operation === 'update' ? `
## 🔍 UPDATE Operation Details  
- Validates client and section exist
- Updates only provided fields
- Preserves existing properties
- Shows available identifiers if section not found
` : operation === 'remove' ? `
## 🔍 REMOVE Operation Details
- Validates client and section exist
- Removes section completely
- Shows available identifiers if section not found
- Cannot be undone (except via Git history)
` : ''}

Use the appropriate tool with the correct parameters for your operation!`
              }
            }
          ]
        };

      case "section_best_practices":
        return {
          description: "Best practices for dashboard menu section management",
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `# Dashboard Menu Section Best Practices

## 🎯 **Naming Conventions**

### Section Names
- **Clear and descriptive**: "Performance Analytics" vs "Analytics"
- **Consistent terminology**: Use same terms across similar sections
- **Proper capitalization**: Title Case for display names
- **Concise**: Keep under 25 characters when possible

### Identifiers
- **kebab-case**: Use hyphens, not spaces or underscores
- **Descriptive**: \`performance-analytics\` vs \`pa\`
- **Consistent**: Follow same pattern across all sections
- **No special chars**: Only letters, numbers, and hyphens

## 🔗 **URL Management**

### Link Guidelines
- **Use HTTPS**: Always secure protocols
- **Test accessibility**: Ensure URLs work before adding
- **Consistent domains**: Keep within client's domain structure
- **Avoid redirects**: Use final destination URLs

### Path Structure
- **Logical hierarchy**: \`/analytics/performance\` vs \`/perf\`
- **RESTful patterns**: Follow standard URL conventions
- **Version neutral**: Avoid version numbers in paths

## 🏗️ **Menu Organization**

### Section Order
- **Most used first**: Place frequently accessed items early
- **Logical grouping**: Group related functionality
- **Consistent flow**: Follow user workflow patterns

### Categories
- **Core functions**: Home, Dashboard basics
- **Analytics**: Reports, Performance, Analytics
- **Management**: Settings, Administration
- **Specialized**: Client-specific features

## ⚡ **Operational Best Practices**

### Before Adding Sections
1. **Verify client exists**: Check available clients first
2. **Plan identifier**: Choose unique, descriptive identifier
3. **Test URL**: Ensure destination is accessible
4. **Consider placement**: Think about menu order

### Before Updates
1. **Identify correctly**: Use exact identifier
2. **Partial updates**: Only update what needs changing
3. **Test changes**: Verify URLs still work
4. **Document reasons**: Clear commit messages

### Before Removal
1. **Confirm necessity**: Ensure section is truly obsolete
2. **Check dependencies**: No other sections link to it
3. **Backup consideration**: Note that removal is permanent
4. **User notification**: Consider informing users

## 🔄 **Change Management**

### Commit Messages
- **Descriptive**: Explain what and why
- **Consistent format**: Follow established patterns
- **Include details**: Section name, client, operation

### Testing
- **Verify menu renders**: Check dashboard displays correctly
- **Test links**: Ensure all URLs are accessible
- **Cross-browser**: Test in different browsers if possible

## 🚨 **Common Pitfalls**

### Avoid These Mistakes
- **Duplicate identifiers**: Each must be unique per client
- **Invalid URLs**: Always use complete, working URLs
- **Inconsistent naming**: Maintain naming conventions
- **Missing validation**: Don't assume clients/sections exist

### Error Prevention
- **Double-check spelling**: Especially for identifiers
- **Verify client names**: Use exact case-sensitive names
- **Test URLs first**: Ensure accessibility before adding
- **Follow patterns**: Maintain consistency with existing sections

## 📊 **Monitoring**

### After Changes
- **Verify commits**: Check GitHub for successful commits
- **Test functionality**: Ensure sections work as expected
- **Monitor usage**: Track if new sections are being used
- **Gather feedback**: User experience with changes

Following these practices ensures reliable, maintainable dashboard menu configurations! ✨`
              }
            }
          ]
        };

      default:
        throw new Error(`Prompt not found: ${name}`);
    }
  }
}
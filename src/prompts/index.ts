/**
 * Prompt handler for Siya Dashboard Menu MCP
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Prompt, GetPromptResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";

export class PromptHandler {
  constructor(private server: Server) {}

  getPromptList(): Prompt[] {
    return [
      {
        name: "create_client_guide",
        description: "Guide for creating a new client dashboard configuration",
        arguments: [
          {
            name: "clientName",
            description: "Name of the client",
            required: true
          }
        ]
      },
      {
        name: "section_management_guide",
        description: "Guide for managing dashboard menu sections",
        arguments: [
          {
            name: "operation",
            description: "Operation type: add, update, or delete",
            required: true
          }
        ]
      }
    ];
  }

  async handleGetPrompt(name: string, args?: Record<string, any>): Promise<GetPromptResult> {
    logger.info(`Getting prompt: ${name}`, { args });

    switch (name) {
      case "create_client_guide":
        const clientName = args?.clientName || "example_client";
        return {
          description: `Guide for creating dashboard configuration for ${clientName}`,
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Create a comprehensive dashboard configuration for client "${clientName}". 

Follow these steps:

1. **Define Branding:**
   - Set a descriptive title (e.g., "SIYA Dashboard - ${clientName}")
   - Specify logo filename
   - Specify favicon filename

2. **Create Menu Sections:**
   - Add essential sections like Home, Analytics, Reports
   - Use descriptive names and unique identifiers
   - Ensure URLs are accessible and functional
   - Set appropriate tags (usually "object")

3. **Validate Configuration:**
   - Check all identifiers are unique
   - Verify all required fields are present
   - Test URLs are reachable

Example structure:
\`\`\`json
{
  "${clientName}": {
    "branding": {
      "title": "SIYA Dashboard - ${clientName}",
      "logo": "${clientName}-logo.png",
      "favicon": "${clientName}-favicon.png"
    },
    "sections": [
      {
        "name": "Home",
        "link": "https://${clientName}.siya.com/home",
        "identifier": "home",
        "tag": "object"
      }
    ]
  }
}
\`\`\`

Use the create_client_menu tool to implement this configuration.`
              }
            }
          ]
        };

      case "section_management_guide":
        const operation = args?.operation || "add";
        return {
          description: `Guide for ${operation}ing dashboard menu sections`,
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Guide for ${operation}ing dashboard menu sections:

**${operation.toUpperCase()} Operation:**

${operation === 'add' ? `
To ADD a new section:
1. Use the add_menu_section tool
2. Provide:
   - clientName: Target client
   - section object with:
     - name: Display name
     - link: Full URL
     - identifier: Unique ID (kebab-case)
     - tag: Usually "object"

Example:
\`\`\`json
{
  "clientName": "onesea",
  "section": {
    "name": "New Feature",
    "link": "https://onesea.siya.com/new-feature",
    "identifier": "new-feature",
    "tag": "object"
  }
}
\`\`\`
` : operation === 'update' ? `
To UPDATE an existing section:
1. Use the update_menu_section tool
2. Provide:
   - clientName: Target client
   - identifier: Section to update
   - updates: Fields to change

Example:
\`\`\`json
{
  "clientName": "onesea",
  "identifier": "home",
  "updates": {
    "name": "Dashboard Home",
    "link": "https://onesea.siya.com/dashboard"
  }
}
\`\`\`
` : `
To DELETE a section:
1. Use the delete_menu_section tool
2. Provide:
   - clientName: Target client
   - identifier: Section to remove

Example:
\`\`\`json
{
  "clientName": "onesea",
  "identifier": "old-feature"
}
\`\`\`
`}

**Best Practices:**
- Always use unique identifiers
- Use kebab-case for identifiers
- Test URLs before adding
- Keep section names concise
- Maintain logical ordering`
              }
            }
          ]
        };

      default:
        throw new Error(`Prompt not found: ${name}`);
    }
  }
}
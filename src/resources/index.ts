/**
 * Resource handler for Siya Dashboard Menu MCP
 * Section management focused resources
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Resource, ReadResourceResult, TextContent } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";

export class ResourceHandler {
  constructor(private server: Server) {}

  getResourceList(): Resource[] {
    return [
      {
        uri: "dashboard://section/schema",
        name: "Dashboard Section Schema",
        description: "JSON schema for dashboard menu section structure",
        mimeType: "application/json"
      },
      {
        uri: "dashboard://examples/section",
        name: "Example Menu Section",
        description: "Example of a dashboard menu section configuration",
        mimeType: "application/json"
      }
    ];
  }

  async handleReadResource(uri: string): Promise<ReadResourceResult> {
    logger.info(`Reading resource: ${uri}`);

    switch (uri) {
      case "dashboard://section/schema":
        return {
          contents: [
            {
              type: "text",
              text: JSON.stringify({
                "$schema": "http://json-schema.org/draft-07/schema#",
                "title": "Dashboard Menu Section",
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Display name of the menu section"
                  },
                  "link": {
                    "type": "string",
                    "description": "URL for the menu section",
                    "format": "uri"
                  },
                  "identifier": {
                    "type": "string",
                    "description": "Unique identifier for the section (kebab-case recommended)",
                    "pattern": "^[a-z0-9-]+$"
                  },
                  "tag": {
                    "type": "string",
                    "description": "Section tag (usually 'object')"
                  }
                },
                "required": ["name", "link", "identifier", "tag"],
                "additionalProperties": false
              }, null, 2)
            }
          ]
        };

      case "dashboard://examples/section":
        return {
          contents: [
            {
              type: "text",
              text: JSON.stringify({
                "example_section": {
                  "name": "Performance Analytics",
                  "link": "https://onesea.siya.com/analytics/performance",
                  "identifier": "performance-analytics",
                  "tag": "object"
                },
                "usage_examples": {
                  "add_section": {
                    "clientName": "onesea",
                    "section": {
                      "name": "New Feature",
                      "link": "https://onesea.siya.com/new-feature",
                      "identifier": "new-feature",
                      "tag": "object"
                    }
                  },
                  "update_section": {
                    "clientName": "onesea",
                    "identifier": "home",
                    "updates": {
                      "name": "Dashboard Home",
                      "link": "https://onesea.siya.com/dashboard"
                    }
                  },
                  "remove_section": {
                    "clientName": "onesea",
                    "identifier": "old-feature"
                  }
                }
              }, null, 2)
            }
          ]
        };

      default:
        throw new Error(`Resource not found: ${uri}`);
    }
  }
}
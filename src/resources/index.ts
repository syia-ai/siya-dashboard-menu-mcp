/**
 * Resource handler for Siya Dashboard Menu MCP
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Resource, ReadResourceResult, TextContent } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";

export class ResourceHandler {
  constructor(private server: Server) {}

  getResourceList(): Resource[] {
    return [
      {
        uri: "dashboard://config/schema",
        name: "Dashboard Configuration Schema",
        description: "JSON schema for dashboard configuration structure",
        mimeType: "application/json"
      },
      {
        uri: "dashboard://examples/client",
        name: "Example Client Configuration",
        description: "Example of a complete client dashboard configuration",
        mimeType: "application/json"
      }
    ];
  }

  async handleReadResource(uri: string): Promise<ReadResourceResult> {
    logger.info(`Reading resource: ${uri}`);

    switch (uri) {
      case "dashboard://config/schema":
        return {
          contents: [
            {
              type: "text",
              text: JSON.stringify({
                "$schema": "http://json-schema.org/draft-07/schema#",
                "type": "object",
                "patternProperties": {
                  "^[a-zA-Z0-9_-]+$": {
                    "type": "object",
                    "properties": {
                      "branding": {
                        "type": "object",
                        "properties": {
                          "title": { "type": "string" },
                          "logo": { "type": "string" },
                          "favicon": { "type": "string" }
                        },
                        "required": ["title", "logo", "favicon"]
                      },
                      "sections": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "name": { "type": "string" },
                            "link": { "type": "string" },
                            "identifier": { "type": "string" },
                            "tag": { "type": "string" }
                          },
                          "required": ["name", "link", "identifier", "tag"]
                        }
                      }
                    },
                    "required": ["branding", "sections"]
                  }
                }
              }, null, 2)
            }
          ]
        };

      case "dashboard://examples/client":
        return {
          contents: [
            {
              type: "text",
              text: JSON.stringify({
                "example_client": {
                  "branding": {
                    "title": "SIYA Dashboard - Example Client",
                    "logo": "example-logo.png",
                    "favicon": "example-favicon.png"
                  },
                  "sections": [
                    {
                      "name": "Home",
                      "link": "https://example.com/home",
                      "identifier": "home",
                      "tag": "object"
                    },
                    {
                      "name": "Analytics",
                      "link": "https://example.com/analytics",
                      "identifier": "analytics",
                      "tag": "object"
                    }
                  ]
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
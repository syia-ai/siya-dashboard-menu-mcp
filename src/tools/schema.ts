/**
 * Tool schema definitions for Siya Dashboard Menu MCP
 * Only section management tools: add, update, remove
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const toolDefinitions: Tool[] = [
  {
    name: "get_dashboard_config",
    description: "Get the current complete dashboard configuration from GitHub",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "add_menu_section",
    description: "Add a new section to a client's dashboard menu",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Name of the client (e.g., 'onesea')"
        },
        section: {
          type: "object",
          properties: {
            name: { type: "string", description: "Section display name" },
            link: { type: "string", description: "Section URL" },
            identifier: { type: "string", description: "Unique identifier (kebab-case)" },
            tag: { type: "string", description: "Section tag (usually 'object')" }
          },
          required: ["name", "link", "identifier", "tag"],
          additionalProperties: false
        }
      },
      required: ["clientName", "section"],
      additionalProperties: false
    }
  },
  {
    name: "update_menu_section",
    description: "Update a specific section in a client's dashboard menu",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Name of the client (e.g., 'onesea')"
        },
        identifier: {
          type: "string",
          description: "Identifier of the section to update"
        },
        updates: {
          type: "object",
          properties: {
            name: { type: "string", description: "Section display name" },
            link: { type: "string", description: "Section URL" },
            identifier: { type: "string", description: "New unique identifier" },
            tag: { type: "string", description: "Section tag" }
          },
          additionalProperties: false,
          description: "Fields to update (at least one required)"
        }
      },
      required: ["clientName", "identifier", "updates"],
      additionalProperties: false
    }
  },
  {
    name: "remove_menu_section",
    description: "Remove a section from a client's dashboard menu",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Name of the client (e.g., 'onesea')"
        },
        identifier: {
          type: "string",
          description: "Identifier of the section to remove"
        }
      },
      required: ["clientName", "identifier"],
      additionalProperties: false
    }
  },
  {
    name: "upload_dashboard_file",
    description: "Upload an HTML dashboard file to S3 and add it as a menu section",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Name of the client to add the dashboard to (e.g., 'onesea')"
        },
        fileName: {
          type: "string",
          description: "Name for the dashboard file (will be made unique automatically)"
        },
        fileContent: {
          type: "string",
          description: "HTML content of the dashboard file"
        },
        menuSection: {
          type: "object",
          properties: {
            name: { type: "string", description: "Display name for the menu section" },
            identifier: { type: "string", description: "Unique identifier (kebab-case)" },
            tag: { type: "string", description: "Section tag (usually 'object')" }
          },
          required: ["name", "identifier", "tag"],
          additionalProperties: false,
          description: "Menu section details (link will be auto-generated from S3 URL)"
        },
        contentType: {
          type: "string",
          description: "Content type of the file (default: 'text/html')",
          default: "text/html"
        }
      },
      required: ["clientName", "fileName", "fileContent", "menuSection"],
      additionalProperties: false
    }
  }
];
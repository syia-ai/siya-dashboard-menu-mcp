/**
 * Tool schema definitions for Siya Dashboard Menu MCP
 * Only section management tools: add, update, remove
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const toolDefinitions: Tool[] = [
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
  }
];
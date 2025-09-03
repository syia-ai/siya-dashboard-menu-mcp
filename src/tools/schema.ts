/**
 * Tool schema definitions for Siya Dashboard Menu MCP
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const toolDefinitions: Tool[] = [
  {
    name: "get_dashboard_config",
    description: "Get the current dashboard configuration from GitHub",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "list_clients",
    description: "List all available client configurations in the dashboard",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "get_client_config",
    description: "Get configuration for a specific client",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Name of the client to get configuration for"
        }
      },
      required: ["clientName"],
      additionalProperties: false
    }
  },
  {
    name: "create_client_menu",
    description: "Create a new client menu configuration",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Name of the new client"
        },
        branding: {
          type: "object",
          properties: {
            title: { type: "string", description: "Dashboard title" },
            logo: { type: "string", description: "Logo filename" },
            favicon: { type: "string", description: "Favicon filename" }
          },
          required: ["title", "logo", "favicon"],
          additionalProperties: false
        },
        sections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Section display name" },
              link: { type: "string", description: "Section URL" },
              identifier: { type: "string", description: "Unique identifier" },
              tag: { type: "string", description: "Section tag" }
            },
            required: ["name", "link", "identifier", "tag"],
            additionalProperties: false
          },
          description: "Array of menu sections (optional)"
        }
      },
      required: ["clientName", "branding"],
      additionalProperties: false
    }
  },
  {
    name: "update_client_menu",
    description: "Update an existing client menu configuration",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Name of the client to update"
        },
        branding: {
          type: "object",
          properties: {
            title: { type: "string", description: "Dashboard title" },
            logo: { type: "string", description: "Logo filename" },
            favicon: { type: "string", description: "Favicon filename" }
          },
          additionalProperties: false,
          description: "Branding updates (optional)"
        },
        sections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Section display name" },
              link: { type: "string", description: "Section URL" },
              identifier: { type: "string", description: "Unique identifier" },
              tag: { type: "string", description: "Section tag" }
            },
            required: ["name", "link", "identifier", "tag"],
            additionalProperties: false
          },
          description: "Complete array of menu sections (optional, replaces all existing)"
        }
      },
      required: ["clientName"],
      additionalProperties: false
    }
  },
  {
    name: "delete_client_menu",
    description: "Delete a client menu configuration",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Name of the client to delete"
        }
      },
      required: ["clientName"],
      additionalProperties: false
    }
  },
  {
    name: "add_menu_section",
    description: "Add a new section to a client's menu",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Name of the client"
        },
        section: {
          type: "object",
          properties: {
            name: { type: "string", description: "Section display name" },
            link: { type: "string", description: "Section URL" },
            identifier: { type: "string", description: "Unique identifier" },
            tag: { type: "string", description: "Section tag" }
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
    description: "Update a specific section in a client's menu",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Name of the client"
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
          description: "Fields to update"
        }
      },
      required: ["clientName", "identifier", "updates"],
      additionalProperties: false
    }
  },
  {
    name: "delete_menu_section",
    description: "Delete a section from a client's menu",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Name of the client"
        },
        identifier: {
          type: "string",
          description: "Identifier of the section to delete"
        }
      },
      required: ["clientName", "identifier"],
      additionalProperties: false
    }
  },
  {
    name: "get_repo_info",
    description: "Get information about the GitHub repository",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  }
];
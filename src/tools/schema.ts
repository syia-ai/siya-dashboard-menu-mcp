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
  },
  {
    name: "list_eta_collections",
    description: "List all collections in the eta_raw_data_db MongoDB database",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "query_eta_data",
    description: "Query data from a collection in the eta_raw_data_db MongoDB database (read-only)",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Name of the collection to query"
        },
        query: {
          type: "object",
          description: "MongoDB query filter (optional, defaults to {} for all documents)",
          default: {}
        },
        limit: {
          type: "number",
          description: "Maximum number of documents to return (default: 100, max: 1000)",
          minimum: 1,
          maximum: 1000,
          default: 100
        },
        skip: {
          type: "number",
          description: "Number of documents to skip (for pagination)",
          minimum: 0,
          default: 0
        },
        sort: {
          type: "object",
          description: "Sort specification (e.g., {timestamp: -1} for descending by timestamp)"
        },
        projection: {
          type: "object",
          description: "Fields to include/exclude (e.g., {name: 1, _id: 0})"
        }
      },
      required: ["collection"],
      additionalProperties: false
    }
  },
  {
    name: "count_eta_documents",
    description: "Count documents in a collection with optional query filter",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Name of the collection to count documents in"
        },
        query: {
          type: "object",
          description: "MongoDB query filter (optional, defaults to {} for all documents)",
          default: {}
        }
      },
      required: ["collection"],
      additionalProperties: false
    }
  },
  {
    name: "get_eta_distinct_values",
    description: "Get distinct values for a field in a collection",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Name of the collection"
        },
        field: {
          type: "string",
          description: "Field name to get distinct values for"
        },
        query: {
          type: "object",
          description: "Optional query filter",
          default: {}
        }
      },
      required: ["collection", "field"],
      additionalProperties: false
    }
  },
  {
    name: "aggregate_eta_data",
    description: "Execute MongoDB aggregation pipeline on eta data (read-only)",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Name of the collection to aggregate"
        },
        pipeline: {
          type: "array",
          description: "MongoDB aggregation pipeline stages",
          items: {
            type: "object"
          },
          minItems: 1
        }
      },
      required: ["collection", "pipeline"],
      additionalProperties: false
    }
  },
  {
    name: "get_eta_collection_stats",
    description: "Get statistics about a collection (document count, size, indexes, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Name of the collection to get stats for"
        }
      },
      required: ["collection"],
      additionalProperties: false
    }
  }
];
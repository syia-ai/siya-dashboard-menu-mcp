/**
 * Siya Dashboard Menu MCP Server
 * A server implementation using Model Context Protocol for managing
 * Siya dashboard menu configurations via GitHub API
 */



import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourceTemplatesRequestSchema,
  ServerResult
} from "@modelcontextprotocol/sdk/types.js";
import { ToolHandler } from "./tools/index.js";
import { PromptHandler } from "./prompts/index.js";
import { ResourceHandler } from "./resources/index.js";
import { config } from "./utils/config.js";
import { logger } from "./utils/logger.js";
import { ToolArguments } from "./types/index.js";
import { toolDefinitions } from "./tools/schema.js";
import { Command } from "commander";

const program = new Command();

program
  .name("siya-dashboard-menu-mcp")
  .description("MCP server for managing Siya dashboard menu configurations via GitHub API")
  .version("1.0.0")
  .option("-e, --env-file <path>", "Path to environment file", ".env")
  .option("-d, --debug", "Enable debug logging")
  .parse();

const options = program.opts();

// Load environment variables
if (options.envFile) {
  process.env.ENV_FILE = options.envFile;
}

// Set debug level if requested
if (options.debug) {
  process.env.LOG_LEVEL = "debug";
}

async function main() {
  logger.info("Starting Siya Dashboard Menu MCP Server...");

  const server = new Server(
    {
      name: "siya-dashboard-menu-mcp",
      version: "1.0.0"
    },
    {
      capabilities: {
        resources: {
          read: true,
          list: true,
          templates: true
        },
        tools: {
          list: true,
          call: true
        },
        prompts: {
          list: true,
          get: true
        }
      }
    }
  );

  const toolHandler = new ToolHandler(server);
  const promptHandler = new PromptHandler(server);
  const resourceHandler = new ResourceHandler(server);

  // Resources list
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    logger.info("Handling ListResourcesRequest");
    const resources = resourceHandler.getResourceList();
    return { resources };
  });

  // Resource read
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    logger.info("Handling ReadResourceRequest", { request });
    const result = await resourceHandler.handleReadResource(request.params.uri);
    return result;
  });

  // Empty resource templates
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
    return { templates: [] };
  });

  // Tools list
  server.setRequestHandler(ListToolsRequestSchema, async (request) => {
    logger.info("Handling ListToolsRequest", { request });
    let tools = [...toolDefinitions];

    const params = request.params || {};
    const category = params.category as string | undefined;
    const search = params.search as string | undefined;

    // Apply category filter if provided
    if (category) {
      tools = tools.filter(tool => {
        const toolName = tool.name.toLowerCase();
        return toolName.includes(category.toLowerCase());
      });
    }

    // Apply search filter if provided
    if (search) {
      const searchTerm = search.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) || 
        (tool.description?.toLowerCase() || '').includes(searchTerm)
      );
    }

    return { tools };
  });

  // Tool call
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const result = await toolHandler.handleCallTool(
      request.params.name,
      request.params.arguments || {} as ToolArguments
    );
    return { content: result } as ServerResult;
  });

  // Prompts list
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    logger.info("Handling ListPromptsRequest");
    const prompts = promptHandler.getPromptList();
    return { prompts };
  });

  // Prompt get
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    logger.info("Handling GetPromptRequest", { request });
    const result = await promptHandler.handleGetPrompt(
      request.params.name,
      request.params.arguments
    );
    return result;
  });

  // Connect to transport and start server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info("Siya Dashboard Menu MCP Server started successfully");

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    logger.info("Received SIGINT, shutting down gracefully...");
    await server.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    logger.info("Received SIGTERM, shutting down gracefully...");
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  logger.error("Fatal error:", error);
  process.exit(1);
});
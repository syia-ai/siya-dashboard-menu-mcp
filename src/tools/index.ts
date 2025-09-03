/**
 * Tool handler for Siya Dashboard Menu MCP
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { GitHubService } from "../utils/github.js";
import { logger } from "../utils/logger.js";
import { 
  ToolArguments, 
  MenuCreateArgs, 
  MenuUpdateArgs, 
  MenuDeleteArgs,
  SectionAddArgs,
  SectionUpdateArgs,
  SectionDeleteArgs,
  DashboardConfig,
  DashboardSection
} from "../types/index.js";

export class ToolHandler {
  private githubService: GitHubService;

  constructor(private server: Server) {
    this.githubService = new GitHubService();
  }

  async handleCallTool(name: string, args: ToolArguments): Promise<TextContent[]> {
    logger.info(`Handling tool call: ${name}`, { args });

    try {
      switch (name) {
        case "get_dashboard_config":
          return await this.getDashboardConfig();
        
        case "list_clients":
          return await this.listClients();
        
        case "get_client_config":
          return await this.getClientConfig(args as { clientName: string });
        
        case "create_client_menu":
          return await this.createClientMenu(args as MenuCreateArgs);
        
        case "update_client_menu":
          return await this.updateClientMenu(args as MenuUpdateArgs);
        
        case "delete_client_menu":
          return await this.deleteClientMenu(args as MenuDeleteArgs);
        
        case "add_menu_section":
          return await this.addMenuSection(args as SectionAddArgs);
        
        case "update_menu_section":
          return await this.updateMenuSection(args as SectionUpdateArgs);
        
        case "delete_menu_section":
          return await this.deleteMenuSection(args as SectionDeleteArgs);
        
        case "get_repo_info":
          return await this.getRepoInfo();
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      logger.error(`Error in tool ${name}:`, error);
      return [{
        type: "text",
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
      }];
    }
  }

  private async getDashboardConfig(): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    return [{
      type: "text",
      text: JSON.stringify(config, null, 2)
    }];
  }

  private async listClients(): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    const clients = Object.keys(config);
    
    return [{
      type: "text",
      text: `Available clients:\n${clients.map(client => `- ${client}`).join('\n')}`
    }];
  }

  private async getClientConfig(args: { clientName: string }): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    const clientConfig = config[args.clientName];
    
    if (!clientConfig) {
      throw new Error(`Client '${args.clientName}' not found`);
    }

    return [{
      type: "text",
      text: JSON.stringify(clientConfig, null, 2)
    }];
  }

  private async createClientMenu(args: MenuCreateArgs): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    
    if (config[args.clientName]) {
      throw new Error(`Client '${args.clientName}' already exists`);
    }

    config[args.clientName] = {
      branding: args.branding,
      sections: args.sections || []
    };

    await this.githubService.updateDashboardConfig(
      config, 
      `Create new client menu for ${args.clientName}`
    );

    return [{
      type: "text",
      text: `Successfully created client menu for '${args.clientName}'`
    }];
  }

  private async updateClientMenu(args: MenuUpdateArgs): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    
    if (!config[args.clientName]) {
      throw new Error(`Client '${args.clientName}' not found`);
    }

    if (args.branding) {
      config[args.clientName].branding = {
        ...config[args.clientName].branding,
        ...args.branding
      };
    }

    if (args.sections) {
      config[args.clientName].sections = args.sections;
    }

    await this.githubService.updateDashboardConfig(
      config, 
      `Update client menu for ${args.clientName}`
    );

    return [{
      type: "text",
      text: `Successfully updated client menu for '${args.clientName}'`
    }];
  }

  private async deleteClientMenu(args: MenuDeleteArgs): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    
    if (!config[args.clientName]) {
      throw new Error(`Client '${args.clientName}' not found`);
    }

    delete config[args.clientName];

    await this.githubService.updateDashboardConfig(
      config, 
      `Delete client menu for ${args.clientName}`
    );

    return [{
      type: "text",
      text: `Successfully deleted client menu for '${args.clientName}'`
    }];
  }

  private async addMenuSection(args: SectionAddArgs): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    
    if (!config[args.clientName]) {
      throw new Error(`Client '${args.clientName}' not found`);
    }

    // Check if identifier already exists
    const existingSection = config[args.clientName].sections.find(
      section => section.identifier === args.section.identifier
    );
    
    if (existingSection) {
      throw new Error(`Section with identifier '${args.section.identifier}' already exists`);
    }

    config[args.clientName].sections.push(args.section);

    await this.githubService.updateDashboardConfig(
      config, 
      `Add section '${args.section.name}' to ${args.clientName} menu`
    );

    return [{
      type: "text",
      text: `Successfully added section '${args.section.name}' to client '${args.clientName}'`
    }];
  }

  private async updateMenuSection(args: SectionUpdateArgs): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    
    if (!config[args.clientName]) {
      throw new Error(`Client '${args.clientName}' not found`);
    }

    const sectionIndex = config[args.clientName].sections.findIndex(
      section => section.identifier === args.identifier
    );
    
    if (sectionIndex === -1) {
      throw new Error(`Section with identifier '${args.identifier}' not found`);
    }

    config[args.clientName].sections[sectionIndex] = {
      ...config[args.clientName].sections[sectionIndex],
      ...args.updates
    };

    await this.githubService.updateDashboardConfig(
      config, 
      `Update section '${args.identifier}' in ${args.clientName} menu`
    );

    return [{
      type: "text",
      text: `Successfully updated section '${args.identifier}' in client '${args.clientName}'`
    }];
  }

  private async deleteMenuSection(args: SectionDeleteArgs): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    
    if (!config[args.clientName]) {
      throw new Error(`Client '${args.clientName}' not found`);
    }

    const sectionIndex = config[args.clientName].sections.findIndex(
      section => section.identifier === args.identifier
    );
    
    if (sectionIndex === -1) {
      throw new Error(`Section with identifier '${args.identifier}' not found`);
    }

    const deletedSection = config[args.clientName].sections.splice(sectionIndex, 1)[0];

    await this.githubService.updateDashboardConfig(
      config, 
      `Delete section '${args.identifier}' from ${args.clientName} menu`
    );

    return [{
      type: "text",
      text: `Successfully deleted section '${deletedSection.name}' from client '${args.clientName}'`
    }];
  }

  private async getRepoInfo(): Promise<TextContent[]> {
    const repoInfo = await this.githubService.getRepoInfo();
    
    return [{
      type: "text",
      text: JSON.stringify({
        name: repoInfo.name,
        full_name: repoInfo.full_name,
        description: repoInfo.description,
        private: repoInfo.private,
        html_url: repoInfo.html_url,
        default_branch: repoInfo.default_branch,
        updated_at: repoInfo.updated_at
      }, null, 2)
    }];
  }
}
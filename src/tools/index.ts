/**
 * Tool handler for Siya Dashboard Menu MCP
 * Section management only: add, update, remove sections
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { GitHubService } from "../utils/github.js";
import { logger } from "../utils/logger.js";
import { 
  ToolArguments, 
  SectionAddArgs,
  SectionUpdateArgs,
  SectionDeleteArgs
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
        
        case "add_menu_section":
          return await this.addMenuSection(args as SectionAddArgs);
        
        case "update_menu_section":
          return await this.updateMenuSection(args as SectionUpdateArgs);
        
        case "remove_menu_section":
          return await this.removeMenuSection(args as SectionDeleteArgs);
        
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

  private async addMenuSection(args: SectionAddArgs): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    
    if (!config[args.clientName]) {
      throw new Error(`Client '${args.clientName}' not found. Available clients: ${Object.keys(config).join(', ')}`);
    }

    // Check if identifier already exists
    const existingSection = config[args.clientName].sections.find(
      section => section.identifier === args.section.identifier
    );
    
    if (existingSection) {
      throw new Error(`Section with identifier '${args.section.identifier}' already exists in client '${args.clientName}'`);
    }

    // Add the new section
    config[args.clientName].sections.push(args.section);

    await this.githubService.updateDashboardConfig(
      config, 
      `Add section '${args.section.name}' to ${args.clientName} menu

- Added new menu section: ${args.section.name}
- Identifier: ${args.section.identifier}
- Link: ${args.section.link}`
    );

    return [{
      type: "text",
      text: `✅ Successfully added section '${args.section.name}' to client '${args.clientName}'\n\nSection details:\n- Name: ${args.section.name}\n- Link: ${args.section.link}\n- Identifier: ${args.section.identifier}\n- Tag: ${args.section.tag}`
    }];
  }

  private async updateMenuSection(args: SectionUpdateArgs): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    
    if (!config[args.clientName]) {
      throw new Error(`Client '${args.clientName}' not found. Available clients: ${Object.keys(config).join(', ')}`);
    }

    const sectionIndex = config[args.clientName].sections.findIndex(
      section => section.identifier === args.identifier
    );
    
    if (sectionIndex === -1) {
      const availableIdentifiers = config[args.clientName].sections.map(s => s.identifier).join(', ');
      throw new Error(`Section with identifier '${args.identifier}' not found in client '${args.clientName}'. Available identifiers: ${availableIdentifiers}`);
    }

    const oldSection = { ...config[args.clientName].sections[sectionIndex] };

    // Update the section with provided updates
    config[args.clientName].sections[sectionIndex] = {
      ...config[args.clientName].sections[sectionIndex],
      ...args.updates
    };

    const updatedSection = config[args.clientName].sections[sectionIndex];

    await this.githubService.updateDashboardConfig(
      config, 
      `Update section '${args.identifier}' in ${args.clientName} menu

- Updated menu section: ${oldSection.name} → ${updatedSection.name}
- Changes: ${Object.keys(args.updates).join(', ')}`
    );

    return [{
      type: "text",
      text: `✅ Successfully updated section '${args.identifier}' in client '${args.clientName}'\n\nUpdated fields: ${Object.keys(args.updates).join(', ')}\n\nNew section details:\n- Name: ${updatedSection.name}\n- Link: ${updatedSection.link}\n- Identifier: ${updatedSection.identifier}\n- Tag: ${updatedSection.tag}`
    }];
  }

  private async removeMenuSection(args: SectionDeleteArgs): Promise<TextContent[]> {
    const config = await this.githubService.getDashboardConfig();
    
    if (!config[args.clientName]) {
      throw new Error(`Client '${args.clientName}' not found. Available clients: ${Object.keys(config).join(', ')}`);
    }

    const sectionIndex = config[args.clientName].sections.findIndex(
      section => section.identifier === args.identifier
    );
    
    if (sectionIndex === -1) {
      const availableIdentifiers = config[args.clientName].sections.map(s => s.identifier).join(', ');
      throw new Error(`Section with identifier '${args.identifier}' not found in client '${args.clientName}'. Available identifiers: ${availableIdentifiers}`);
    }

    const deletedSection = config[args.clientName].sections.splice(sectionIndex, 1)[0];

    await this.githubService.updateDashboardConfig(
      config, 
      `Remove section '${args.identifier}' from ${args.clientName} menu

- Removed menu section: ${deletedSection.name}
- Identifier: ${deletedSection.identifier}`
    );

    return [{
      type: "text",
      text: `✅ Successfully removed section '${deletedSection.name}' from client '${args.clientName}'\n\nRemoved section details:\n- Name: ${deletedSection.name}\n- Link: ${deletedSection.link}\n- Identifier: ${deletedSection.identifier}`
    }];
  }
}
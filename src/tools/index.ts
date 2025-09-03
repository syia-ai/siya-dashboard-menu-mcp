/**
 * Tool handler for Siya Dashboard Menu MCP
 * Section management only: add, update, remove sections
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { GitHubService } from "../utils/github.js";
import { S3Service } from "../utils/s3.js";
import { MongoDBService } from "../utils/mongodb.js";
import { logger } from "../utils/logger.js";
import { 
  ToolArguments, 
  SectionAddArgs,
  SectionUpdateArgs,
  SectionDeleteArgs,
  DashboardUploadArgs,
  MongoQueryArgs,
  MongoCountArgs,
  MongoDistinctArgs,
  MongoAggregateArgs,
  MongoStatsArgs
} from "../types/index.js";

export class ToolHandler {
  private githubService: GitHubService;
  private s3Service: S3Service;
  private mongoService: MongoDBService;

  constructor(private server: Server) {
    this.githubService = new GitHubService();
    this.s3Service = new S3Service();
    this.mongoService = new MongoDBService();
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
        
        case "upload_dashboard_file":
          return await this.uploadDashboardFile(args as DashboardUploadArgs);
        
        case "list_eta_collections":
          return await this.listEtaCollections();
        
        case "query_eta_data":
          return await this.queryEtaData(args as MongoQueryArgs);
        
        case "count_eta_documents":
          return await this.countEtaDocuments(args as MongoCountArgs);
        
        case "get_eta_distinct_values":
          return await this.getEtaDistinctValues(args as MongoDistinctArgs);
        
        case "aggregate_eta_data":
          return await this.aggregateEtaData(args as MongoAggregateArgs);
        
        case "get_eta_collection_stats":
          return await this.getEtaCollectionStats(args as MongoStatsArgs);
        
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

  private async uploadDashboardFile(args: DashboardUploadArgs): Promise<TextContent[]> {
    try {
      // Step 1: Validate client exists
      const config = await this.githubService.getDashboardConfig();
      
      if (!config[args.clientName]) {
        throw new Error(`Client '${args.clientName}' not found. Available clients: ${Object.keys(config).join(', ')}`);
      }

      // Step 2: Check if section identifier already exists
      const existingSection = config[args.clientName].sections.find(
        section => section.identifier === args.menuSection.identifier
      );
      
      if (existingSection) {
        throw new Error(`Section with identifier '${args.menuSection.identifier}' already exists in client '${args.clientName}'`);
      }

      // Step 3: Generate unique filename
      const uniqueFileName = this.s3Service.generateUniqueFileName(args.fileName);
      
      // Step 4: Upload file to S3
      const s3Url = await this.s3Service.uploadDashboardFile(
        uniqueFileName,
        args.fileContent,
        args.contentType || 'text/html'
      );

      // Step 5: Create menu section with S3 URL
      const newSection = {
        name: args.menuSection.name,
        link: s3Url,
        identifier: args.menuSection.identifier,
        tag: args.menuSection.tag
      };

      // Step 6: Add section to dashboard config
      config[args.clientName].sections.push(newSection);

      // Step 7: Commit changes to GitHub
      await this.githubService.updateDashboardConfig(
        config, 
        `Add dashboard file '${args.menuSection.name}' to ${args.clientName} menu

- Uploaded file: ${uniqueFileName}
- S3 URL: ${s3Url}
- Menu section: ${args.menuSection.name}
- Identifier: ${args.menuSection.identifier}`
      );

      return [{
        type: "text",
        text: `✅ Successfully uploaded dashboard file and added menu section!\n\n📁 **File Upload:**\n- Original name: ${args.fileName}\n- Uploaded as: ${uniqueFileName}\n- S3 URL: ${s3Url}\n\n📋 **Menu Section Added:**\n- Name: ${args.menuSection.name}\n- Identifier: ${args.menuSection.identifier}\n- Client: ${args.clientName}\n- Tag: ${args.menuSection.tag}\n\n🔗 **Dashboard is now accessible via the Siya menu!**`
      }];

    } catch (error) {
      logger.error('Error uploading dashboard file', { error, args });
      
      // Provide helpful error messages
      if (error.message?.includes('AccessDenied')) {
        return [{
          type: "text",
          text: `❌ Error: Access denied to S3 bucket. Please check AWS credentials and permissions.\n\nError details: ${error.message}`
        }];
      } else if (error.message?.includes('NoSuchBucket')) {
        return [{
          type: "text",
          text: `❌ Error: S3 bucket not found. Please check the bucket name configuration.\n\nError details: ${error.message}`
        }];
      } else {
        return [{
          type: "text",
          text: `❌ Error uploading dashboard file: ${error.message}`
        }];
      }
    }
  }

  private async listEtaCollections(): Promise<TextContent[]> {
    try {
      const collections = await this.mongoService.listCollections();
      
      return [{
        type: "text",
        text: `📊 **Available Collections in eta_raw_data_db:**\n\n${collections.map(col => `• ${col}`).join('\n')}\n\n**Total Collections:** ${collections.length}`
      }];
    } catch (error) {
      logger.error('Error listing ETA collections', { error });
      return [{
        type: "text",
        text: `❌ Error listing collections: ${error.message}`
      }];
    }
  }

  private async queryEtaData(args: MongoQueryArgs): Promise<TextContent[]> {
    try {
      const documents = await this.mongoService.findDocuments(
        args.collection,
        args.query || {},
        {
          limit: args.limit || 100,
          skip: args.skip || 0,
          sort: args.sort,
          projection: args.projection
        }
      );

      return [{
        type: "text",
        text: `📋 **Query Results from ${args.collection}:**\n\n**Documents Found:** ${documents.length}\n**Query:** ${JSON.stringify(args.query || {}, null, 2)}\n\n**Results:**\n\`\`\`json\n${JSON.stringify(documents, null, 2)}\n\`\`\``
      }];
    } catch (error) {
      logger.error('Error querying ETA data', { error, args });
      return [{
        type: "text",
        text: `❌ Error querying collection '${args.collection}': ${error.message}`
      }];
    }
  }

  private async countEtaDocuments(args: MongoCountArgs): Promise<TextContent[]> {
    try {
      const count = await this.mongoService.countDocuments(
        args.collection,
        args.query || {}
      );

      return [{
        type: "text",
        text: `🔢 **Document Count in ${args.collection}:**\n\n**Total Documents:** ${count.toLocaleString()}\n**Query:** ${JSON.stringify(args.query || {}, null, 2)}`
      }];
    } catch (error) {
      logger.error('Error counting ETA documents', { error, args });
      return [{
        type: "text",
        text: `❌ Error counting documents in '${args.collection}': ${error.message}`
      }];
    }
  }

  private async getEtaDistinctValues(args: MongoDistinctArgs): Promise<TextContent[]> {
    try {
      const values = await this.mongoService.getDistinctValues(
        args.collection,
        args.field,
        args.query || {}
      );

      return [{
        type: "text",
        text: `🎯 **Distinct Values for '${args.field}' in ${args.collection}:**\n\n**Unique Values Found:** ${values.length}\n**Query:** ${JSON.stringify(args.query || {}, null, 2)}\n\n**Values:**\n\`\`\`json\n${JSON.stringify(values, null, 2)}\n\`\`\``
      }];
    } catch (error) {
      logger.error('Error getting distinct ETA values', { error, args });
      return [{
        type: "text",
        text: `❌ Error getting distinct values for '${args.field}' in '${args.collection}': ${error.message}`
      }];
    }
  }

  private async aggregateEtaData(args: MongoAggregateArgs): Promise<TextContent[]> {
    try {
      const results = await this.mongoService.aggregate(
        args.collection,
        args.pipeline
      );

      return [{
        type: "text",
        text: `⚡ **Aggregation Results from ${args.collection}:**\n\n**Results Count:** ${results.length}\n**Pipeline Stages:** ${args.pipeline.length}\n\n**Pipeline:**\n\`\`\`json\n${JSON.stringify(args.pipeline, null, 2)}\n\`\`\`\n\n**Results:**\n\`\`\`json\n${JSON.stringify(results, null, 2)}\n\`\`\``
      }];
    } catch (error) {
      logger.error('Error aggregating ETA data', { error, args });
      return [{
        type: "text",
        text: `❌ Error executing aggregation on '${args.collection}': ${error.message}`
      }];
    }
  }

  private async getEtaCollectionStats(args: MongoStatsArgs): Promise<TextContent[]> {
    try {
      const stats = await this.mongoService.getCollectionStats(args.collection);

      return [{
        type: "text",
        text: `📊 **Collection Statistics for ${args.collection}:**\n\n• **Document Count:** ${stats.documentCount.toLocaleString()}\n• **Storage Size:** ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB\n• **Average Document Size:** ${stats.avgDocumentSize} bytes\n• **Total Index Size:** ${(stats.totalIndexSize / 1024 / 1024).toFixed(2)} MB\n• **Number of Indexes:** ${stats.indexes}\n\n**Collection Name:** ${stats.name}`
      }];
    } catch (error) {
      logger.error('Error getting ETA collection stats', { error, args });
      return [{
        type: "text",
        text: `❌ Error getting stats for collection '${args.collection}': ${error.message}`
      }];
    }
  }
}
/**
 * Type definitions for Siya Dashboard Menu MCP
 * Section management only
 */

export interface DashboardSection {
  name: string;
  link: string;
  identifier: string;
  tag: string;
}

export interface DashboardBranding {
  title: string;
  logo: string;
  favicon: string;
}

export interface DashboardConfig {
  [key: string]: {
    branding: DashboardBranding;
    sections: DashboardSection[];
  };
}

export interface SectionAddArgs {
  clientName: string;
  section: DashboardSection;
}

export interface SectionUpdateArgs {
  clientName: string;
  identifier: string;
  updates: Partial<DashboardSection>;
}

export interface SectionDeleteArgs {
  clientName: string;
  identifier: string;
}

export interface DashboardUploadArgs {
  clientName: string;
  fileName: string;
  fileContent: string;
  menuSection: {
    name: string;
    identifier: string;
    tag: string;
  };
  contentType?: string;
}

export interface MongoQueryArgs {
  collection: string;
  query?: any;
  limit?: number;
  skip?: number;
  sort?: any;
  projection?: any;
}

export interface MongoCountArgs {
  collection: string;
  query?: any;
}

export interface MongoDistinctArgs {
  collection: string;
  field: string;
  query?: any;
}

export interface MongoAggregateArgs {
  collection: string;
  pipeline: any[];
}

export interface MongoStatsArgs {
  collection: string;
}

export type ToolArguments = 
  | SectionAddArgs 
  | SectionUpdateArgs 
  | SectionDeleteArgs
  | DashboardUploadArgs
  | MongoQueryArgs
  | MongoCountArgs
  | MongoDistinctArgs
  | MongoAggregateArgs
  | MongoStatsArgs
  | Record<string, any>;
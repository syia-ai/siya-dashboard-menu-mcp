/**
 * Type definitions for Siya Dashboard Menu MCP
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

export interface MenuCreateArgs {
  clientName: string;
  branding: DashboardBranding;
  sections?: DashboardSection[];
}

export interface MenuUpdateArgs {
  clientName: string;
  branding?: Partial<DashboardBranding>;
  sections?: DashboardSection[];
}

export interface MenuDeleteArgs {
  clientName: string;
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

export type ToolArguments = 
  | MenuCreateArgs 
  | MenuUpdateArgs 
  | MenuDeleteArgs 
  | SectionAddArgs 
  | SectionUpdateArgs 
  | SectionDeleteArgs
  | Record<string, any>;
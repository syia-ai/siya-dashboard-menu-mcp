/**
 * GitHub API utility for Siya Dashboard Menu MCP
 */



import { Octokit } from '@octokit/rest';
import { config } from './config.js';
import { logger } from './logger.js';
import { DashboardConfig } from '../types/index.js';

export class GitHubService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: config.github.token,
    });
  }

  /**
   * Get the current dashboard configuration from GitHub
   */
  async getDashboardConfig(): Promise<DashboardConfig> {
    try {
      logger.info('Fetching dashboard config from GitHub', {
        owner: config.github.owner,
        repo: config.github.repo,
        path: config.github.configPath
      });

      const response = await this.octokit.repos.getContent({
        owner: config.github.owner,
        repo: config.github.repo,
        path: config.github.configPath,
      });

      if ('content' in response.data) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf8');
        return JSON.parse(content);
      } else {
        throw new Error('File content not found');
      }
    } catch (error) {
      logger.error('Failed to fetch dashboard config', { error });
      throw error;
    }
  }

  /**
   * Update the dashboard configuration in GitHub
   */
  async updateDashboardConfig(dashboardConfig: DashboardConfig, commitMessage: string): Promise<void> {
    try {
      logger.info('Updating dashboard config in GitHub', {
        owner: config.github.owner,
        repo: config.github.repo,
        path: config.github.configPath,
        commitMessage
      });

      // Get current file to get the SHA
      const currentFile = await this.octokit.repos.getContent({
        owner: config.github.owner,
        repo: config.github.repo,
        path: config.github.configPath,
      });

      if (!('sha' in currentFile.data)) {
        throw new Error('Unable to get file SHA');
      }

      const content = Buffer.from(JSON.stringify(dashboardConfig, null, 4)).toString('base64');

      await this.octokit.repos.createOrUpdateFileContents({
        owner: config.github.owner,
        repo: config.github.repo,
        path: config.github.configPath,
        message: commitMessage,
        content,
        sha: currentFile.data.sha,
      });

      logger.info('Dashboard config updated successfully');
    } catch (error) {
      logger.error('Failed to update dashboard config', { error });
      throw error;
    }
  }

  /**
   * Get repository information
   */
  async getRepoInfo() {
    try {
      const response = await this.octokit.repos.get({
        owner: config.github.owner,
        repo: config.github.repo,
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to get repository info', { error });
      throw error;
    }
  }
}
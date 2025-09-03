/**
 * Configuration management for Siya Dashboard Menu MCP
 */



import { config as dotenvConfig } from 'dotenv';
import { logger } from './logger.js';

// Load environment variables
const envFile = process.env.ENV_FILE || '.env';
dotenvConfig({ path: envFile });

interface Config {
  github: {
    token: string;
    owner: string;
    repo: string;
    configPath: string;
  };
  logging: {
    level: string;
  };
}

function validateConfig(): Config {
  const requiredEnvVars = ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    const error = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger.error(error);
    throw new Error(error);
  }

  return {
    github: {
      token: process.env.GITHUB_TOKEN!,
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      configPath: process.env.GITHUB_CONFIG_PATH || 'dashboard-config.json'
    },
    logging: {
      level: process.env.LOG_LEVEL || 'info'
    }
  };
}

export const config = validateConfig();
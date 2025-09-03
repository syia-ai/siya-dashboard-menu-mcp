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
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    s3Bucket: string;
    s3DashboardPrefix: string;
  };
  mongodb: {
    uri: string;
    database: string;
    timeout: number;
  };
  logging: {
    level: string;
  };
}

function validateConfig(): Config {
  const requiredEnvVars = [
    'GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO',
    'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY',
    'MONGODB_URI'
  ];
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
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      region: process.env.AWS_REGION || 'ap-south-1',
      s3Bucket: process.env.S3_BUCKET || 'one-sea-etl-prod',
      s3DashboardPrefix: process.env.S3_DASHBOARD_PREFIX || 'dashboard/custom/'
    },
    mongodb: {
      uri: process.env.MONGODB_URI!,
      database: process.env.MONGODB_DATABASE || 'eta_raw_data_db',
      timeout: parseInt(process.env.MONGODB_TIMEOUT || '30000')
    },
    logging: {
      level: process.env.LOG_LEVEL || 'info'
    }
  };
}

export const config = validateConfig();
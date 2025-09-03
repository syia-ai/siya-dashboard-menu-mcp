/**
 * AWS S3 utility for Siya Dashboard Menu MCP
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { config } from './config.js';
import { logger } from './logger.js';

export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
  }

  /**
   * Upload a file to S3 dashboard custom directory
   */
  async uploadDashboardFile(
    fileName: string,
    fileContent: string,
    contentType: string = 'text/html'
  ): Promise<string> {
    try {
      const key = `${config.aws.s3DashboardPrefix}${fileName}`;
      
      logger.info('Uploading file to S3', {
        bucket: config.aws.s3Bucket,
        key,
        contentType,
        size: fileContent.length
      });

      const command = new PutObjectCommand({
        Bucket: config.aws.s3Bucket,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
        // Add metadata
        Metadata: {
          uploadedBy: 'siya-dashboard-menu-mcp',
          uploadedAt: new Date().toISOString(),
        }
      });

      await this.s3Client.send(command);

      // Generate the public URL
      const publicUrl = `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
      
      logger.info('File uploaded successfully to S3', { publicUrl });
      
      return publicUrl;
    } catch (error) {
      logger.error('Failed to upload file to S3', { error, fileName });
      throw error;
    }
  }

  /**
   * Check if a file exists in S3
   */
  async fileExists(fileName: string): Promise<boolean> {
    try {
      const key = `${config.aws.s3DashboardPrefix}${fileName}`;
      
      const command = new HeadObjectCommand({
        Bucket: config.aws.s3Bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      logger.error('Error checking file existence in S3', { error, fileName });
      throw error;
    }
  }

  /**
   * Generate a unique filename to avoid conflicts
   */
  generateUniqueFileName(originalName: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = originalName.split('.').pop() || 'html';
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    
    // Create a safe filename
    const safeName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${safeName}-${timestamp}.${extension}`;
  }

  /**
   * Get the public URL for a file
   */
  getPublicUrl(fileName: string): string {
    const key = `${config.aws.s3DashboardPrefix}${fileName}`;
    return `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
  }
}
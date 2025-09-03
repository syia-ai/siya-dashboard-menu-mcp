/**
 * MongoDB utility for Siya Dashboard Menu MCP
 * Read-only operations for eta_raw_data_db
 */

import { MongoClient, Db, Collection } from 'mongodb';
import { config } from './config.js';
import { logger } from './logger.js';

export class MongoDBService {
  private client: MongoClient;
  private db: Db | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.client = new MongoClient(config.mongodb.uri, {
      serverSelectionTimeoutMS: config.mongodb.timeout,
      connectTimeoutMS: config.mongodb.timeout,
      socketTimeoutMS: config.mongodb.timeout,
    } as any);
  }

  /**
   * Connect to MongoDB database
   */
  async connect(): Promise<void> {
    try {
      if (this.isConnected) {
        return;
      }

      logger.info('Connecting to MongoDB...', {
        database: config.mongodb.database,
        timeout: config.mongodb.timeout
      });

      await this.client.connect();
      this.db = this.client.db(config.mongodb.database);
      this.isConnected = true;

      logger.info('Successfully connected to MongoDB', {
        database: config.mongodb.database
      });
    } catch (error) {
      logger.error('Failed to connect to MongoDB', { error });
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect(): Promise<void> {
    try {
      if (this.isConnected) {
        await this.client.close();
        this.isConnected = false;
        this.db = null;
        logger.info('Disconnected from MongoDB');
      }
    } catch (error) {
      logger.error('Error disconnecting from MongoDB', { error });
    }
  }

  /**
   * Get list of collections in the database
   */
  async listCollections(): Promise<string[]> {
    await this.connect();
    
    try {
      const collections = await this.db!.listCollections().toArray();
      return collections.map(col => col.name);
    } catch (error) {
      logger.error('Failed to list collections', { error });
      throw error;
    }
  }

  /**
   * Find documents in a collection (read-only)
   */
  async findDocuments(
    collectionName: string,
    query: any = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: any;
      projection?: any;
    } = {}
  ): Promise<any[]> {
    await this.connect();

    try {
      logger.info('Querying MongoDB collection', {
        collection: collectionName,
        query,
        options
      });

      const collection = this.db!.collection(collectionName);
      
      let cursor = collection.find(query);

      if (options.projection) {
        cursor = cursor.project(options.projection);
      }

      if (options.sort) {
        cursor = cursor.sort(options.sort);
      }

      if (options.skip) {
        cursor = cursor.skip(options.skip);
      }

      if (options.limit) {
        cursor = cursor.limit(options.limit);
      } else {
        // Default limit to prevent huge queries
        cursor = cursor.limit(100);
      }

      const documents = await cursor.toArray();
      
      logger.info('Query completed successfully', {
        collection: collectionName,
        documentsFound: documents.length
      });

      return documents;
    } catch (error) {
      logger.error('Failed to query collection', { error, collectionName });
      throw error;
    }
  }

  /**
   * Count documents in a collection
   */
  async countDocuments(
    collectionName: string,
    query: any = {}
  ): Promise<number> {
    await this.connect();

    try {
      const collection = this.db!.collection(collectionName);
      const count = await collection.countDocuments(query);
      
      logger.info('Document count completed', {
        collection: collectionName,
        query,
        count
      });

      return count;
    } catch (error) {
      logger.error('Failed to count documents', { error, collectionName });
      throw error;
    }
  }

  /**
   * Get distinct values for a field
   */
  async getDistinctValues(
    collectionName: string,
    field: string,
    query: any = {}
  ): Promise<any[]> {
    await this.connect();

    try {
      const collection = this.db!.collection(collectionName);
      const values = await collection.distinct(field, query);
      
      logger.info('Distinct values query completed', {
        collection: collectionName,
        field,
        valuesCount: values.length
      });

      return values;
    } catch (error) {
      logger.error('Failed to get distinct values', { error, collectionName, field });
      throw error;
    }
  }

  /**
   * Execute aggregation pipeline (read-only)
   */
  async aggregate(
    collectionName: string,
    pipeline: any[]
  ): Promise<any[]> {
    await this.connect();

    try {
      logger.info('Executing aggregation pipeline', {
        collection: collectionName,
        pipelineStages: pipeline.length
      });

      const collection = this.db!.collection(collectionName);
      const results = await collection.aggregate(pipeline).toArray();
      
      logger.info('Aggregation completed successfully', {
        collection: collectionName,
        resultsCount: results.length
      });

      return results;
    } catch (error) {
      logger.error('Failed to execute aggregation', { error, collectionName });
      throw error;
    }
  }

  /**
   * Get collection stats
   */
  async getCollectionStats(collectionName: string): Promise<any> {
    await this.connect();

    try {
      // Use db.runCommand instead of collection.stats()
      const stats = await this.db!.command({ collStats: collectionName });
      return {
        name: collectionName,
        documentCount: stats.count || 0,
        storageSize: stats.storageSize || 0,
        avgDocumentSize: stats.avgObjSize || 0,
        totalIndexSize: stats.totalIndexSize || 0,
        indexes: stats.nindexes || 0
      };
    } catch (error) {
      logger.error('Failed to get collection stats', { error, collectionName });
      throw error;
    }
  }
}
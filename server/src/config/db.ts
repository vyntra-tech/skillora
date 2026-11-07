import mongoose from 'mongoose';
import { config } from './index';

let mongoMemoryServer: any = null;

export const connectDB = async (): Promise<void> => {
  try {
    // Attempt connecting to the configured MongoDB URI with a short timeout
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected to external MongoDB at ${config.mongoUri}`);
  } catch (err: any) {
    console.warn(`[Database] Could not connect to external MongoDB (${err.message}).`);
    console.log('[Database] Starting built-in in-memory MongoDB server for zero-config persistence...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'talent_career_platform',
        },
      });
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      console.log(`[Database] Connected to in-memory MongoDB at ${uri}`);
    } catch (memErr: any) {
      console.error('[Database] Fatal: Failed to initialize in-memory database:', memErr.message);
      throw memErr;
    }
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};


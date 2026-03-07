import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../src/config/database';

let mongoServer: MongoMemoryServer;

export async function setupTestDB(): Promise<void> {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDB(uri);
}

export async function teardownTestDB(): Promise<void> {
  await disconnectDB();
  await mongoServer.stop();
}

export async function clearDB(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].drop().catch(() => {});
  }
}

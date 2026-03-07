import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB(uri?: string, retries = 5, delayMs = 3000): Promise<void> {
  const connectionUri = uri || env.MONGODB_URI;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(connectionUri);
      console.log(`MongoDB connected: ${connectionUri}`);
      return;
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      console.warn(`MongoDB connection attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export function getConnectionState(): { status: string; ready: boolean } {
  const state = mongoose.connection.readyState;
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return {
    status: stateMap[state] ?? 'unknown',
    ready: state === 1,
  };
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}

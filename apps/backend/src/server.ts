import { app } from './app';
import { connectDB } from './config/database';
import { env } from './config/env';

async function start(): Promise<void> {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

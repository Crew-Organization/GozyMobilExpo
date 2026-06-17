const http = require('http');

const { createApp } = require('./app');
const { connectDatabase } = require('./config/database');
const { env } = require('./config/env');
const { initializeFirebase } = require('./config/firebase');
const { attachSocket } = require('./socket');

async function bootstrap() {
  await connectDatabase();
  initializeFirebase();

  const app = createApp();
  const server = http.createServer(app);
  attachSocket(server);

  server.listen(env.port, () => {
    console.log(`Gozy backend listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start Gozy backend', error);
  process.exit(1);
});

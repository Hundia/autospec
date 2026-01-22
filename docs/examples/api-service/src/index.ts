import { app } from '@/app';
import { config } from '@/config';

const server = app.listen(config.port, () => {
  console.info(`DataHub API Gateway listening on port ${config.port}`);
});

const shutdown = (signal: NodeJS.Signals): void => {
  console.info(`Received ${signal}, shutting down...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

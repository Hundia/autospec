import 'dotenv/config';
import app from './app.js';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

const server = app.listen(PORT, () => {
  console.log(`TaskFlow API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default server;

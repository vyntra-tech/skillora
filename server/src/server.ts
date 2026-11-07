import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config } from './config';
import { connectDB } from './config/db';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { seedDatabase } from './seed/seeder';
import { Job } from './models/Job';

const app = express();

// Security and utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and specified client origins
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads folder for locally uploaded company logos, resumes, and covers
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Skillora Backend API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1', apiRoutes);

// Global Error Handler
app.use(errorHandler);

// Connect DB and launch server
const startServer = async () => {
  try {
    await connectDB();

    // Check if jobs exist, if not auto-seed so the developer immediately has full data
    const jobsCount = await Job.countDocuments();
    if (jobsCount === 0) {
      console.log('[Server] Database is empty. Auto-seeding initial mock data...');
      await seedDatabase();
    }

    const server = app.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(`🚀 TalentPulse Server running on port ${config.port}`);
      console.log(`📡 API Base URL:  http://localhost:${config.port}/api/v1`);
      console.log(`🏥 Health Check: http://localhost:${config.port}/api/health`);
      console.log(`📂 Static Files: http://localhost:${config.port}/uploads`);
      console.log(`=======================================================`);
    });

    const shutdown = async () => {
      console.log('[Server] Shutting down gracefully...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;


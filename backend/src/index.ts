import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import resumeRoutes from './routes/resume';
import atsRoutes from './routes/ats';
import userRoutes from './routes/user';
import templateRoutes from './routes/template';
dotenv.config();
const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/template', templateRoutes);
app.use(errorHandler);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
async function startServer() {
  try {
    try {
      await connectDB();
      console.log('✅ MongoDB connected successfully');
    } catch (dbError) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  MongoDB not available - running in development mode without database');
        console.warn('   Database-dependent features will use fallback responses');
      } else {
        throw dbError; 
      }
    }
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}
startServer();
export default app; 
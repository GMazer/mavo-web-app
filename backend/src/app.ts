
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import healthRouter from './routes/health';
import productsRouter from './routes/products';
import uploadRouter from './routes/upload';
import settingsRouter from './routes/settings';
import categoriesRouter from './routes/categories';
import ordersRouter from './routes/orders';
import locationsRouter from './routes/locations';
import dashboardRouter from './routes/dashboard';
import { Bindings } from './bindings';

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', logger());

// Fix CORS: Allow specific origins including localhost and ngrok
app.use('*', cors({
  origin: (origin) => {
    // Allow standard development ports and production domains
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5173', 
      'http://localhost:8080',
      'http://127.0.0.1:3001'
    ];
    
    // 1. If origin is in the allowed list, return it.
    if (allowedOrigins.includes(origin)) {
      return origin;
    }

    // 2. Allow if origin is undefined (e.g. server-to-server or non-browser tools)
    if (!origin) {
      return origin;
    }

    // 3. Allow ngrok domains dynamically (ends with .ngrok-free.app)
    if (origin.endsWith('.ngrok-free.app')) {
      return origin;
    }

    // Fallback: Reflect origin for development convenience (or return null to block)
    return origin; 
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Upgrade-Insecure-Requests', 'Cache-Control', 'Pragma'], 
  exposeHeaders: ['Content-Length', 'ETag'],
  maxAge: 600,
  credentials: true,
}));

// Routes
app.route('/api/health', healthRouter);
app.route('/api/products', productsRouter);
app.route('/api/uploads', uploadRouter);
app.route('/api/settings', settingsRouter);
app.route('/api/categories', categoriesRouter);
app.route('/api/orders', ordersRouter);
app.route('/api/locations', locationsRouter);
app.route('/api/dashboard', dashboardRouter);

// 404 Handler
app.notFound((c) => {
  return c.json({ message: 'Not Found', ok: false }, 404);
});

// Error Handler
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ message: 'Internal Server Error', error: err.message }, 500);
});

export default app;

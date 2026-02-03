import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import healthRouter from './routes/health';
import productsRouter from './routes/products';
import { Bindings } from './bindings';

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', logger());

// Fix CORS: Reflect origin and allow standard cache-control headers
app.use('*', cors({
  origin: (origin) => origin, // Reflects the request origin to allow localhost:3001, etc.
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Add 'Cache-Control' and 'Pragma' to allowed headers
  allowHeaders: ['Content-Type', 'Authorization', 'Upgrade-Insecure-Requests', 'Cache-Control', 'Pragma'], 
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Routes
app.route('/api/health', healthRouter);
app.route('/api/products', productsRouter);

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
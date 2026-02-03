import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import healthRouter from './routes/health';
import productsRouter from './routes/products';
import { Bindings } from './bindings';

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: '*', // In production, replace with your specific frontend domain
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
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
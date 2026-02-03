import { Hono } from 'hono';
import { Bindings } from '../bindings';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  let dbStatus = 'UNKNOWN';
  try {
    // Ping the database
    await c.env.DB.prepare('SELECT 1').first();
    dbStatus = 'CONNECTED';
  } catch (e) {
    dbStatus = 'DISCONNECTED';
    console.error(e);
  }

  return c.json({
    status: 'UP',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    environment: 'Cloudflare Worker'
  });
});

export default app;
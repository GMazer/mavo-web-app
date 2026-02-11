
import { Hono } from 'hono';
import { Bindings } from '../bindings';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  let dbStatus = 'UNKNOWN';
  let tables: string[] = [];
  try {
    // Ping the database
    await c.env.DB.prepare('SELECT 1').first();
    dbStatus = 'CONNECTED';

    // List all tables in the database to debug schema issues
    const result = await c.env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name != '_cf_KV' ORDER BY name").all();
    tables = result.results.map((r: any) => r.name as string);

  } catch (e: any) {
    dbStatus = 'DISCONNECTED';
    console.error(e);
    return c.json({
        status: 'ERROR',
        database: dbStatus,
        error: e.message
    }, 500);
  }

  return c.json({
    status: 'UP',
    database: dbStatus,
    tables: tables,
    tableCount: tables.length,
    timestamp: new Date().toISOString(),
    environment: 'Cloudflare Worker'
  });
});

export default app;

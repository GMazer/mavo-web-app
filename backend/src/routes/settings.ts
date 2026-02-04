
import { Hono } from 'hono';
import { Bindings, D1Result } from '../bindings';

const app = new Hono<{ Bindings: Bindings }>();

// GET /api/settings
app.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare("SELECT * FROM Settings").all() as D1Result<{ key: string; value: string }>;
        
        // Convert array of {key, value} to single object
        const settings = results.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return c.json(settings);
    } catch (e: any) {
        console.error("Get Settings Error:", e);
        return c.json({ error: e.message }, 500);
    }
});

// POST /api/settings (Update multiple settings)
app.post('/', async (c) => {
    try {
        const body = await c.req.json();
        
        if (!body || Object.keys(body).length === 0) {
            return c.json({ success: true, updated: [] });
        }
        
        // Use a transaction or batch if possible
        // Quoting "key" and "value" to be safe with SQL reserved words
        const stmt = c.env.DB.prepare(`
            INSERT INTO Settings ("key", "value") VALUES (?, ?)
            ON CONFLICT("key") DO UPDATE SET "value" = excluded."value"
        `);

        const updates = Object.entries(body).map(([key, value]) => 
            stmt.bind(key, String(value || '')) // Ensure value is string
        );

        await c.env.DB.batch(updates);

        return c.json({ success: true, updated: Object.keys(body) });
    } catch (e: any) {
        console.error("Save Settings Error:", e);
        return c.json({ error: e.message }, 500);
    }
});

export default app;

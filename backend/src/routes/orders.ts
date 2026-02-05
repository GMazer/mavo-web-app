
import { Hono } from 'hono';
import { Bindings, D1Result } from '../bindings';

const app = new Hono<{ Bindings: Bindings }>();

// POST /api/orders - Create a new order
app.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const { 
            customerName, customerPhone, customerEmail, 
            addressDetail, city, district, ward, note,
            totalAmount, paymentMethod, items 
        } = body;

        // Basic validation
        if (!customerName || !customerPhone || !city || !items || items.length === 0) {
            return c.json({ error: "Missing required fields" }, 400);
        }

        const itemsJson = JSON.stringify(items);

        await c.env.DB.prepare(`
            INSERT INTO Orders (
                id, customerName, customerPhone, customerEmail, 
                addressDetail, city, district, ward, note,
                totalAmount, paymentMethod, items, status, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
        `).bind(
            id, customerName, customerPhone, customerEmail || '',
            addressDetail || '', city, district, ward, note || '',
            totalAmount, paymentMethod, itemsJson, createdAt
        ).run();

        return c.json({ success: true, orderId: id }, 201);
    } catch (e: any) {
        console.error("Create Order Error:", e);
        return c.json({ error: e.message }, 500);
    }
});

// GET /api/orders - List orders (for Admin)
app.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare("SELECT * FROM Orders ORDER BY createdAt DESC").all();
        
        // Parse items JSON for frontend usage
        const orders = results.map((order: any) => ({
            ...order,
            items: order.items ? JSON.parse(order.items) : []
        }));

        return c.json(orders);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// PUT /api/orders/:id/status - Update single order status
app.put('/:id/status', async (c) => {
    const id = c.req.param('id');
    try {
        const { status } = await c.req.json();
        await c.env.DB.prepare("UPDATE Orders SET status = ? WHERE id = ?").bind(status, id).run();
        return c.json({ success: true, id, status });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// PUT /api/orders/bulk-status - Update multiple orders status
app.put('/bulk-status', async (c) => {
    try {
        const { ids, status } = await c.req.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
            return c.json({ error: "Invalid data" }, 400);
        }

        // Construct dynamic SQL for IN clause
        const placeholders = ids.map(() => '?').join(',');
        const query = `UPDATE Orders SET status = ? WHERE id IN (${placeholders})`;
        
        // Spread ids into bind parameters
        await c.env.DB.prepare(query).bind(status, ...ids).run();

        return c.json({ success: true, count: ids.length, status });
    } catch (e: any) {
        console.error("Bulk Update Error:", e);
        return c.json({ error: e.message }, 500);
    }
});

export default app;

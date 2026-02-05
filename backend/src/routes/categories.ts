
import { Hono } from 'hono';
import { Bindings, D1Result } from '../bindings';

const app = new Hono<{ Bindings: Bindings }>();

interface CategoryRow {
    id: string;
    name: string;
    slug: string;
    description: string;
    isVisible: number; // SQLite uses 0 or 1
}

// GET /api/categories
app.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare("SELECT * FROM Categories ORDER BY name ASC").all() as D1Result<CategoryRow>;
        
        // Convert to boolean for frontend
        const categories = results.map(row => ({
            ...row,
            isVisible: row.isVisible === 1
        }));

        return c.json(categories);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// POST /api/categories
app.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const id = crypto.randomUUID();
        const name = body.name;
        // Simple slug generation
        const slug = body.slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const description = body.description || '';
        const isVisible = body.isVisible === false ? 0 : 1; // Default to 1 (True)

        if (!name) return c.json({ error: "Name is required" }, 400);

        await c.env.DB.prepare("INSERT INTO Categories (id, name, slug, description, isVisible) VALUES (?, ?, ?, ?, ?)")
            .bind(id, name, slug, description, isVisible)
            .run();

        return c.json({ id, name, slug, description, isVisible: isVisible === 1 }, 201);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// PUT /api/categories/:id
app.put('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const body = await c.req.json();
        const existing = await c.env.DB.prepare("SELECT * FROM Categories WHERE id = ?").bind(id).first() as CategoryRow | null;
        
        if (!existing) return c.json({ error: "Category not found" }, 404);

        const name = body.name !== undefined ? body.name : existing.name;
        const slug = body.slug !== undefined ? body.slug : existing.slug;
        const description = body.description !== undefined ? body.description : existing.description;
        
        let isVisible = existing.isVisible;
        if (body.isVisible !== undefined) {
            isVisible = body.isVisible === true ? 1 : 0;
        }

        await c.env.DB.prepare("UPDATE Categories SET name = ?, slug = ?, description = ?, isVisible = ? WHERE id = ?")
            .bind(name, slug, description, isVisible, id)
            .run();

        return c.json({ id, name, slug, description, isVisible: isVisible === 1 });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// DELETE /api/categories/:id
app.delete('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        await c.env.DB.prepare("DELETE FROM Categories WHERE id = ?").bind(id).run();
        return c.json({ success: true, id });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

export default app;

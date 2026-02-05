
import { Hono } from 'hono';
import { Bindings, D1Result } from '../bindings';

const app = new Hono<{ Bindings: Bindings }>();

// GET /api/locations/provinces
app.get('/provinces', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            "SELECT code, name, name_with_type FROM Provinces ORDER BY code ASC"
        ).all();
        return c.json(results);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// GET /api/locations/districts/:province_code
app.get('/districts/:province_code', async (c) => {
    const pCode = c.req.param('province_code');
    try {
        const { results } = await c.env.DB.prepare(
            "SELECT code, name, name_with_type FROM Districts WHERE parent_code = ? ORDER BY code ASC"
        ).bind(pCode).all();
        return c.json(results);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// GET /api/locations/wards/:district_code
app.get('/wards/:district_code', async (c) => {
    const dCode = c.req.param('district_code');
    try {
        const { results } = await c.env.DB.prepare(
            "SELECT code, name, name_with_type FROM Wards WHERE parent_code = ? ORDER BY code ASC"
        ).bind(dCode).all();
        return c.json(results);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// POST /api/locations/import
// Use this to upload your 'tree.json' content into the DB
app.post('/import', async (c) => {
    try {
        const body = await c.req.json();
        const provincesObj = body; 

        if (!provincesObj || Object.keys(provincesObj).length === 0) {
            return c.json({ error: "Invalid JSON or empty" }, 400);
        }

        let provinceCount = 0;
        let districtCount = 0;
        let wardCount = 0;

        const provinces = Object.values(provincesObj) as any[];

        for (const p of provinces) {
            // 1. Insert Province
            await c.env.DB.prepare(`
                INSERT INTO Provinces (code, name, name_with_type, slug) 
                VALUES (?, ?, ?, ?) 
                ON CONFLICT(code) DO UPDATE SET name=excluded.name, name_with_type=excluded.name_with_type
            `).bind(p.code, p.name, p.name_with_type, p.slug).run();
            provinceCount++;

            // CHECK BOTH 'districts' AND 'quan-huyen' KEYS
            const districtsObj = p.districts || p['quan-huyen'];

            if (districtsObj) {
                const districts = Object.values(districtsObj) as any[];
                for (const d of districts) {
                    // 2. Insert District
                    await c.env.DB.prepare(`
                        INSERT INTO Districts (code, parent_code, name, name_with_type, slug, path_with_type) 
                        VALUES (?, ?, ?, ?, ?, ?)
                        ON CONFLICT(code) DO UPDATE SET name=excluded.name
                    `).bind(d.code, p.code, d.name, d.name_with_type, d.slug, d.path_with_type).run();
                    districtCount++;

                    // CHECK BOTH 'wards' AND 'xa-phuong' KEYS
                    const wardsObj = d.wards || d['xa-phuong'];

                    if (wardsObj) {
                        const wards = Object.values(wardsObj) as any[];
                        
                        // Batch insert wards for this district
                        if (wards.length > 0) {
                            const stmts = wards.map(w => 
                                c.env.DB.prepare(`
                                    INSERT INTO Wards (code, parent_code, name, name_with_type, slug, path_with_type) 
                                    VALUES (?, ?, ?, ?, ?, ?)
                                    ON CONFLICT(code) DO NOTHING
                                `).bind(w.code, d.code, w.name, w.name_with_type, w.slug, w.path_with_type)
                            );
                            
                            await c.env.DB.batch(stmts);
                            wardCount += wards.length;
                        }
                    }
                }
            }
        }

        return c.json({ 
            success: true, 
            imported: {
                provinces: provinceCount,
                districts: districtCount,
                wards: wardCount
            }
        });

    } catch (e: any) {
        console.error("Import Error:", e);
        return c.json({ error: e.message }, 500);
    }
});

export default app;

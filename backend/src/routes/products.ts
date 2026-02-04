
import { Hono } from 'hono';
import { Bindings, D1Result } from '../bindings';

const app = new Hono<{ Bindings: Bindings }>();

// --- Types mapping to SQL Table Columns ---
interface ProductRow {
    id: string;
    slug: string;
    name: string;
    sku: string;
    price: number;
    originalPrice: number | null;
    category: string;
    images: string; // JSON String
    colors: string; // JSON String
    description: string;
    isVisible: number; // SQLite 0 or 1
}

interface ReviewRow {
    id: string;
    productId: string;
    stars: number;
    content: string;
    authorName: string;
    createdAt: string;
}

// Helper to format Product Row (parse JSON fields)
const formatProduct = (row: ProductRow) => ({
    ...row,
    images: JSON.parse(row.images),
    colors: JSON.parse(row.colors),
    isVisible: row.isVisible === 1 // Convert Integer to Boolean
});

// GET /api/products (List all products with Pagination & Structured Response)
app.get('/', async (c) => {
    try {
        const page = parseInt(c.req.query('page') || '1');
        const pageSize = parseInt(c.req.query('pageSize') || '12');
        const offset = (page - 1) * pageSize;

        // 1. Get Total Count
        const totalResult = await c.env.DB.prepare("SELECT COUNT(*) as count FROM Products").first() as { count: number };
        const total = totalResult?.count || 0;

        // 2. Get Paginated Results
        const { results } = await c.env.DB.prepare("SELECT * FROM Products ORDER BY name LIMIT ? OFFSET ?")
            .bind(pageSize, offset)
            .all() as D1Result<ProductRow>;

        // 3. Format Response
        const items = results.map(row => {
            const parsedImages = JSON.parse(row.images);
            const parsedColors = JSON.parse(row.colors);
            return {
                id: row.id,
                slug: row.slug,
                name: row.name,
                sku: row.sku,
                // Include standard fields needed for frontend logic
                category: row.category,
                description: row.description,
                colors: parsedColors,
                images: parsedImages,
                isVisible: row.isVisible === 1,
                
                // Structured Pricing
                pricing: {
                    price: row.price,
                    compareAtPrice: row.originalPrice,
                    currency: "VND"
                },
                
                thumbnailUrl: parsedImages.length > 0 ? parsedImages[0] : "",
                rating: { avg: 0, count: 0 } // Default or implement aggregation
            };
        });

        return c.json({
            items,
            page,
            pageSize,
            total
        });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// GET /api/products/:id
app.get('/:id', async (c) => {
    const id = c.req.param('id');
    const includeReviews = c.req.query('includeReviews') === 'true';

    // 1. Fetch Product
    const productRow = await c.env.DB.prepare("SELECT * FROM Products WHERE id = ? OR slug = ?").bind(id, id).first() as ProductRow | null;

    if (!productRow) {
        return c.json({
            error: {
                code: "PRODUCT_NOT_FOUND",
                message: "Product not found",
                details: { id }
            }
        }, 404);
    }

    const dbProduct = formatProduct(productRow);

    // 2. Fetch Reviews (needed for rating summary)
    const { results: reviews } = await c.env.DB.prepare("SELECT * FROM Reviews WHERE productId = ?").bind(dbProduct.id).all() as D1Result<ReviewRow>;
    
    const avgRating = reviews.length > 0 
        ? reviews.reduce((acc, curr) => acc + curr.stars, 0) / reviews.length 
        : 0;

    // 3. Fetch Recommendations (Simple random or same category)
    const { results: recommendationsRaw } = await c.env.DB.prepare("SELECT * FROM Products WHERE id != ? LIMIT 4").bind(dbProduct.id).all() as D1Result<ProductRow>;
    const recommendations = recommendationsRaw.map(formatProduct).map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        thumbnailUrl: p.images[0],
        pricing: { currency: "VND", price: p.price, compareAtPrice: p.originalPrice },
        rating: { avg: 4.5, count: 10 } // Mock rating for recs
    }));

    // 4. Construct Complex Response (Spec Compliant)
    const response = {
        product: {
            id: dbProduct.id,
            slug: dbProduct.slug,
            name: dbProduct.name,
            sku: dbProduct.sku,
            isVisible: dbProduct.isVisible,
            brand: "MAVO",
            categoryPath: ["Quần áo", dbProduct.category],
            
            pricing: {
                currency: "VND",
                price: dbProduct.price,
                compareAtPrice: dbProduct.originalPrice || null,
                discountPercent: dbProduct.originalPrice 
                    ? Math.round(((dbProduct.originalPrice - dbProduct.price) / dbProduct.originalPrice) * 100)
                    : null
            },

            rating: {
                avg: parseFloat(avgRating.toFixed(1)),
                count: reviews.length
            },

            media: {
                gallery: dbProduct.images.map((img: string, idx: number) => ({
                    id: `img_${idx}`,
                    url: img,
                    thumbUrl: img,
                    alt: `${dbProduct.name} view ${idx + 1}`,
                    order: idx + 1
                })),
                primaryImageId: "img_0"
            },

            options: {
                colors: dbProduct.colors.map((c: string, idx: number) => ({ 
                    id: `c_${idx}`, name: c, swatchHex: c 
                })),
                sizes: ["S", "M", "L"]
            },

            // Mocking Variants logic based on generic options
            variants: ["S", "M", "L"].map(size => ({
                id: `${dbProduct.id}_${size}`,
                size: size,
                priceOverride: null,
                stock: { status: "in_stock", qty: 10 }
            })),

            defaultSelection: {
                size: "M",
                qty: 1
            },

            policiesPreview: {
                shippingText: "Giao hoả tốc toàn quốc đồng giá ship 30.000đ",
                supportHours: "08:30 - 17:00",
                hotline: "1800 6525",
                returnText: "Đổi hàng 15 ngày, hoàn tiền 5 ngày",
                deliveryNotes: [
                    "Nội thành Hà Nội nhận hàng trong 1-2 ngày",
                    "Khu vực tỉnh thành nhận hàng từ 3-5 ngày"
                ]
            }
        },

        breadcrumbs: [
            { label: "HOME", href: "/" },
            { label: "Quần áo", href: "#" },
            { label: dbProduct.category, href: "#" },
            { label: dbProduct.name, href: "#" }
        ],

        tabs: {
            productInfo: {
                highlightsTitle: "THÔNG TIN SẢN PHẨM",
                attributes: [
                    { label: "Sản phẩm", value: dbProduct.name },
                    { label: "Chất vải", value: "Vải dệt thoi" },
                    { label: "Dòng sản phẩm", value: "FEMALE" }
                ],
                description: dbProduct.description,
                sizeGuide: {
                    imageUrl: "https://product.hstatic.net/200000182297/product/bang-size-nu_c9205164d96a461b97b0a3c20c085026_master.jpg",
                    alt: "Bảng thông số áo",
                    unit: "cm"
                }
            },
            careGuide: {
                title: "HƯỚNG DẪN BẢO QUẢN",
                content: [
                    "Giặt tay hoặc giặt máy chế độ nhẹ",
                    "Không dùng chất tẩy mạnh",
                    "Phơi nơi thoáng mát"
                ]
            },
            returnPolicy: {
                title: "CHÍNH SÁCH ĐỔI HÀNG",
                content: [
                    "Đổi hàng trong 15 ngày",
                    "Hoàn tiền trong 5 ngày làm việc",
                    "Sản phẩm phải còn tem/mác"
                ]
            }
        },

        reviewsSummary: {
            avg: parseFloat(avgRating.toFixed(1)),
            count: reviews.length,
            breakdown: [5,4,3,2,1].map(star => ({
                stars: star,
                count: reviews.filter(r => r.stars === star).length
            }))
        },

        recommendations: recommendations,
        
        reviews: includeReviews ? {
            items: reviews.slice(0, 5),
            page: 1,
            pageSize: 5,
            total: reviews.length
        } : null
    };

    return c.json(response);
});

// POST /api/products (Create new product)
app.post('/', async (c) => {
    try {
        const body = await c.req.json();
        
        // Generate a simple ID
        const id = crypto.randomUUID();
        
        // Default values
        const name = body.name || 'New Product';
        const slug = body.slug || `product-${Date.now()}`;
        const sku = body.sku || `SKU-${Date.now()}`;
        const price = body.price || 0;
        const originalPrice = body.originalPrice || null;
        const category = body.category || 'Uncategorized';
        const description = body.description || '';
        const isVisible = body.isVisible === false ? 0 : 1; // Default true
        
        // Ensure arrays are stringified for SQLite
        const images = JSON.stringify(body.images || []);
        const colors = JSON.stringify(body.colors || []);

        await c.env.DB.prepare(`
            INSERT INTO Products (id, slug, name, sku, price, originalPrice, category, images, colors, description, isVisible)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(id, slug, name, sku, price, originalPrice, category, images, colors, description, isVisible).run();

        const newProduct = await c.env.DB.prepare("SELECT * FROM Products WHERE id = ?").bind(id).first() as ProductRow;
        return c.json(formatProduct(newProduct), 201);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// PUT /api/products/:id (Update product)
app.put('/:id', async (c) => {
    const id = c.req.param('id');
    const updates = await c.req.json();

    // 1. Fetch existing
    const existing = await c.env.DB.prepare("SELECT * FROM Products WHERE id = ?").bind(id).first() as ProductRow | null;
    if (!existing) return c.json({ error: "Product not found" }, 404);

    // 2. Prepare update query dynamically
    const name = updates.name !== undefined ? updates.name : existing.name;
    const price = updates.price !== undefined ? updates.price : existing.price;
    const originalPrice = updates.originalPrice !== undefined ? updates.originalPrice : existing.originalPrice;
    const description = updates.description !== undefined ? updates.description : existing.description;
    const sku = updates.sku !== undefined ? updates.sku : existing.sku;
    
    // Convert boolean to 0/1 for SQLite
    let isVisible = existing.isVisible;
    if (updates.isVisible !== undefined) {
        isVisible = updates.isVisible === true ? 1 : 0;
    }
    
    // Handle JSON arrays update
    let images = existing.images;
    if (updates.images !== undefined) {
        images = JSON.stringify(updates.images);
    }
    
    let colors = existing.colors;
    if (updates.colors !== undefined) {
        colors = JSON.stringify(updates.colors);
    }

    await c.env.DB.prepare(`
        UPDATE Products 
        SET name = ?, price = ?, originalPrice = ?, description = ?, sku = ?, images = ?, colors = ?, isVisible = ?
        WHERE id = ?
    `).bind(name, price, originalPrice, description, sku, images, colors, isVisible, id).run();

    // 3. Return updated object (Simple format for internal/admin use)
    const updated = await c.env.DB.prepare("SELECT * FROM Products WHERE id = ?").bind(id).first() as ProductRow | null;
    return c.json(formatProduct(updated!));
});

// GET /api/products/:id/reviews
app.get('/:id/reviews', async (c) => {
    const id = c.req.param('id');
    const page = parseInt(c.req.query('page') || '1');
    const pageSize = parseInt(c.req.query('pageSize') || '10');
    const offset = (page - 1) * pageSize;

    // Get Total
    const totalResult = await c.env.DB.prepare("SELECT COUNT(*) as count FROM Reviews WHERE productId = ?").bind(id).first() as {count: number} | null;
    const total = totalResult?.count || 0;

    // Get Items
    const { results } = await c.env.DB.prepare("SELECT * FROM Reviews WHERE productId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?")
        .bind(id, pageSize, offset)
        .all() as D1Result<ReviewRow>;

    return c.json({
        items: results,
        page,
        pageSize,
        total
    });
});

// POST /api/products/:id/reviews
app.post('/:id/reviews', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { stars, content, authorName } = body;

    if (!stars || stars < 1 || stars > 5) {
        return c.json({ error: { message: "Stars must be between 1 and 5" } }, 400);
    }

    const reviewId = `r_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const finalAuthor = authorName || "Khách hàng";

    await c.env.DB.prepare(`
        INSERT INTO Reviews (id, productId, stars, content, authorName, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
    `).bind(reviewId, id, stars, content, finalAuthor, createdAt).run();

    return c.json({
        id: reviewId,
        productId: id,
        stars,
        content,
        authorName: finalAuthor,
        createdAt
    }, 201);
});

export default app;

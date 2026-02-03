import { Router } from 'express';
import { PRODUCTS_DB, REVIEWS } from '../data/mockStore';

const router = Router();

// --- Helper Types for API Spec ---
interface ProductResponse {
    product: any;
    breadcrumbs: any[];
    tabs: any;
    reviewsSummary: any;
    recommendations: any[];
    reviews: any | null;
}

// GET /api/products (List all products for Admin)
router.get('/', (req, res) => {
    // In a real app, implement pagination here
    res.json(PRODUCTS_DB);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const includeReviews = req.query.includeReviews === 'true';

    // Find product (mock logic: search by ID or Slug)
    const dbProduct = PRODUCTS_DB.find(p => p.id === id || p.slug === id);

    if (!dbProduct) {
        return res.status(404).json({
            error: {
                code: "PRODUCT_NOT_FOUND",
                message: "Product not found",
                details: { id }
            }
        });
    }

    // Filter reviews for summary
    const productReviews = REVIEWS.filter(r => r.productId === dbProduct.id);
    const avgRating = productReviews.length > 0 
        ? productReviews.reduce((acc, curr) => acc + curr.stars, 0) / productReviews.length 
        : 0;

    // Construct Response according to SPEC
    const response: ProductResponse = {
        product: {
            id: dbProduct.id,
            slug: dbProduct.slug,
            name: dbProduct.name,
            sku: dbProduct.sku,
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
                count: productReviews.length
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
                colors: [
                    { id: "c_brown", name: "Màu Nâu", swatchHex: "#8B4513" }
                ],
                sizes: ["S", "M", "L"]
            },

            variants: [
                {
                    id: `${dbProduct.id}_S`,
                    colorId: "c_brown",
                    size: "S",
                    sku: `${dbProduct.sku}-S`,
                    priceOverride: null,
                    stock: { status: "in_stock", qty: 10 }
                },
                {
                    id: `${dbProduct.id}_M`,
                    colorId: "c_brown",
                    size: "M",
                    sku: `${dbProduct.sku}-M`,
                    priceOverride: null,
                    stock: { status: "in_stock", qty: 5 }
                }
            ],

            defaultSelection: {
                colorId: "c_brown",
                size: "M",
                qty: 1
            },

            purchaseLimits: {
                minQty: 1,
                maxQty: 5
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
            count: productReviews.length,
            breakdown: [5,4,3,2,1].map(star => ({
                stars: star,
                count: productReviews.filter(r => r.stars === star).length
            }))
        },

        recommendations: PRODUCTS_DB
            .filter(p => p.id !== dbProduct.id)
            .slice(0, 4)
            .map(p => ({
                id: p.id,
                slug: p.slug,
                name: p.name,
                thumbnailUrl: p.images[0],
                pricing: { currency: "VND", price: p.price, compareAtPrice: p.originalPrice },
                rating: { avg: 4.5, count: 10 } // Mock
            })),
        
        reviews: null
    };

    if (includeReviews) {
        response.reviews = {
            items: productReviews.slice(0, 5),
            page: 1,
            pageSize: 5,
            total: productReviews.length
        };
    }

    res.json(response);
});

// PUT /api/products/:id (Update product)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const index = PRODUCTS_DB.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Product not found" });
    }

    // Update the product in memory
    PRODUCTS_DB[index] = {
        ...PRODUCTS_DB[index],
        ...updates
    };

    res.json(PRODUCTS_DB[index]);
});

// GET /api/products/:id/reviews
router.get('/:id/reviews', (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const productReviews = REVIEWS.filter(r => r.productId === id);
    const total = productReviews.length;
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = productReviews.slice(startIndex, endIndex);

    res.json({
        items,
        page,
        pageSize,
        total
    });
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', (req, res) => {
    const { id } = req.params;
    const { stars, content, authorName } = req.body;

    // Basic Validation
    if (!stars || stars < 1 || stars > 5) {
        return res.status(400).json({ error: { message: "Stars must be between 1 and 5" } });
    }
    if (!content || content.length < 10) {
        return res.status(400).json({ error: { message: "Content must be at least 10 characters" } });
    }

    const newReview = {
        id: `r_${Date.now()}`,
        productId: id,
        stars,
        content,
        authorName: authorName || "Khách hàng",
        createdAt: new Date().toISOString()
    };

    REVIEWS.unshift(newReview); // Add to beginning

    res.status(201).json(newReview);
});

export default router;
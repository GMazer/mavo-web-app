// Simple in-memory store for demonstration
// In a real app, this would be a database (MongoDB/Postgres)

export const REVIEWS = [
  {
    id: "r_001",
    productId: "1",
    stars: 5,
    content: "Sản phẩm đẹp, vải dày dặn, đúng mô tả.",
    authorName: "Nguyễn Văn A",
    createdAt: "2024-02-03T10:00:00Z"
  },
  {
    id: "r_002",
    productId: "1",
    stars: 4,
    content: "Giao hàng hơi chậm nhưng áo đẹp.",
    authorName: "Trần Thị B",
    createdAt: "2024-02-04T14:30:00Z"
  }
];

// Base product data similar to frontend, but we will enrich it in the controller/service to match API Spec
export const PRODUCTS_DB = [
  {
    id: "1",
    slug: "brown-long-sleeves-woven-vest",
    name: "Brown Long Sleeves Woven Vest",
    sku: "D82510002T6CB0261",
    price: 999000,
    originalPrice: 2399000,
    images: [
        'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550614000-4b9519e02c97?q=80&w=800&auto=format&fit=crop',
    ],
    category: "Áo",
    description: "Vest dệt kim tay dài màu nâu sang trọng."
  },
  {
    id: "2",
    slug: "brown-woven-mini-skirt",
    name: "Brown Woven Mini Skirt",
    sku: "S99210002T6CB0261",
    price: 599000,
    originalPrice: 1399000,
    images: [
        'https://images.unsplash.com/photo-1582142407894-ec85f1260a46?q=80&w=800&auto=format&fit=crop'
    ],
    category: "Chân váy",
    description: "Chân váy ngắn dệt kim đồng bộ."
  }
];

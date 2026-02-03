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
    id: '1',
    slug: 'brown-long-sleeves-woven-vest',
    name: 'Brown Long Sleeves Woven Vest',
    sku: 'D82510002T6CB0261',
    price: 999000,
    originalPrice: 2399000,
    category: 'Set',
    images: [
        'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550614000-4b9519e02c97?q=80&w=800&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['#8B4513'],
    description: 'Vest dệt kim tay dài màu nâu sang trọng.'
  },
  {
    id: '2',
    slug: 'brown-woven-mini-skirt',
    name: 'Brown Woven Mini Skirt',
    sku: 'S99210002T6CB0261',
    price: 599000,
    originalPrice: 1399000,
    category: 'Chân váy',
    images: [
        'https://images.unsplash.com/photo-1582142407894-ec85f1260a46?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['#8B4513'],
    description: 'Chân váy ngắn dệt kim đồng bộ.'
  },
  {
    id: '3',
    slug: 'white-mavo-embroidered-raw-shirt',
    name: 'White Mavo Embroidered Raw Shirt',
    sku: 'A12310002T6CB0261',
    price: 599500,
    originalPrice: 1199000,
    category: 'Áo',
    images: [
         'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['#FFFFFF'],
    description: 'Áo sơ mi trắng thêu họa tiết.'
  },
  {
    id: '4',
    slug: 'gray-woven-blouse',
    name: 'Gray Woven Blouse',
    sku: 'A45610002T6CB0261',
    price: 649500,
    originalPrice: 1299000,
    category: 'Áo',
    images: ['https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=800&auto=format&fit=crop'],
    colors: ['#696969'],
    description: 'Áo kiểu màu xám thanh lịch.'
  },
  {
    id: '5',
    slug: 'black-classic-blazer',
    name: 'Black Classic Blazer',
    sku: 'K78910002T6CB0261',
    price: 1250000,
    originalPrice: 2500000,
    category: 'Áo khoác',
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop'],
    colors: ['#000000'],
    description: 'Áo khoác blazer đen cổ điển.'
  },
  {
    id: '6',
    slug: 'beige-pleated-skirt',
    name: 'Beige Pleated Skirt',
    sku: 'S11110002T6CB0261',
    price: 450000,
    originalPrice: 890000,
    category: 'Chân váy',
    images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop'],
    colors: ['#F5F5DC'],
    description: 'Chân váy xếp ly màu be.'
  },
  {
    id: '7',
    slug: 'navy-blue-jumpsuit',
    name: 'Navy Blue Jumpsuit',
    sku: 'J22210002T6CB0261',
    price: 899000,
    originalPrice: 1599000,
    category: 'Jumpsuits',
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop'],
    colors: ['#000080'],
    description: 'Jumpsuit xanh navy thời thượng.'
  },
  {
    id: '8',
    slug: 'silk-evening-dress',
    name: 'Silk Evening Dress',
    sku: 'D33310002T6CB0261',
    price: 2100000,
    originalPrice: null,
    category: 'Váy đầm',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop'],
    colors: ['#800000'],
    description: 'Váy lụa dự tiệc sang trọng.'
  }
];
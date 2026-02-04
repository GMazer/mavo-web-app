
export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[]; // Array of additional images for gallery
  code?: string;     // Product code (e.g., D825...)
  colors?: ProductColor[]; // Updated to object array
  description?: string; // Content for Product Info Tab
  highlights?: string; // Content for Highlights Section
  material?: string;
  gender?: string;
  customSizeGuide?: string | null; // Optional override for size guide
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface AppSettings {
  hotline: string;
  email: string;
  zalo: string;
  sizeGuideDefault: string;
  careGuideDefault: string;
  returnPolicyDefault: string; // New field
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

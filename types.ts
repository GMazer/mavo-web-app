export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[]; // Array of additional images for gallery
  code?: string;     // Product code (e.g., D825...)
  colors?: string[];
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}
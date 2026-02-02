export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  colors?: string[];
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}


export interface ProductColor {
    name: string;
    hex: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    highlights?: string;
    material?: string;
    gender?: string;
    price: number;
    originalPrice?: number;
    sku?: string;
    category?: string;
    images: string[];
    colors?: ProductColor[];
    thumbnailUrl?: string;
    isVisible?: boolean; 
    customSizeGuide?: string | null; 
}

export interface AppSettings {
    hotline: string;
    email: string;
    zalo: string;
    sizeGuideDefault: string;
    careGuideDefault: string;
    returnPolicyDefault: string; 
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface DragState {
    from: number | null;
    over: number | null;
}

// --- ORDER TYPES ---
export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
}

export interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    addressDetail: string;
    city: string;
    district: string;
    ward: string;
    note: string;
    totalAmount: number;
    paymentMethod: string;
    status: string; // 'pending' | 'processing' | 'completed' | 'cancelled'
    createdAt: string;
    items: OrderItem[];
}


export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    sku?: string;
    category?: string;
    images: string[];
    colors?: string[];
    thumbnailUrl?: string;
    isVisible?: boolean; 
    customSizeGuide?: string | null; // New field for specific size guide
}

export interface AppSettings {
    hotline: string;
    email: string;
    zalo: string;
    sizeGuideDefault: string;
    careGuideDefault: string;
}

export interface DragState {
    from: number | null;
    over: number | null;
}

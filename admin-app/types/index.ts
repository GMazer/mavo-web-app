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
}

export interface DragState {
    from: number | null;
    over: number | null;
}

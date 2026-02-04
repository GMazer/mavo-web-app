import { Product } from "../types";
import { compressImage } from "../utils/helpers";

const PROD_API_URL = 'https://mavo-fashion-api.mavo-web.workers.dev'; 
const API_BASE = PROD_API_URL;
const API_URL = `${API_BASE}/api/products`;
const UPLOAD_URL = `${API_BASE}/api/uploads/presign`;

export const fetchProductsApi = async (): Promise<Product[]> => {
    const res = await fetch(`${API_URL}?_t=${Date.now()}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    
    const items = Array.isArray(data) ? data : (data.items || []);

    // Normalize Data
    return items.map((item: any) => ({
        ...item,
        price: item.pricing?.price ?? item.price ?? 0,
        originalPrice: item.pricing?.compareAtPrice ?? item.originalPrice,
        images: item.images || (item.image ? [item.image] : [])
    }));
};

export const saveProductApi = async (product: Product): Promise<Product> => {
    const isNew = !product.id;
    const url = isNew ? API_URL : `${API_URL}/${product.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    
    if (!res.ok) throw new Error("Failed to save product");
    const saved = await res.json();
    return {
        ...saved,
        images: saved.images || []
    };
};

export const uploadImagesApi = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    await Promise.all(files.map(async (originalFile) => {
        const compressedFile = await compressImage(originalFile);

        // 1. Get Presigned URL
        const presignRes = await fetch(UPLOAD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filename: compressedFile.name,
                contentType: compressedFile.type
            })
        });

        if (!presignRes.ok) throw new Error(`Failed to get URL for ${originalFile.name}`);
        const { uploadUrl, publicUrl } = await presignRes.json();

        // 2. Upload to R2
        const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': compressedFile.type },
            body: compressedFile
        });

        if (!uploadRes.ok) throw new Error(`Failed to upload ${originalFile.name}`);
        uploadedUrls.push(publicUrl);
    }));

    return uploadedUrls;
};

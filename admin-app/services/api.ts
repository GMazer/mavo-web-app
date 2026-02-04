
import { Product, AppSettings, Category } from "../types";
import { compressImage } from "../utils/helpers";

const PROD_API_URL = 'https://mavo-fashion-api.mavo-web.workers.dev'; 
const API_BASE = PROD_API_URL;
const API_URL = `${API_BASE}/api/products`;
const SETTINGS_URL = `${API_BASE}/api/settings`;
const CATEGORIES_URL = `${API_BASE}/api/categories`;
const UPLOAD_URL = `${API_BASE}/api/uploads/presign`;

// --- Products ---

export const fetchProductsApi = async (): Promise<Product[]> => {
    const res = await fetch(`${API_URL}?_t=${Date.now()}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || "Failed to fetch products");
    }
    const data = await res.json();
    
    const items = Array.isArray(data) ? data : (data.items || []);

    // Normalize Data
    return items.map((item: any) => ({
        ...item,
        price: item.pricing?.price ?? item.price ?? 0,
        originalPrice: item.pricing?.compareAtPrice ?? item.originalPrice,
        images: item.images || (item.image ? [item.image] : []),
        isVisible: item.isVisible !== undefined ? item.isVisible : true
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
    
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Save Product API Error:", errData);
        throw new Error(errData.error || errData.message || "Failed to save product");
    }

    const saved = await res.json();
    return {
        ...saved,
        images: saved.images || []
    };
};

export const deleteProductApi = async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete product");
    }
};

// --- Categories ---

export const fetchCategoriesApi = async (): Promise<Category[]> => {
    const res = await fetch(`${CATEGORIES_URL}?_t=${Date.now()}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch categories");
    }
    return await res.json();
};

export const saveCategoryApi = async (category: Category): Promise<Category> => {
    const isNew = !category.id;
    const url = isNew ? CATEGORIES_URL : `${CATEGORIES_URL}/${category.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save category");
    }
    return await res.json();
};

export const deleteCategoryApi = async (id: string): Promise<void> => {
    const res = await fetch(`${CATEGORIES_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error("Failed to delete category");
};


// --- Settings ---

export const fetchSettingsApi = async (): Promise<AppSettings> => {
    const res = await fetch(`${SETTINGS_URL}?_t=${Date.now()}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || "Failed to fetch settings");
    }
    return await res.json();
};

export const saveSettingsApi = async (settings: Partial<AppSettings>): Promise<void> => {
    const res = await fetch(SETTINGS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Save Settings API Error:", err);
        throw new Error(err.error || err.message || "Failed to save settings");
    }
};

// --- Uploads ---

export const uploadImagesApi = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    await Promise.all(files.map(async (originalFile) => {
        const compressedFile = await compressImage(originalFile);

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

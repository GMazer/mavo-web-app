export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const reorderList = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = (e) => reject(e);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }

            // Resize Logic
            const MAX_DIMENSION = 2048; 
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_DIMENSION) {
                    height *= MAX_DIMENSION / width;
                    width = MAX_DIMENSION;
                }
            } else {
                if (height > MAX_DIMENSION) {
                    width *= MAX_DIMENSION / height;
                    height = MAX_DIMENSION;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Compression Logic
            const MAX_SIZE_BYTES = 1.0 * 1024 * 1024; // 1.0 MB
            const MIN_QUALITY = 0.5;
            let currentQuality = 1.0;

            const attemptCompression = (q: number) => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Compression failed'));
                            return;
                        }
                        
                        if (blob.size <= MAX_SIZE_BYTES || q <= MIN_QUALITY) {
                            const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                            const newFile = new File([blob], newName, {
                                type: 'image/webp',
                                lastModified: Date.now(),
                            });
                            console.log(`Compressed: ${(file.size/1024/1024).toFixed(2)}MB -> ${(newFile.size/1024).toFixed(2)}KB (Q: ${q.toFixed(2)})`);
                            resolve(newFile);
                        } else {
                            attemptCompression(q - 0.05); 
                        }
                    },
                    'image/webp',
                    q
                );
            };

            attemptCompression(currentQuality);
        };

        reader.readAsDataURL(file);
    });
};


import React, { useState, useEffect } from 'react';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    // Auto-slide effect
    useEffect(() => {
        if (images.length <= 1 || isHovering) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length, isHovering]);

    // Reset when images change
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [images]);

    return (
        <div className="w-full lg:w-3/5 flex gap-4">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`cursor-pointer border transition-all duration-300 ${currentImageIndex === idx ? 'border-black opacity-100' : 'border-transparent hover:border-gray-300 opacity-60 hover:opacity-100'}`}
                        onMouseEnter={() => setCurrentImageIndex(idx)}
                        onClick={() => setCurrentImageIndex(idx)}
                    >
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full aspect-[3/4] object-cover" />
                    </div>
                ))}
            </div>

            {/* Main Image */}
            <div
                className="flex-1 relative aspect-[3/4] overflow-hidden bg-gray-100"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`${productName} - View ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;

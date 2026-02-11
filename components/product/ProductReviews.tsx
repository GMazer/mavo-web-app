
import React, { useState, useEffect } from 'react';
import { StarIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import { useToast } from '../../context/ToastContext';
import { Review } from '../../types';

const API_BASE = 'https://mavo-fashion-api.mavo-web.workers.dev/api';

interface ProductReviewsProps {
    productId: string;
    // Notify parent about rating update if needed
    onRatingUpdate?: (avg: number, count: number) => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, onRatingUpdate }) => {
    const toast = useToast();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userRating, setUserRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Fetch Reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${API_BASE}/products/${productId}/reviews?pageSize=20`);
                if (res.ok) {
                    const data = await res.json();
                    const items = data.items || [];
                    setReviews(items);
                    
                    // Calculate stats
                    if (onRatingUpdate) {
                        const avg = items.length > 0 
                            ? (items.reduce((acc: number, r: Review) => acc + r.stars, 0) / items.length)
                            : 0;
                        onRatingUpdate(avg, items.length);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            }
        };
        fetchReviews();
        
        // Reset form when product changes
        setUserRating(0);
        setReviewContent('');
        setReviewerName('');
        setIsAnonymous(false);
    }, [productId]);

    const handleSubmitReview = async () => {
        if (userRating === 0) {
            toast.error("Vui lòng chọn số sao đánh giá!");
            return;
        }
        if (!isAnonymous && !reviewerName.trim()) {
            toast.error("Vui lòng nhập tên của bạn hoặc chọn ẩn danh!");
            return;
        }
        if (!reviewContent.trim()) {
            toast.error("Vui lòng nhập nội dung đánh giá!");
            return;
        }

        setIsSubmittingReview(true);
        try {
            const payload = {
                stars: userRating,
                content: reviewContent,
                authorName: isAnonymous ? "Ẩn danh" : reviewerName
            };

            const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const newReview = await res.json();
                const updatedReviews = [newReview, ...reviews];
                setReviews(updatedReviews);
                toast.success("Cảm ơn bạn đã đánh giá!");
                
                // Update stats in parent
                if (onRatingUpdate) {
                     const avg = updatedReviews.reduce((acc, r) => acc + r.stars, 0) / updatedReviews.length;
                     onRatingUpdate(avg, updatedReviews.length);
                }

                // Reset form
                setUserRating(0);
                setReviewContent('');
                setReviewerName('');
                setIsAnonymous(false);
            } else {
                toast.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi kết nối.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const avgRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.stars, 0) / reviews.length).toFixed(1) 
      : "0";

    return (
        <div className="border border-gray-200 p-6 lg:p-10 bg-white">
            <h3 className="text-sm font-bold uppercase mb-6">ĐÁNH GIÁ SẢN PHẨM</h3>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                
                {/* Summary */}
                <div className="flex flex-col items-center min-w-[150px]">
                    <span className="text-6xl font-light">{avgRating}</span>
                    <div className="flex gap-1 my-2">
                        {[1,2,3,4,5].map(s => (
                            <StarIcon key={s} className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? 'text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="text-gray-400 text-sm">{reviews.length > 0 ? `${reviews.length} đánh giá` : 'Chưa có đánh giá nào'}</span>
                </div>

                {/* Review Form */}
                <div className="flex-1 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Tên hiển thị:</label>
                            <input 
                                type="text" 
                                className={`w-full border border-gray-300 p-2 text-sm focus:outline-none focus:border-black transition-colors ${isAnonymous ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                                placeholder="Nhập tên của bạn"
                                value={reviewerName}
                                onChange={(e) => setReviewerName(e.target.value)}
                                disabled={isAnonymous}
                            />
                        </div>
                        <div className="flex items-center h-full pt-6">
                            <input 
                                type="checkbox" 
                                id="anon" 
                                className="mr-2 cursor-pointer" 
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                            />
                            <label htmlFor="anon" className="text-sm text-gray-500 cursor-pointer select-none">Đánh giá ẩn danh</label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-gray-500 mb-1">Đánh giá của bạn:</label>
                        <div className="flex gap-1">
                             {[1,2,3,4,5].map(s => (
                                <StarIcon 
                                    key={s} 
                                    onClick={() => setUserRating(s)}
                                    className={`w-5 h-5 cursor-pointer transition-colors ${s <= userRating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`} 
                                />
                             ))}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                         <label className="block text-sm text-gray-500 mb-2">Nhận xét của bạn:</label>
                         <textarea 
                            className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors min-h-[100px] bg-white"
                            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                         ></textarea>
                    </div>
                    
                    <button 
                        onClick={handleSubmitReview}
                        disabled={isSubmittingReview}
                        className="bg-[#333] text-white text-xs font-bold uppercase px-6 py-3 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmittingReview ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ'}
                    </button>
                </div>
            </div>

            {/* Review List */}
            {reviews.length > 0 && (
                <div className="mt-12 border-t border-gray-100 pt-8 space-y-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <UserCircleIcon className="w-full h-full" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-gray-900">{review.authorName}</span>
                                    <span className="text-xs text-gray-400">• {new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex gap-0.5 mb-2">
                                    {[1,2,3,4,5].map(s => (
                                        <StarIcon key={s} className={`w-3 h-3 ${s <= review.stars ? 'text-yellow-400' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;

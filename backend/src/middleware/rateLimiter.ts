
import { Context, Next } from 'hono';
import { TokenBucket } from '../utils/TokenBucket';

// Cấu hình:
// Capacity = 20: Cho phép "bùng nổ" tối đa 20 request cùng lúc.
// RefillRate = 2: Hồi phục 2 request mỗi giây (tương đương 120 req/phút trung bình).
const globalLimiter = new TokenBucket(20, 2);

export const rateLimiter = async (c: Context, next: Next) => {
    // Lấy IP người dùng từ Header của Cloudflare hoặc fallback
    const ip = c.req.header('CF-Connecting-IP') || 'unknown-ip';

    // Bỏ qua rate limit cho localhost trong quá trình dev (tùy chọn)
    const isDev = c.req.url.includes('localhost') || c.req.url.includes('127.0.0.1');
    
    // Chỉ áp dụng cho các method thay đổi dữ liệu để chống spam (POST, PUT, DELETE)
    // Hoặc bỏ điều kiện if này để áp dụng cho toàn bộ API
    if (['POST', 'PUT', 'DELETE'].includes(c.req.method) && !isDev) {
        const allowed = globalLimiter.consume(ip);

        if (!allowed) {
            return c.json({
                success: false,
                error: "Too Many Requests",
                message: "Bạn đang gửi yêu cầu quá nhanh. Vui lòng thử lại sau giây lát."
            }, 429);
        }
    }

    await next();
};

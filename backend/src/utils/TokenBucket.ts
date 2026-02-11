
interface BucketState {
    tokens: number;
    lastRefillTime: number;
}

export class TokenBucket {
    private capacity: number;
    private refillRate: number; // tokens per second
    private buckets: Map<string, BucketState>;

    /**
     * @param capacity Số lượng token tối đa mà xô có thể chứa (Burst size)
     * @param refillRate Tốc độ làm đầy (Token mỗi giây)
     */
    constructor(capacity: number, refillRate: number) {
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.buckets = new Map();
    }

    /**
     * Cố gắng lấy 1 token từ bucket của key (IP)
     * @param key Unique identifier (IP address)
     * @returns true nếu cho phép (còn token), false nếu bị chặn
     */
    public consume(key: string, cost: number = 1): boolean {
        const now = Date.now();
        let bucket = this.buckets.get(key);

        if (!bucket) {
            bucket = {
                tokens: this.capacity,
                lastRefillTime: now
            };
            this.buckets.set(key, bucket);
        }

        // 1. Tính toán số token được refill dựa trên thời gian trôi qua
        const timeDelta = (now - bucket.lastRefillTime) / 1000; // Đổi ra giây
        const tokensToAdd = timeDelta * this.refillRate;

        // 2. Cập nhật số token (không vượt quá capacity)
        bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
        bucket.lastRefillTime = now;

        // 3. Kiểm tra xem có đủ token để tiêu thụ không
        if (bucket.tokens >= cost) {
            bucket.tokens -= cost;
            this.buckets.set(key, bucket); // Cập nhật lại state
            return true; // Cho phép request
        }

        return false; // Chặn request
    }

    /**
     * Dọn dẹp các bucket cũ để tránh memory leak (Optional)
     */
    public cleanup(maxAgeSeconds: number = 3600) {
        const now = Date.now();
        for (const [key, bucket] of this.buckets.entries()) {
            if ((now - bucket.lastRefillTime) / 1000 > maxAgeSeconds) {
                this.buckets.delete(key);
            }
        }
    }
}

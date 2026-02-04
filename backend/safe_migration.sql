
-- Chỉ tạo bảng Orders nếu chưa tồn tại
-- KHÔNG DROP các bảng Products, Categories, Settings cũ

CREATE TABLE IF NOT EXISTS Orders (
    id TEXT PRIMARY KEY,
    customerName TEXT,
    customerPhone TEXT,
    customerEmail TEXT,
    addressDetail TEXT,
    city TEXT,
    district TEXT,
    ward TEXT,
    note TEXT,
    totalAmount INTEGER,
    paymentMethod TEXT,
    items TEXT, -- JSON Array of Cart Items
    status TEXT DEFAULT 'pending', -- pending, processing, completed, cancelled
    createdAt TEXT
);

-- Index cho createdAt để query sort nhanh hơn
CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON Orders(createdAt);

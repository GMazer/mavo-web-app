
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    name TEXT NOT NULL,
    sku TEXT,
    price INTEGER,
    originalPrice INTEGER,
    category TEXT,
    images TEXT, -- JSON Array
    colors TEXT, -- JSON Array
    description TEXT,
    isVisible INTEGER DEFAULT 1 -- 1: Show, 0: Hide
);

CREATE TABLE Reviews (
    id TEXT PRIMARY KEY,
    productId TEXT,
    stars INTEGER,
    content TEXT,
    authorName TEXT,
    createdAt TEXT,
    FOREIGN KEY(productId) REFERENCES Products(id)
);

-- SEED DATA (Converted from mockStore.ts)
INSERT INTO Products (id, slug, name, sku, price, originalPrice, category, images, colors, description, isVisible) VALUES 
('1', 'brown-long-sleeves-woven-vest', 'Brown Long Sleeves Woven Vest', 'D82510002T6CB0261', 999000, 2399000, 'Set', 
 '["https://images.unsplash.com/photo-1552874869-5c39ec9288dc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1550614000-4b9519e02c97?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"]', 
 '["#8B4513"]', 
 'Vest dệt kim tay dài màu nâu sang trọng.', 1),

('2', 'brown-woven-mini-skirt', 'Brown Woven Mini Skirt', 'S99210002T6CB0261', 599000, 1399000, 'Chân váy', 
 '["https://images.unsplash.com/photo-1582142407894-ec85f1260a46?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"]', 
 '["#8B4513"]', 
 'Chân váy ngắn dệt kim đồng bộ.', 1),

('3', 'white-mavo-embroidered-raw-shirt', 'White Mavo Embroidered Raw Shirt', 'A12310002T6CB0261', 599500, 1199000, 'Áo', 
 '["https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=800&auto=format&fit=crop"]', 
 '["#FFFFFF"]', 
 'Áo sơ mi trắng thêu họa tiết.', 1),

('4', 'gray-woven-blouse', 'Gray Woven Blouse', 'A45610002T6CB0261', 649500, 1299000, 'Áo', 
 '["https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=800&auto=format&fit=crop"]', 
 '["#696969"]', 
 'Áo kiểu màu xám thanh lịch.', 1),

('5', 'black-classic-blazer', 'Black Classic Blazer', 'K78910002T6CB0261', 1250000, 2500000, 'Áo khoác', 
 '["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop"]', 
 '["#000000"]', 
 'Áo khoác blazer đen cổ điển.', 1),

('6', 'beige-pleated-skirt', 'Beige Pleated Skirt', 'S11110002T6CB0261', 450000, 890000, 'Chân váy', 
 '["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop"]', 
 '["#F5F5DC"]', 
 'Chân váy xếp ly màu be.', 1),

('7', 'navy-blue-jumpsuit', 'Navy Blue Jumpsuit', 'J22210002T6CB0261', 899000, 1599000, 'Jumpsuits', 
 '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"]', 
 '["#000080"]', 
 'Jumpsuit xanh navy thời thượng.', 1),

('8', 'silk-evening-dress', 'Silk Evening Dress', 'D33310002T6CB0261', 2100000, NULL, 'Váy đầm', 
 '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"]', 
 '["#800000"]', 
 'Váy lụa dự tiệc sang trọng.', 1);

INSERT INTO Reviews (id, productId, stars, content, authorName, createdAt) VALUES
('r_001', '1', 5, 'Sản phẩm đẹp, vải dày dặn, đúng mô tả.', 'Nguyễn Văn A', '2024-02-03T10:00:00Z'),
('r_002', '1', 4, 'Giao hàng hơi chậm nhưng áo đẹp.', 'Trần Thị B', '2024-02-04T14:30:00Z');

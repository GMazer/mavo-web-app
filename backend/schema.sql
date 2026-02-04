
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Settings;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Orders;

CREATE TABLE Categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT
);

CREATE TABLE Products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    name TEXT NOT NULL,
    sku TEXT,
    price INTEGER,
    originalPrice INTEGER,
    category TEXT, -- Stores Category Name or Slug
    images TEXT, -- JSON Array
    colors TEXT, -- JSON Array of Objects {name, hex}
    description TEXT, -- Main Product Info content
    highlights TEXT, -- Highlights content (expandable section)
    material TEXT, -- e.g. Vải dệt thoi
    gender TEXT, -- e.g. FEMALE
    isVisible INTEGER DEFAULT 1, -- 1: Show, 0: Hide
    customSizeGuide TEXT -- URL to specific size guide image
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

CREATE TABLE Settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE Orders (
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

-- SEED DATA CATEGORIES
INSERT INTO Categories (id, name, slug, description) VALUES
('c1', 'Váy đầm', 'vay-dam', 'Các mẫu váy đầm thời thượng'),
('c2', 'Áo', 'ao', 'Áo sơ mi, áo kiểu, áo thun'),
('c3', 'Quần', 'quan', 'Quần tây, quần jeans, quần short'),
('c4', 'Chân váy', 'chan-vay', 'Chân váy ngắn, dài, xếp ly'),
('c5', 'Set', 'set', 'Set bộ phối sẵn'),
('c6', 'Jumpsuits', 'jumpsuits', 'Đồ bay, áo liền quần'),
('c7', 'Áo khoác', 'ao-khoac', 'Blazer, Vest, áo khoác ngoài');

-- SEED DATA PRODUCTS
-- Colors are now stored as JSON Objects: [{"name": "Nâu", "hex": "#8B4513"}]
INSERT INTO Products (id, slug, name, sku, price, originalPrice, category, images, colors, description, highlights, material, gender, isVisible, customSizeGuide) VALUES 
('1', 'brown-long-sleeves-woven-vest', 'Brown Long Sleeves Woven Vest', 'D82510002T6CB0261', 999000, 2399000, 'Set', 
 '["https://images.unsplash.com/photo-1552874869-5c39ec9288dc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1550614000-4b9519e02c97?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"]', 
 '[{"name": "Nâu", "hex": "#8B4513"}]', 
 'Thổi hồn vào những thiết kế MAVO đem đến cho bạn trải nghiệm dòng sản phẩm với phong cách trẻ trung, năng động và hiện đại.\nMAVO By DO MANH CUONG',
 'Chất liệu cao cấp, thiết kế hiện đại phù hợp với nhiều phong cách.',
 'Vải dệt thoi', 'FEMALE', 1, NULL),

('2', 'brown-woven-mini-skirt', 'Brown Woven Mini Skirt', 'S99210002T6CB0261', 599000, 1399000, 'Chân váy', 
 '["https://images.unsplash.com/photo-1582142407894-ec85f1260a46?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"]', 
 '[{"name": "Nâu", "hex": "#8B4513"}]', 
 'Chân váy ngắn dệt kim đồng bộ.', 'Thiết kế trẻ trung, năng động.', 'Vải dệt kim', 'FEMALE', 1, NULL),

('3', 'white-mavo-embroidered-raw-shirt', 'White Mavo Embroidered Raw Shirt', 'A12310002T6CB0261', 599500, 1199000, 'Áo', 
 '["https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=800&auto=format&fit=crop"]', 
 '[{"name": "Trắng", "hex": "#FFFFFF"}]', 
 'Áo sơ mi trắng thêu họa tiết.', 'Họa tiết thêu tinh tế.', 'Cotton thô', 'FEMALE', 1, NULL),

('4', 'gray-woven-blouse', 'Gray Woven Blouse', 'A45610002T6CB0261', 649500, 1299000, 'Áo', 
 '["https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=800&auto=format&fit=crop"]', 
 '[{"name": "Xám", "hex": "#696969"}]', 
 'Áo kiểu màu xám thanh lịch.', 'Kiểu dáng thanh lịch, công sở.', 'Lụa tổng hợp', 'FEMALE', 1, NULL),

('5', 'black-classic-blazer', 'Black Classic Blazer', 'K78910002T6CB0261', 1250000, 2500000, 'Áo khoác', 
 '["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop"]', 
 '[{"name": "Đen", "hex": "#000000"}]', 
 'Áo khoác blazer đen cổ điển.', 'Form dáng chuẩn, đứng form.', 'Vải Tuytsi', 'FEMALE', 1, NULL),

('6', 'beige-pleated-skirt', 'Beige Pleated Skirt', 'S11110002T6CB0261', 450000, 890000, 'Chân váy', 
 '["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop"]', 
 '[{"name": "Be", "hex": "#F5F5DC"}]', 
 'Chân váy xếp ly màu be.', 'Xếp ly đều, không nhăn.', 'Vải Chiffon', 'FEMALE', 1, NULL),

('7', 'navy-blue-jumpsuit', 'Navy Blue Jumpsuit', 'J22210002T6CB0261', 899000, 1599000, 'Jumpsuits', 
 '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"]', 
 '[{"name": "Xanh Navy", "hex": "#000080"}]', 
 'Jumpsuit xanh navy thời thượng.', 'Thiết kế liền thân tôn dáng.', 'Vải Kaki mềm', 'FEMALE', 1, NULL),

('8', 'silk-evening-dress', 'Silk Evening Dress', 'D33310002T6CB0261', 2100000, NULL, 'Váy đầm', 
 '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"]', 
 '[{"name": "Đỏ Đô", "hex": "#800000"}]', 
 'Váy lụa dự tiệc sang trọng.', 'Chất liệu lụa cao cấp.', 'Lụa tơ tằm', 'FEMALE', 1, NULL);

INSERT INTO Reviews (id, productId, stars, content, authorName, createdAt) VALUES
('r_001', '1', 5, 'Sản phẩm đẹp, vải dày dặn, đúng mô tả.', 'Nguyễn Văn A', '2024-02-03T10:00:00Z'),
('r_002', '1', 4, 'Giao hàng hơi chậm nhưng áo đẹp.', 'Trần Thị B', '2024-02-04T14:30:00Z');

-- SEED DATA SETTINGS
INSERT INTO Settings (key, value) VALUES
('hotline', '1800 6525'),
('email', 'cskh@mavofashion.com'),
('zalo', '0912345678'),
('sizeGuideDefault', 'https://product.hstatic.net/200000182297/product/bang-size-nu_c9205164d96a461b97b0a3c20c085026_master.jpg'),
('careGuideDefault', 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'),
('returnPolicyDefault', 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=800&auto=format&fit=crop');

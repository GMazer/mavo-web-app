
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Settings;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Wards;
DROP TABLE IF EXISTS Districts;
DROP TABLE IF EXISTS Provinces;

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
    category TEXT,
    images TEXT, 
    colors TEXT, 
    description TEXT, 
    highlights TEXT, 
    material TEXT, 
    gender TEXT, 
    isVisible INTEGER DEFAULT 1, 
    customSizeGuide TEXT,
    stock INTEGER DEFAULT 100 -- Added stock column
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
    items TEXT, 
    status TEXT DEFAULT 'pending', 
    createdAt TEXT
);

-- ADDRESS TABLES
CREATE TABLE Provinces (
    code TEXT PRIMARY KEY,
    name TEXT,
    name_with_type TEXT,
    slug TEXT
);

CREATE TABLE Districts (
    code TEXT PRIMARY KEY,
    parent_code TEXT, -- Links to Province Code
    name TEXT,
    name_with_type TEXT,
    slug TEXT,
    path_with_type TEXT,
    FOREIGN KEY(parent_code) REFERENCES Provinces(code)
);

CREATE TABLE Wards (
    code TEXT PRIMARY KEY,
    parent_code TEXT, -- Links to District Code
    name TEXT,
    name_with_type TEXT,
    slug TEXT,
    path_with_type TEXT,
    FOREIGN KEY(parent_code) REFERENCES Districts(code)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_districts_parent ON Districts(parent_code);
CREATE INDEX idx_wards_parent ON Wards(parent_code);

-- SEED DATA CATEGORIES
INSERT INTO Categories (id, name, slug, description) VALUES
('c1', 'Váy đầm', 'vay-dam', 'Các mẫu váy đầm thời thượng'),
('c2', 'Áo', 'ao', 'Áo sơ mi, áo kiểu, áo thun'),
('c3', 'Quần', 'quan', 'Quần tây, quần jeans, quần short'),
('c4', 'Chân váy', 'chan-vay', 'Chân váy ngắn, dài, xếp ly'),
('c5', 'Set', 'set', 'Set bộ phối sẵn'),
('c6', 'Jumpsuits', 'jumpsuits', 'Đồ bay, áo liền quần'),
('c7', 'Áo khoác', 'ao-khoac', 'Blazer, Vest, áo khoác ngoài');

-- SEED DATA PRODUCTS (Updated with Stock)
INSERT INTO Products (id, slug, name, sku, price, originalPrice, category, images, colors, description, highlights, material, gender, isVisible, customSizeGuide, stock) VALUES 
('1', 'brown-long-sleeves-woven-vest', 'Brown Long Sleeves Woven Vest', 'D82510002T6CB0261', 999000, 2399000, 'Set', 
 '["https://images.unsplash.com/photo-1552874869-5c39ec9288dc?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1550614000-4b9519e02c97?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"]', 
 '[{"name": "Nâu", "hex": "#8B4513"}]', 
 'Thổi hồn vào những thiết kế MAVO đem đến cho bạn trải nghiệm dòng sản phẩm với phong cách trẻ trung, năng động và hiện đại.\nMAVO By DO MANH CUONG',
 'Chất liệu cao cấp, thiết kế hiện đại phù hợp với nhiều phong cách.',
 'Vải dệt thoi', 'FEMALE', 1, NULL, 85),
('2', 'brown-woven-mini-skirt', 'Brown Woven Mini Skirt', 'S99210002T6CB0261', 599000, 1399000, 'Chân váy', 
 '["https://images.unsplash.com/photo-1582142407894-ec85f1260a46?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"]', 
 '[{"name": "Nâu", "hex": "#8B4513"}]', 
 'Chân váy ngắn dệt kim đồng bộ.', 'Thiết kế trẻ trung, năng động.', 'Vải dệt kim', 'FEMALE', 1, NULL, 12);

INSERT INTO Reviews (id, productId, stars, content, authorName, createdAt) VALUES
('r_001', '1', 5, 'Sản phẩm đẹp, vải dày dặn, đúng mô tả.', 'Nguyễn Văn A', '2024-02-03T10:00:00Z'),
('r_002', '1', 4, 'Giao hàng hơi chậm nhưng áo đẹp.', 'Trần Thị B', '2024-02-04T14:30:00Z');

INSERT INTO Settings (key, value) VALUES
('hotline', '1800 6525'),
('email', 'cskh@mavofashion.com'),
('zalo', '0912345678'),
('sizeGuideDefault', 'https://product.hstatic.net/200000182297/product/bang-size-nu_c9205164d96a461b97b0a3c20c085026_master.jpg'),
('careGuideDefault', 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'),
('returnPolicyDefault', 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=800&auto=format&fit=crop');

-- SEED DATA ADDRESS
INSERT INTO Provinces (code, name, name_with_type, slug) VALUES 
('01', 'Hà Nội', 'Thành phố Hà Nội', 'ha-noi'),
('79', 'Hồ Chí Minh', 'Thành phố Hồ Chí Minh', 'ho-chi-minh');

INSERT INTO Districts (code, parent_code, name, name_with_type, slug, path_with_type) VALUES 
('001', '01', 'Ba Đình', 'Quận Ba Đình', 'ba-dinh', 'Quận Ba Đình, Thành phố Hà Nội'),
('002', '01', 'Hoàn Kiếm', 'Quận Hoàn Kiếm', 'hoan-kiem', 'Quận Hoàn Kiếm, Thành phố Hà Nội'),
('760', '79', 'Quận 1', 'Quận 1', 'quan-1', 'Quận 1, Thành phố Hồ Chí Minh');

INSERT INTO Wards (code, parent_code, name, name_with_type, slug, path_with_type) VALUES 
('00001', '001', 'Phúc Xá', 'Phường Phúc Xá', 'phuc-xa', 'Phường Phúc Xá, Quận Ba Đình, Thành phố Hà Nội'),
('00004', '001', 'Trúc Bạch', 'Phường Trúc Bạch', 'truc-bach', 'Phường Trúc Bạch, Quận Ba Đình, Thành phố Hà Nội'),
('26734', '760', 'Tân Định', 'Phường Tân Định', 'tan-dinh', 'Phường Tân Định, Quận 1, Thành phố Hồ Chí Minh');

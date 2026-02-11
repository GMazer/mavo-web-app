
-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- 1. Core Config & Auth
CREATE TABLE IF NOT EXISTS Settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS Admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    twoFactorSecret TEXT NOT NULL,
    createdAt TEXT
);

-- 2. Products & Categories
CREATE TABLE IF NOT EXISTS Categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    isVisible INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS Products (
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
    stock INTEGER DEFAULT 100
);

CREATE TABLE IF NOT EXISTS Reviews (
    id TEXT PRIMARY KEY,
    productId TEXT,
    stars INTEGER,
    content TEXT,
    authorName TEXT,
    createdAt TEXT,
    FOREIGN KEY(productId) REFERENCES Products(id)
);

-- 3. Orders
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
    items TEXT, 
    status TEXT DEFAULT 'pending', 
    createdAt TEXT
);

-- 4. Locations
CREATE TABLE IF NOT EXISTS Provinces (
    code TEXT PRIMARY KEY,
    name TEXT,
    name_with_type TEXT,
    slug TEXT
);

CREATE TABLE IF NOT EXISTS Districts (
    code TEXT PRIMARY KEY,
    parent_code TEXT,
    name TEXT,
    name_with_type TEXT,
    slug TEXT,
    path_with_type TEXT,
    FOREIGN KEY(parent_code) REFERENCES Provinces(code)
);

CREATE TABLE IF NOT EXISTS Wards (
    code TEXT PRIMARY KEY,
    parent_code TEXT,
    name TEXT,
    name_with_type TEXT,
    slug TEXT,
    path_with_type TEXT,
    FOREIGN KEY(parent_code) REFERENCES Districts(code)
);

CREATE INDEX IF NOT EXISTS idx_districts_parent ON Districts(parent_code);
CREATE INDEX IF NOT EXISTS idx_wards_parent ON Wards(parent_code);

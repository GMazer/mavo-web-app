
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

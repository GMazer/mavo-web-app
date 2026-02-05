
-- Chạy lệnh này để thêm cột stock vào bảng Products hiện có
ALTER TABLE Products ADD COLUMN stock INTEGER DEFAULT 100;

-- (Tùy chọn) Cập nhật lại một số sản phẩm mẫu để có số lượng tồn kho khác nhau (Demo)
UPDATE Products SET stock = 85 WHERE id = '1';
UPDATE Products SET stock = 12 WHERE id = '2';
UPDATE Products SET stock = 0 WHERE id = '5'; -- Cho áo vest hết hàng

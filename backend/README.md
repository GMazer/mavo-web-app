# Backend API - Mavo Fashion

## Structure
- `src/app.ts`: Main entry point.
- `src/routes/`: API route definitions.

## Setup & Run

1.  **Install dependencies**:
    ```bash
    cd backend
    npm install
    ```

2.  **Development**:
    ```bash
    npm run dev
    ```
    Server runs on http://localhost:8080.

3.  **Deploy to Cloudflare Workers**:
    ```bash
    npm run deploy
    ```

## 🚀 R2 Setup Checklist (Quan trọng)

Trước khi upload ảnh hoạt động, bạn cần cấu hình R2 theo các bước sau:

1.  **Tạo Bucket trên Cloudflare Dashboard**:
    *   Tên bucket: `mavo-assets`
    
2.  **Lấy thông tin xác thực (Credentials)**:
    *   Tạo API Token (Quyền: Admin Read & Write).
    *   Copy `Access Key ID` và `Secret Access Key`.
    *   Lấy `Account ID` từ URL dashboard.

3.  **Cập nhật `wrangler.toml`**:
    *   Điền `R2_ACCOUNT_ID`.
    *   Điền `R2_ACCESS_KEY_ID`.
    *   Chạy lệnh để đặt secret key: 
        ```bash
        npx wrangler secret put R2_SECRET_ACCESS_KEY
        ```

4.  **Bật Public Access (Để xem ảnh)**:
    *   Vào Bucket > Settings > Public Access > Allow Access.
    *   Copy domain `https://pub-xxx.r2.dev`.
    *   Điền vào `R2_PUBLIC_DOMAIN` trong `wrangler.toml`.

5.  **Cấu hình CORS (Để upload ảnh từ trình duyệt)**:
    *   Chạy lệnh sau tại thư mục `backend` để áp dụng file `cors.json` cho bucket:
        ```bash
        npx wrangler r2 bucket cors update mavo-assets --file cors.json
        ```

## Endpoints

-   `GET /api/health`: Health check.
-   `GET /api/products`: Danh sách sản phẩm.
-   `POST /api/uploads/presign`: Lấy URL để upload ảnh lên R2.

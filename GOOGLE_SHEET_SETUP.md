
# Hướng Dẫn Tự Động Lưu Đơn Hàng Vào Google Sheets

Để đơn hàng tự động được lưu vào Google Sheet khi khách hàng đặt mua, bạn cần tạo một Webhook bằng **Google Apps Script**. Làm theo các bước sau:

### 1. Tạo Google Sheet mới
1. Vào [Google Sheets](https://sheets.google.com) và tạo một trang tính mới.
2. Đặt tên cho Sheet (ví dụ: "Quản lý Đơn Hàng Mavo").
3. Ở dòng đầu tiên (Header), điền các cột theo thứ tự sau:
   - **Cột A:** Thời gian
   - **Cột B:** Mã đơn hàng
   - **Cột C:** Tên khách hàng
   - **Cột D:** Số điện thoại
   - **Cột E:** Địa chỉ
   - **Cột F:** Sản phẩm
   - **Cột G:** Tổng tiền
   - **Cột H:** Hình thức thanh toán
   - **Cột I:** Ghi chú
   - **Cột J:** Trạng thái

### 2. Tạo Script Webhook
1. Tại Google Sheet vừa tạo, chọn menu **Tiện ích mở rộng (Extensions)** > **Apps Script**.
2. Xóa hết code cũ trong file `Mã.gs` (hoặc `Code.gs`) và dán đoạn code sau vào:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    sheet.appendRow([
      data.date,
      data.orderId,
      data.customerName,
      "'"+data.customerPhone, // Thêm dấu ' để tránh mất số 0 đầu
      data.address,
      data.products,
      data.amount,
      data.payment,
      data.note,
      data.status
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 3. Triển khai (Deploy)
1. Nhấn nút **Lưu** (icon đĩa mềm) hoặc `Ctrl + S`.
2. Nhấn nút **Triển khai (Deploy)** (màu xanh ở góc trên phải) > **Tùy chọn triển khai mới (New deployment)**.
3. Chọn loại: **Ứng dụng web (Web app)** (bấm vào biểu tượng bánh răng bên cạnh 'Chọn loại').
4. Điền thông tin:
   - **Mô tả:** Webhook Đơn Hàng
   - **Thực thi dưới dạng (Execute as):** *Tôi (Me)* (Email của bạn).
   - **Ai có quyền truy cập (Who has access):** *Bất kỳ ai (Anyone)*. **(QUAN TRỌNG: Phải chọn mục này để Website có thể gửi dữ liệu vào)**.
5. Nhấn **Triển khai (Deploy)**.
6. Google sẽ yêu cầu cấp quyền truy cập, hãy nhấn **Cho phép (Authorize access)** -> Chọn tài khoản Google -> Chọn **Nâng cao (Advanced)** -> Chọn **Đi tới ... (không an toàn)** -> Nhấn **Cho phép**.
7. Copy đường link **Ứng dụng web (Web app URL)** (Có dạng `https://script.google.com/macros/s/.../exec`).

### 4. Kết nối với Website
1. Vào trang Admin CMS của website (đường dẫn `/admin-app/index.html`).
2. Vào mục **Cấu hình (Settings)**.
3. Dán đường link vừa copy vào ô **Google Apps Script Webhook URL**.
4. Nhấn **Lưu thay đổi**.

✅ **Hoàn tất!** Hãy thử đặt một đơn hàng mới trên website và kiểm tra Google Sheet.

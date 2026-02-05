
const fs = require('fs');
const path = require('path');

// CẤU HÌNH
const API_URL = 'http://localhost:8080/api/locations/import';
// Đường dẫn tới file tree.json (Bạn có thể sửa lại nếu file nằm chỗ khác)
// Mặc định đang tìm file tree.json nằm cùng cấp với thư mục backend hoặc trong backend
const FILE_PATHS = [
    path.join(__dirname, '../tree.json'),
    path.join(__dirname, 'tree.json'),
    path.join(__dirname, '../dist/tree.json') // Đường dẫn trong lỗi của bạn
];

async function importData() {
    let jsonPath = FILE_PATHS.find(p => fs.existsSync(p));

    if (!jsonPath) {
        console.error('❌ KHÔNG TÌM THẤY FILE tree.json!');
        console.log('Vui lòng đặt file tree.json vào thư mục backend hoặc thư mục gốc của dự án.');
        process.exit(1);
    }

    console.log(`📖 Đang đọc file: ${jsonPath}...`);
    
    try {
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const jsonData = JSON.parse(rawData);
        
        console.log('🚀 Đang gửi dữ liệu lên Server (Có thể mất vài giây)...');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ IMPORT THÀNH CÔNG!');
            console.log('-----------------------------------');
            console.log(`🏛️  Tỉnh/TP: ${result.imported.provinces}`);
            console.log(`🏘️  Quận/Huyện: ${result.imported.districts}`);
            console.log(`🏡  Phường/Xã: ${result.imported.wards}`);
            console.log('-----------------------------------');
        } else {
            console.error('❌ IMPORT THẤT BẠI:', result);
        }

    } catch (error) {
        console.error('❌ LỖI KẾT NỐI:', error.message);
        console.log('Hãy chắc chắn rằng server đang chạy tại ' + API_URL);
    }
}

importData();

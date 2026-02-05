
const fs = require('fs');
const path = require('path');

// CẤU HÌNH URL
const LOCAL_URL = 'http://127.0.0.1:8080/api/locations/import';
const PROD_URL = 'https://mavo-fashion-api.mavo-web.workers.dev/api/locations/import';

// Lấy tham số từ dòng lệnh (ví dụ: node seed-locations.js prod)
const args = process.argv.slice(2);
const mode = args[0] === 'prod' ? 'PRODUCTION' : 'LOCAL';
const API_URL = mode === 'PRODUCTION' ? PROD_URL : LOCAL_URL;

const FILE_PATHS = [
    path.join(__dirname, '../tree.json'),
    path.join(__dirname, 'tree.json'),
    path.join(__dirname, '../dist/tree.json')
];

async function importData() {
    console.log(`🌍 Môi trường: ${mode}`);
    console.log(`🔗 API Target: ${API_URL}`);

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
        if (mode === 'LOCAL') {
            console.log('Hãy chắc chắn rằng server đang chạy (npm run dev).');
        } else {
            console.log('Hãy chắc chắn rằng bạn đã deploy server (npm run deploy).');
        }
    }
}

importData();

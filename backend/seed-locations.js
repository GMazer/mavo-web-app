
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
        const fullData = JSON.parse(rawData);
        
        // Chuyển object lớn thành danh sách các keys (mã tỉnh)
        const provinceKeys = Object.keys(fullData);
        const total = provinceKeys.length;

        console.log(`📦 Tìm thấy ${total} Tỉnh/Thành phố.`);
        console.log('🚀 Bắt đầu chia nhỏ và gửi dữ liệu (Tránh lỗi quá tải Worker)...');
        console.log('-----------------------------------');

        let successCount = 0;
        let failCount = 0;
        let totalWards = 0;

        // Gửi từng tỉnh một
        for (let i = 0; i < total; i++) {
            const key = provinceKeys[i];
            const provinceData = fullData[key];
            const provinceName = provinceData.name_with_type || provinceData.name;

            // Tạo payload nhỏ chỉ chứa 1 tỉnh
            const payload = {
                [key]: provinceData
            };

            process.stdout.write(`⏳ [${i + 1}/${total}] Đang nhập: ${provinceName}... `);

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.ok) {
                    const wardsCount = result.imported?.wards || 0;
                    totalWards += wardsCount;
                    console.log(`✅ OK (${wardsCount} xã/phường)`);
                    successCount++;
                } else {
                    console.log(`❌ LỖI`);
                    console.error(`   -> Chi tiết:`, result);
                    failCount++;
                }
            } catch (err) {
                console.log(`❌ LỖI KẾT NỐI`);
                console.error(`   -> ${err.message}`);
                failCount++;
            }
            
            // Nghỉ 1 chút xíu giữa các request để server thở (opsional)
            // await new Promise(r => setTimeout(r, 100));
        }

        console.log('-----------------------------------');
        console.log(`🎉 HOÀN TẤT!`);
        console.log(`✅ Thành công: ${successCount} tỉnh`);
        console.log(`❌ Thất bại: ${failCount} tỉnh`);
        console.log(`🏡 Tổng số xã/phường đã nhập: ${totalWards}`);

    } catch (error) {
        console.error('❌ LỖI FILE/KẾT NỐI:', error.message);
    }
}

importData();

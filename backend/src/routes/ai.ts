import { Hono } from 'hono';
import { GoogleGenAI } from '@google/genai';
import { Bindings } from '../bindings';

const app = new Hono<{ Bindings: Bindings }>();

app.post('/generate-description', async (c) => {
    try {
        const { name, material, gender, category, colors } = await c.req.json();
        
        const apiKey = c.env.GEMINI_API_KEY;
        if (!apiKey) {
            return c.json({ error: "Server chưa cấu hình GEMINI_API_KEY" }, 500);
        }

        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Bạn là một chuyên gia viết nội dung bán hàng thời trang (copywriter) chuyên nghiệp.
Hãy viết một đoạn mô tả sản phẩm thật hấp dẫn, thu hút khách hàng dựa trên các thông tin sau:
- Tên sản phẩm: ${name}
- Chất liệu: ${material || 'Không xác định'}
- Dành cho: ${gender === 'FEMALE' ? 'Nữ' : gender === 'MALE' ? 'Nam' : 'Unisex'}
- Danh mục: ${category}
- Màu sắc: ${colors && colors.length > 0 ? colors.join(', ') : 'Nhiều màu'}

Yêu cầu:
- Viết bằng tiếng Việt, giọng văn thanh lịch, hiện đại, cuốn hút.
- Nêu bật được ưu điểm của chất liệu và kiểu dáng.
- Chia thành các đoạn ngắn dễ đọc, có thể dùng bullet points (gạch đầu dòng) cho các đặc điểm nổi bật.
- Không cần viết tiêu đề chính, chỉ cần nội dung mô tả.
- Độ dài khoảng 150 - 250 từ.`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        return c.json({ text: response.text });
    } catch (e: any) {
        console.error("AI Generation Error:", e);
        return c.json({ error: e.message || "Lỗi khi tạo mô tả" }, 500);
    }
});

export default app;

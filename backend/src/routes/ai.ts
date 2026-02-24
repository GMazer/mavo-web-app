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
        const prompt = `Hãy tạo nội dung mô tả sản phẩm theo đúng mẫu định dạng sau (giữ nguyên các tiêu đề):

THÔNG TIN SẢN PHẨM
Sản Phẩm: ${name}
Chất Vải: ${material || 'Vải cao cấp'}
Dòng sản phẩm: ${gender}
[Viết một câu slogan ngắn gọn, khoảng 20-30 từ, mang phong cách trẻ trung, năng động và hiện đại, ví dụ: "Thổi hồn vào những thiết kế Mavo đem đến cho bạn trải nghiệm dòng sản phẩm với phong cách trẻ trung, năng động và hiện đại."]

Thông tin đầu vào:
- Tên: ${name}
- Chất liệu: ${material}
- Danh mục: ${category}
- Màu sắc: ${colors && colors.length > 0 ? colors.join(', ') : ''}`;

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

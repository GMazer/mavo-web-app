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
        const prompt = `Hãy tạo nội dung mô tả sản phẩm và đặc điểm nổi bật dưới dạng JSON.

Thông tin đầu vào:
- Tên: ${name}
- Chất liệu: ${material}
- Danh mục: ${category}
- Màu sắc: ${colors && colors.length > 0 ? colors.join(', ') : ''}
- Dòng sản phẩm: ${gender}

Yêu cầu output JSON:
{
  "description": "Nội dung mô tả theo mẫu:\nTHÔNG TIN SẢN PHẨM\nSản Phẩm: ${name}\nChất Vải: ${material || 'Vải cao cấp'}\nDòng sản phẩm: ${gender}\n[Slogan ngắn gọn 20-30 từ, phong cách trẻ trung, hiện đại]",
  "highlights": "1-2 dòng ngắn gọn nêu bật ưu điểm sản phẩm (ví dụ: Chất liệu thoáng mát, thiết kế trendy...)"
}`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const jsonResponse = JSON.parse(response.text || '{}');
        return c.json(jsonResponse);
    } catch (e: any) {
        console.error("AI Generation Error:", e);
        return c.json({ error: e.message || "Lỗi khi tạo mô tả" }, 500);
    }
});

export default app;

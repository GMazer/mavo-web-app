import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (
  name: string,
  material: string,
  gender: string,
  category: string,
  colors: string[]
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env");
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Bạn là một chuyên gia viết nội dung bán hàng thời trang (copywriter) chuyên nghiệp.
Hãy viết một đoạn mô tả sản phẩm thật hấp dẫn, thu hút khách hàng dựa trên các thông tin sau:
- Tên sản phẩm: ${name}
- Chất liệu: ${material || 'Không xác định'}
- Dành cho: ${gender === 'FEMALE' ? 'Nữ' : gender === 'MALE' ? 'Nam' : 'Unisex'}
- Danh mục: ${category}
- Màu sắc: ${colors.length > 0 ? colors.join(', ') : 'Nhiều màu'}

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

    return response.text || '';
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("Không thể tạo mô tả bằng AI lúc này.");
  }
};

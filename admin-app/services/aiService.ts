import { API_BASE } from "./api";

export const generateProductDescription = async (
  name: string,
  material: string,
  gender: string,
  category: string,
  colors: string[]
): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE}/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        material,
        gender,
        category,
        colors
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Lỗi khi gọi AI Server");
    }

    const data = await res.json();
    return data.text || '';
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("Không thể tạo mô tả bằng AI lúc này.");
  }
};

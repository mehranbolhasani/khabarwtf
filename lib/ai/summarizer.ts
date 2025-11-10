import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function summarizeArticle(
  title: string,
  content: string | null | undefined
): Promise<string | null> {
  // If no API key, return null to use fallback
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  // If no content, return null
  if (!content || content.trim().length === 0) {
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Limit content length to avoid token limits
    const contentPreview = content.substring(0, 2000);

    const prompt = `لطفاً این خبر را به صورت خلاصه و مختصر (حداکثر 2-3 جمله) به فارسی خلاصه کنید. فقط خلاصه را برگردانید، بدون توضیحات اضافی.

عنوان: ${title}

متن خبر:
${contentPreview}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    return summary || null;
  } catch (error) {
    console.error("Error summarizing article with Gemini:", error);
    return null;
  }
}


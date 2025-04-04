import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GEMINI_API_KEY;

async function generateMessage(prompt: string): Promise<string> {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables.");
  }

  console.log("Initializing Gemini API with prompt:", prompt);
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Gemini API response:", text);
    return text || "Failed to generate content.";
  } catch (error) {
    console.error("Error generating content:", error);
    return "Failed to generate content.";
  }
}

export default generateMessage;

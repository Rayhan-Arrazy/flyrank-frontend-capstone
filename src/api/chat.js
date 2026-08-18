import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in environment");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function streamChat(message, history) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })),
  });

  const result = await chat.sendMessageStream(message);

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(chunk.text());
      }
      controller.close();
    },
  });

  return stream;
}

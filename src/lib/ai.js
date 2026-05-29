import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function callAI(systemPrompt, userMessage, conversationHistory = []) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Format conversation history for Gemini
    const messages = conversationHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts: [{ text: msg.text || msg.content }],
    }));

    // Add current message
    messages.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    // Create system-aware prompt
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser: ${userMessage}` : userMessage;

    // Make the API call
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

export async function callAIWithVision(systemPrompt, userMessage, imageBase64, mediaType = "image/jpeg") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Convert base64 to appropriate Gemini format
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser: ${userMessage}` : userMessage;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mediaType,
                data: cleanBase64,
              },
            },
            {
              text: fullPrompt,
            },
          ],
        },
      ],
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Vision API error:", error);
    throw error;
  }
}

export async function streamAI(systemPrompt, userMessage, onChunk) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser: ${userMessage}` : userMessage;

    const result = await model.generateContentStream({
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    for await (const chunk of result.stream) {
      if (chunk.candidates && chunk.candidates[0]) {
        const content = chunk.candidates[0].content;
        if (content && content.parts) {
          for (const part of content.parts) {
            if (part.text) {
              onChunk(part.text);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Gemini streaming error:", error);
    throw error;
  }
}

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
});

export async function callClaude(systemPrompt, userMessage) {
  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error("Claude API error:", error);
    throw error;
  }
}

export async function callClaudeWithVision(systemPrompt, userMessage, imageBase64, mediaType = "image/jpeg") {
  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: userMessage,
            },
          ],
        },
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error("Claude Vision API error:", error);
    throw error;
  }
}

export async function streamClaude(systemPrompt, userMessage, onChunk) {
  try {
    const stream = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        onChunk(event.delta.text);
      }
    }
  } catch (error) {
    console.error("Claude streaming error:", error);
    throw error;
  }
}

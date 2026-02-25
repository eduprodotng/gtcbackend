// services/aiService.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function waitForRetry(attempt) {
  const delay = Math.min(1000 * 2 ** attempt, 60000);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function getAIResponse(userMessage) {
  const messages = [
    {
      role: "system",
      content:
        "You're Finomic AI, an AI model created to offer financial support to people. Your primary role is to help users make informed financial decisions, manage personal or business budgets, and understand complex financial topics in simple terms. You are friendly, reliable, and professional, offering advice based on sound financial principles. Always tailor your responses to the user's unique situation, ask clarifying questions when needed, and avoid giving legal or investment guarantees. Your goal is to empower users to take control of their financial lives with confidence and clarity.",
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      if (error.status === 429) {
        console.warn("Rate limit exceeded. Retrying...");
        await waitForRetry(attempt);
      } else {
        console.error("OpenAI Error:", error);
        throw new Error("Failed to get response from OpenAI.");
      }
    }
  }

  throw new Error("Max retries exceeded for OpenAI call.");
}

module.exports = { getAIResponse };

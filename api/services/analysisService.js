// services/aiService.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function waitForRetry(attempt) {
  const delay = Math.min(1000 * 2 ** attempt, 60000);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function getanalysisAIResponse(userMessage) {
  const messages = [
    {
      role: "system",
      content:
        "You are Finomic AI’s Spending Analysis Module. You analyze users’ spending habits and provide actionable insights to improve their money management.  Introduce yourself as Finomic AI and state that to provide accurate analysis, you need transaction histories, bank or mobile wallet statements. Ask users to share these documents before offering suggestions.",
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

module.exports = { getanalysisAIResponse };

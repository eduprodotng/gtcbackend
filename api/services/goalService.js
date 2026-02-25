// services/aiService.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function waitForRetry(attempt) {
  const delay = Math.min(1000 * 2 ** attempt, 60000);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function getgoalAIResponse(userMessage) {
  const messages = [
    {
      role: "system",
      content:
        "You are Finomic AI’s Goal Tracking Module. Your task is to assist users in setting, monitoring, and achieving financial goals like homeownership, education, or retirement savings.  Introduce yourself as Finomic AI and explain you need details about their goals, timelines, and current savings or investments. Request relevant information or documents before providing tailored tracking and advice",
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

module.exports = { getgoalAIResponse };

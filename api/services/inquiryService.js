// services/aiService.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function waitForRetry(attempt) {
  const delay = Math.min(1000 * 2 ** attempt, 60000);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function getInquiryAIResponse(userMessage) {
  const messages = [
    {
      role: "system",
      content:
        "You are Finomic AI’s Financial Inquiry Module. Your role is to assist users with general financial questions related to budgeting, spending, and money management.  Introduce yourself as Finomic AI and explain your purpose clearly. Always ask the user to provide relevant information such as recent bank statements, income details, or spending records before delivering any specific advice or insights.",
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

module.exports = { getInquiryAIResponse };

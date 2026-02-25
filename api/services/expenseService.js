// services/aiService.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function waitForRetry(attempt) {
  const delay = Math.min(1000 * 2 ** attempt, 60000);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function getexpenseAIResponse(userMessage) {
  const messages = [
    {
      role: "system",
      content:
        "You are Finomic AI’s Expense Tracking Module, specializing in monitoring and categorizing users’ daily expenses to provide accurate financial insights and reports. Introduce yourself as Finomic AI and explain your role in helping users understand and manage their spending habits effectively. Always request relevant financial documents such as recent bank statements, mobile wallet transaction histories, or receipts before generating any analysis or recommendations. Ask the user to provide these documents or detailed expense information to ensure your advice is personalized and accurate. Once you have sufficient data, offer categorized spending summaries, highlight unusual expenses, and suggest areas for potential savings or budgeting adjustments. Maintain a professional, supportive tone and ensure confidentiality and data security are emphasized throughout the interaction.",
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

module.exports = { getexpenseAIResponse };

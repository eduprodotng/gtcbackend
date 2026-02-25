// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is stored in environment variables
// });

// export async function generateQuestions(topic, difficulty, numberOfQuestions) {
//   // Construct the messages for the chat model
//   const messages = [
//     {
//       role: "user",
//       content: `Generate ${numberOfQuestions} questions on the topic "${topic}" at a ${difficulty} difficulty level. Include a mix of multiple-choice and short-answer questions.`,
//     },
//   ];

//   try {
//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo", // You can also use "gpt-4" if you have access
//       messages: messages,
//       max_tokens: 1000,
//       temperature: 0.7,
//     });

//     // Extract the questions from the response
//     const questions = response.data.choices[0].message.content
//       .trim()
//       .split("\n")
//       .filter((q) => q);

//     return questions;
//   } catch (error) {
//     console.error("Error generating questions:", error);
//     throw new Error("Failed to generate questions from OpenAI");
//   }
// // }
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is stored in environment variables
// });

// export async function generateQuestions(topic, difficulty, numberOfQuestions) {
//   // Construct the messages for the chat model
//   const messages = [
//     {
//       role: "user",
//       content: `Generate ${numberOfQuestions} questions on the topic "${topic}" at a ${difficulty} difficulty level. Include a mix of multiple-choice and short-answer questions.`,
//     },
//   ];

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // You can also use "gpt-4" if you have access
//       messages: messages,
//       max_tokens: 1000,
//       temperature: 0.7,
//     });

//     // Extract the questions from the response
//     const questions = response.choices[0].message.content
//       .trim()
//       .split("\n")
//       .filter((q) => q);

//     return questions;
//   } catch (error) {
//     console.error("Error generating questions:", error);
//     throw new Error("Failed to generate questions from OpenAI");
//   }
// }

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function waitForRetry(attempt) {
  const delay = Math.min(1000 * 2 ** attempt, 30000); // Exponential backoff
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function generateGenQuestions(
  topic,
  difficulty,
  numberOfQuestions
) {
  const messages = [
    {
      role: "user",
      content: `Generate ${numberOfQuestions} questions on the topic "${topic}" at a ${difficulty} difficulty level. Include a mix of multiple-choice and short-answer questions.`,
    },
  ];

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const questions = response.choices[0].message.content
        .trim()
        .split("\n")
        .filter((q) => q);

      return questions;
    } catch (error) {
      if (error.status === 429) {
        console.warn("Rate limit exceeded. Retrying...");
        await waitForRetry(attempt);
      } else {
        console.error("Error generating questions:", error);
        throw new Error("Failed to generate questions from OpenAI");
      }
    }
  }
  throw new Error("Max retries exceeded");
}

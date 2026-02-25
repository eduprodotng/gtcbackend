// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// async function waitForRetry(attempt) {
//   const delay = Math.min(1000 * 2 ** attempt, 30000); // Exponential backoff
//   return new Promise((resolve) => setTimeout(resolve, delay));
// }

// export async function generateDreamContent(topic, className, subject) {
//   // const messages = [
//   //   {
//   //     role: "user",
//   //     content: `
//   //     Generate a detailed lesson note for the following:
//   //     - Topic: ${topic}
//   //     - Class: ${className}
//   //     - Subject: ${subject}

//   //     Include:
//   //     - Objectives
//   //     - Introduction
//   //     - Lesson Body with Subtopics
//   //     - Conclusion
//   //     - Assignments or Questions for Students
//   //     `,
//   //   },
//   // ];

//   const messages = [
//     {
//       role: "user",
//       content: `
//       Generate multiple pictures of the dream the person put

//       `,
//     },
//   ];

//   for (let attempt = 0; attempt < 5; attempt++) {
//     try {
//       const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: messages,
//         max_tokens: 2000,
//         temperature: 0.7,
//       });

//       const lessonNoteContent = response.choices[0].message.content.trim();
//       return lessonNoteContent;
//     } catch (error) {
//       if (error.status === 429) {
//         console.warn("Rate limit exceeded. Retrying...");
//         await waitForRetry(attempt);
//       } else {
//         console.error("Error in generateLessonNoteContent:", error);
//         throw new Error("Failed to generate lesson note content");
//       }
//     }
//   }
//   throw new Error("Max retries exceeded");
// }

import { generateDreamImages } from "../services/openaiService.js";
import Dream from "../models/DreamModel.js";
import { generateImage } from "../services/openaiService.js";

export const generateDream = async (req, res) => {
  const { title, userId } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const imageUrls = await generateImage(title, "1024x1024");

    const dream = new Dream({
      title,
      content: `Images generated for: ${title}`,
      imageUrls,
      userId,
    });

    await dream.save(); // Save to the database

    res.status(201).json({
      message: "Dream generated successfully",
      dream,
    });
  } catch (error) {
    console.error("Error generating dream:", error);
    res.status(500).json({ error: "Failed to generate dream images" });
  }
};

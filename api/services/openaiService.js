import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this environment variable is set
});

async function waitForRetry(attempt) {
  const delay = Math.min(1000 * 2 ** attempt, 30000); // Exponential backoff
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// General function to call OpenAI with retries
export async function callOpenAI(
  messages,
  maxTokens = 1000,
  temperature = 0.7
) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: maxTokens,
        temperature,
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      if (error.status === 429) {
        console.warn("Rate limit exceeded. Retrying...");
        await waitForRetry(attempt);
      } else {
        console.error("OpenAI Error:", error);
        throw new Error("OpenAI API call failed");
      }
    }
  }
  throw new Error("Max retries exceeded");
}
// export async function generateImage(prompt, size = "1024x1024") {
//   for (let attempt = 0; attempt < 5; attempt++) {
//     try {
//       const response = await openai.images.generate({
//         model: "dall-e-3", // or "dall-e-2" if you prefer
//         prompt,
//         n: 1,
//         size,
//       });
//       return response.data[0].url; // Returns the URL of the generated image
//     } catch (error) {
//       if (error.status === 429) {
//         console.warn("Rate limit exceeded. Retrying...");
//         await waitForRetry(attempt);
//       } else {
//         console.error("DALL·E Error:", error);
//         throw new Error("DALL·E API call failed");
//       }
//     }
//   }
//   throw new Error("Max retries exceeded");
// }

// export async function generateImage(
//   prompt,
//   size = "1024x1024",
//   numberOfImages = 10
// ) {
//   for (let attempt = 0; attempt < 5; attempt++) {
//     try {
//       const response = await openai.images.generate({
//         model: "dall-e-3", // or "dall-e-2" if needed
//         prompt,
//         n: numberOfImages, // Request multiple images
//         size,
//       });

//       return response.data.map((image) => image.url); // Return an array of image URLs
//     } catch (error) {
//       if (error.status === 429) {
//         console.warn("Rate limit exceeded. Retrying...");
//         await waitForRetry(attempt);
//       } else {
//         console.error("DALL·E Error:", error);
//         throw new Error("DALL·E API call failed");
//       }
//     }
//   }
//   throw new Error("Max retries exceeded");
// // }
// export async function generateMultipleImages(
//   prompt,
//   size = "1024x1024",
//   numberOfImages = 10
// ) {
//   const imageUrls = [];

//   for (let i = 0; i < numberOfImages; i++) {
//     try {
//       const response = await openai.images.generate({
//         model: "dall-e-3",
//         prompt,
//         n: 1, // DALL·E 3 only supports 1 image per request
//         size,
//       });

//       imageUrls.push(response.data[0].url); // Store the image URL
//     } catch (error) {
//       console.error(`Error generating image ${i + 1}:`, error);
//     }
//   }

//   return imageUrls; // Return an array of generated image URLs
// }
// This function generates multiple images based on the title, size, and optionally a user image.
export const generateMultipleImages = async (
  title,
  size = "1024x1024",
  userImage
) => {
  // Create a custom prompt depending on whether a user image is provided
  const prompt = userImage
    ? `Generate a highly realistic, photorealistic image of "${title}", incorporating the face from this image: ${userImage}.`
    : `Generate a highly realistic, photorealistic image of"${title}".`;

  return await callOpenAIForImages(prompt, size); // Call the DALL·E or OpenAI service with the modified prompt
};

// This is the function that interacts with OpenAI's DALL·E model to generate images.
export async function callOpenAIForImages(
  prompt,
  size = "1024x1024",
  numberOfImages = 1
) {
  const imageUrls = [];

  for (let i = 0; i < numberOfImages; i++) {
    try {
      // Make the API call to generate an image
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1, // DALL·E 3 supports only 1 image per request
        size,
      });

      // Store the generated image URL
      imageUrls.push(response.data[0].url);
    } catch (error) {
      console.error(`Error generating image ${i + 1}:`, error);
    }
  }

  return imageUrls; // Return the array of generated image URLs
}
// Function to call OpenAI dynamically for milestone generation
// export const generateMilestonePlan = async (title) => {
//   const prompt = `Generate a structured milestone plan for achieving the goal of becoming a "${title}". Include 5 key steps with explanations.`;

//   for (let attempt = 0; attempt < 5; attempt++) {
//     try {
//       const response = await openai.chat.completions.create({
//         model: "gpt-4", // Use GPT-4 for better results
//         messages: [{ role: "user", content: prompt }],
//         max_tokens: 500,
//         temperature: 0.7,
//       });

//       return response.choices[0].message.content.trim();
//     } catch (error) {
//       if (error.status === 429) {
//         console.warn("Rate limit exceeded. Retrying...");
//         await waitForRetry(attempt);
//       } else {
//         console.error("OpenAI Error:", error);
//         throw new Error("OpenAI API call failed");
//       }
//     }
//   }
//   throw new Error("Max retries exceeded");
// };
export const generateMilestonePlan = async (title) => {
  const prompt = `Generate a structured milestone plan for achieving the goal of becoming a "${title}". Include 10 to 20 key steps without explanations. Each step should have a timeframe such as "2 years", "1 month", "1 week", or "24 hours". Format the response as a numbered list with each step followed by its timeframe in parentheses. Example format:
  
  1. Complete prerequisite courses (2 years)
  2. Apply to medical school (6 months)
  3. Attend medical school (4 years)`;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      if (error.status === 429) {
        console.warn("Rate limit exceeded. Retrying...");
        await waitForRetry(attempt);
      } else {
        console.error("OpenAI Error:", error);
        throw new Error("OpenAI API call failed");
      }
    }
  }
  throw new Error("Max retries exceeded");
};

const fs = require("fs/promises");
const pdfParse = require("pdf-parse");

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text.slice(0, 3000); // limit for OpenAI
  } catch (err) {
    console.error("PDF parsing error:", err);
    throw err;
  }
}

module.exports = { extractTextFromPDF };

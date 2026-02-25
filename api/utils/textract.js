// utils/textract.js
const {
  TextractClient,
  DetectDocumentTextCommand,
} = require("@aws-sdk/client-textract");
const fs = require("fs");

const textractClient = new TextractClient({ region: process.env.AWS_REGIONS });

async function extractTextFromImageWithTextract(filePath) {
  const fileBytes = fs.readFileSync(filePath);

  const params = {
    Document: {
      Bytes: fileBytes,
    },
  };

  const command = new DetectDocumentTextCommand(params);
  const response = await textractClient.send(command);

  const lines = response.Blocks.filter(
    (block) => block.BlockType === "LINE"
  ).map((line) => line.Text);

  return lines.join("\n");
}

module.exports = { extractTextFromImageWithTextract };

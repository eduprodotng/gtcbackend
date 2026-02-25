import AWS from "aws-sdk";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadImageToS3 = async (imageUrl) => {
  try {
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "arraybuffer", // Get image as buffer
    });

    const fileName = `visions/${uuidv4()}.png`; // Store inside "visions/" folder in S3

    const uploadParams = {
      Bucket: "eduprosolution", // Direct bucket name like in multerS3
      Key: fileName,
      Body: response.data, // Use the buffer directly
      ContentType: "image/png",
      ACL: "private", // Keep it private
      Expires: 60 * 60 * 24 * 7, // 7-day expiry
    };

    const uploadResult = await s3.upload(uploadParams).promise();
    return uploadResult.Location; // Return the S3 file URL
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Failed to upload image to S3");
  }
};

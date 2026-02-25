import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // To load environment variables

// Function to generate JWT token
export const generateJWT = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
  };

  // You can also add other user-specific info to the payload, like roles or permissions
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h", // Set token expiration as per your requirement (e.g., 1 hour)
  });

  return token;
};

// Optional: You can create a refresh token function too
export const generateRefreshToken = (user) => {
  const payload = {
    _id: user._id,
  };

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", // Refresh token can last longer (e.g., 7 days)
  });

  return refreshToken;
};

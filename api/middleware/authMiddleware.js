// import jwt from "jsonwebtoken";

// const authenticateUser = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach user to request object
//     req.user = { id: decoded.id }; // Set user ID as `id` for consistency
//     next();
//   } catch (error) {
//     console.error("Error authenticating token:", error);
//     return res.status(401).json({ message: "Token is not valid" });
//   }
// };

// export default authenticateUser;

import jwt from "jsonwebtoken";

// const authenticateUser = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decoded);
//     // Attach user to request object
//     // req.user = { userId: decoded.id }; // This assumes the payload contains `id` as the user ID

//     req.user = { userId: decoded.userId };

//     next();
//   } catch (error) {
//     console.error("Error authenticating token:", error);
//     return res.status(401).json({ message: "Token is not valid" });
//   }
// };

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("No token found in the request headers");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // if (!decoded.userId) {
    //   console.log("userId missing in token payload:", decoded);
    //   return res.status(401).json({ message: "Invalid token structure" });
    // }

    // req.user = { userId: decoded.userId }; // Ensure `userId` is set correctly
    if (!decoded._id) {
      console.log("_id missing in token payload:", decoded);
      return res.status(401).json({ message: "Invalid token structure" });
    }

    req.user = { _id: decoded._id }; // ✅ Use `_id` now

    next();
  } catch (error) {
    console.error("Error authenticating token:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default authenticateUser;

const User = require("../models/User");
const Session = require("../models/Session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twilioConfig = require("../config/twilio");
const Notifications = require("../mail/notifications");
const mongoose = require("mongoose");
const { getClientIp } = require("../middlewares/ipgetter");

// const { createWalletForUser } = require("./walletController");

// handles user registration
const registerUser = async (req, res) => {
  try {
    let {
      phone,
      username,
      email,
      fullname,
      password,
      photourl,
      tradeSection,
      tech,
      role,
      admNo,
      classRole,
      gender,
      birthday,
      subjectTaught,
      session,
    } = req.body;

    // if (["teacher", "head_of_department"].includes(role) && !tradeSection) {
    //   return res.status(400).json({
    //     status: "error",
    //     message: "Trade section is required for teachers and HODs.",
    //     data: null,
    //   });
    // }
    // ✅ Only enforce tradeSection for HODs, not teachers
    if (role === "head_of_department" && !tradeSection) {
      return res.status(400).json({
        status: "error",
        message: "Trade section is required for HODs.",
        data: null,
      });
    }

    // Normalize input
    phone = (phone || "").toString().trim();
    email = (email || "").toString().trim().toLowerCase();
    password = (password || "").toString();
    role = (role || "").toString().trim().toLowerCase();

    // Validate role
    const allowedRoles = [
      "principal",
      "vice_principal",
      "head_of_department",
      "teacher",
      "student",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid role provided. Allowed roles are: " +
          allowedRoles.join(", "),
        data: null,
      });
    }
    if (role === "student" && !tech) {
      return res.status(400).json({
        status: "error",
        message: "Tech is required for students.",
        data: null,
      });
    }
    if (!session || (Array.isArray(session) && session.length === 0)) {
      return res.status(400).json({
        status: "error",
        message: "Session is required for all roles.",
        data: null,
      });
    }

    // Validate required fields
    if (!email || !phone || !fullname || !password || !role) {
      return res.status(400).json({
        status: "error",
        message:
          "All required fields must be provided (email, phone, fullname, password, role).",
        data: null,
      });
    }

    // Check for existing user
    const existing = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      return res.status(400).json({
        status: "error",
        message: "User with the same email or phone number already exists.",
        data: null,
      });
    }
    birthday = birthday ? new Date(birthday) : null;

    // Create user
    const user = await User.createUser({
      phone,
      username,
      email,
      fullname,
      password,
      photourl,
      role,
      tech,
      tradeSection,
      admNo,
      classRole,
      gender,
      birthday,
      subjectTaught,
      session,
    });

    return res.status(201).json({
      status: "success",
      message: `User registered successfully as ${role}.`,
      data: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        photourl: user.photourl,
        tradeSection: user.tradeSection,
        role: user.role,
        tech: user.tech,
        admNo: user.admNo,
        classRole: user.classRole,
        gender: user.gender,
        birthday: user.birthday,
        subjectTaught: user.subjectTaught,
        session: user.session,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      // data: user,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({
      status: "error",
      message: "Registration failed.",
      data: error.message || error,
    });
  }
};

const updateUserById = async (req, res) => {
  const userId = req.params.id;

  const {
    fullname,
    username,
    email,
    phone,
    address,
    gender,
    birthday,
    photourl,
    password,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (fullname) user.fullname = fullname;
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (gender) user.gender = gender;
    if (birthday) user.birthday = new Date(birthday);
    if (photourl) user.photourl = photourl;
    if (password && password.length >= 8) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        birthday: user.birthday,
        photourl: user.photourl,
      },
    });
  } catch (error) {
    console.error("Error in updateUserById:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update user",
      data: error.message,
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        status: "error",
        message: "Student ID is required.",
        data: null,
      });
    }

    const student = await User.findOne({
      _id: studentId,
      role: "student",
    }).select("-password -refreshToken");

    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found.",
        data: null,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Student retrieved successfully.",
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve student.",
      data: error.message || error,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required.",
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: `User (${user.fullname}) deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete user.",
      data: error.message || error,
    });
  }
};

const getStudentDetailsWithSession = async (req, res) => {
  try {
    const { studentId, sessionId } = req.params;

    if (!studentId || !sessionId) {
      return res.status(400).json({
        status: "error",
        message: "Student ID and Session ID are required.",
      });
    }

    const student = await User.findOne({
      _id: studentId,
      role: "student",
    })
      .populate("tradeSection", "name") // populate only the name field
      .select("-password -refreshToken");

    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found.",
        data: null,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Student retrieved successfully.",
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve student.",
      data: error.message || error,
    });
  }
};
// controllers/userController.js

const allowedRoles = [
  "student",
  "teacher",
  "parent",
  "admin",
  "principal",
  "vice_principal",
  "head_of_department",
];

// GET /api/users/:role/:sessionId
const getUsersByRoleAndSession = async (req, res) => {
  try {
    const { role, sessionId } = req.params;

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role provided." });
    }

    const users = await User.find({
      role,
      session: { $in: [sessionId] },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersByRoleAndSession:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// const getAllHODs = async (req, res) => {
//   try {
//     const hods = await User.find({ role: "head_of_department" }).select(
//       "_id fullname username email phone"
//     );

//     res.status(200).json(hods);
//   } catch (error) {
//     console.error("Error fetching HODs:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch HODs.",
//       data: error.message || error,
//     });
//   }
// };
const getAllHODs = async (req, res) => {
  try {
    const sessionId = req.query.session;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        status: "error",
        message: "Valid session ID is required.",
        data: null,
      });
    }

    const hods = await User.find({
      role: "head_of_department",
      session: mongoose.Types.ObjectId(sessionId),
    }).select("_id fullname username email phone");

    res.status(200).json(hods);
  } catch (error) {
    console.error("Error fetching HODs:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch HODs.",
      data: error.message || error,
    });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        status: "error",
        message: "Valid session ID is required.",
        data: null,
      });
    }

    const teachers = await User.find({
      role: "teacher",
      session: mongoose.Types.ObjectId(sessionId),
    }).select("_id fullname username email phone");

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch teachers.",
      data: error.message || error,
    });
  }
};
const getAllVice = async (req, res) => {
  try {
    const sessionId = req.query.session;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        status: "error",
        message: "Valid session ID is required.",
        data: null,
      });
    }

    const hods = await User.find({
      role: "vice_principal",
      session: mongoose.Types.ObjectId(sessionId),
    }).select("_id fullname username email phone");

    res.status(200).json(hods);
  } catch (error) {
    console.error("Error fetching Vice", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch Vice.",
      data: error.message || error,
    });
  }
};
const addSessionToUsersWithoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    // Validate sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Bulk update users to include the sessionId if they don't already have one
    const updateResult = await User.updateMany(
      { session: { $exists: false } }, // Find users without a session field
      { $set: { session: sessionId } } // Set the session field
    );

    res.status(200).json({
      message: "Users updated successfully",
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const registerUsersBulk = async (req, res) => {
  try {
    const users = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({
        status: "error",
        message: "Request body must be an array of user objects.",
      });
    }

    const allowedRoles = [
      "principal",
      "vice_principal",
      "head_of_department",
      "teacher",
      "student",
    ];

    const createdUsers = [];

    for (const userData of users) {
      const {
        phone,
        email,
        password,
        fullname,
        role,
        tech,
        tradeSection,
        username,
      } = userData;

      // Normalize
      userData.phone = (phone || "").toString().trim();
      userData.email = (email || "").toLowerCase().trim();
      userData.password = (password || "").toString().trim();
      userData.role = (role || "").toLowerCase().trim();

      // Validations
      if (
        !userData.email ||
        !userData.phone ||
        !userData.fullname ||
        !userData.password ||
        !userData.role
      ) {
        continue; // Skip invalid users
      }

      if (!allowedRoles.includes(userData.role)) {
        continue;
      }

      if (userData.role === "student" && !tech) {
        continue;
      }

      const existing = await User.findOne({
        $or: [{ email: userData.email }, { phone: userData.phone }],
      });

      if (existing) {
        continue;
      }

      // Optional defaulting
      userData.birthday = userData.birthday
        ? new Date(userData.birthday)
        : null;
      userData.username = username || userData.fullname;

      const newUser = await User.createUser(userData);
      createdUsers.push(newUser);
    }

    return res.status(201).json({
      status: "success",
      message: `Successfully registered ${createdUsers.length} user(s).`,
      data: createdUsers,
    });
  } catch (err) {
    console.error("Bulk registration error:", err);
    return res.status(500).json({
      status: "error",
      message: "Bulk registration failed.",
      data: err.message,
    });
  }
};

module.exports = {
  registerUsersBulk,
};

// const updateUserProfile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { fullname, email } = req.body;

//     // Optional: sanitize inputs
//     const updatedData = {};
//     if (fullname) updatedData.fullname = fullname.trim();
//     if (email) updatedData.email = email.trim().toLowerCase();

//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { $set: updatedData },
//       { new: true } // return updated document
//     );

//     if (!updatedUser) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found.",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       message: "Profile updated successfully.",
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong.",
//     });
//   }
// };

const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, password, confirmPassword } = req.body;

    const updatedData = {};
    if (fullname) updatedData.fullname = fullname.trim();
    if (email) updatedData.email = email.trim().toLowerCase();

    // Handle password update
    if (password || confirmPassword) {
      if (!password || !confirmPassword || password !== confirmPassword) {
        return res.status(400).json({
          status: "error",
          message: "Passwords must match and not be empty.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong.",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT `verify` middleware
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required to delete your account." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete Account Error:", err);
    res.status(500).json({ message: "Server error deleting account." });
  }
};

const getProfileByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const data = await User.getProfileByUserId(userId);
    console.log("User data from DB:", data);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "User profile not found.",
      });
    }

    const { _id, phone, email, fullname, photourl, createdAt, updatedAt } =
      data;

    const userProfile = {
      id: _id,
      phone,
      email,
      fullname, // <- Here
      photourl,
      createdAt,
      updatedAt,
    };

    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully.",
      data: userProfile,
    });
  } catch (error) {
    console.error("Error in getProfileByUserId:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve profile.",
      error: error.message,
    });
  }
};

// GET /api/auth/profile (uses JWT token to identify user)
const getAuthenticatedUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from verify middleware

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("❌ Error fetching authenticated user profile:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user profile",
    });
  }
};

// // handles user login
// const login = async (req, res) => {
//   const { email, phone, password } = req.body;
//   let today = new Date().toISOString().slice(0, 10);

//   try {
//     const user = await User.findByEmail(email);

//     if (user != null) {
//       const validPass = await bcrypt.compare(password, user.password);
//       if (!validPass) {
//         return res.status(400).send({
//           status: "error",
//           message: "Invalid password",
//           data: null,
//         });
//       }

//       const accessToken = generateAccessToken({
//         id: user.id,
//         email: user.email,
//         phone: user.phone,
//       });
//       const refreshToken = jwt.sign(
//         {
//           id: user.id,
//           email: user.email,
//           phone: user.phone,
//         },
//         process.env.REFRESH_TOKEN_SECRET
//       );

//       // Store refresh token
//       const storereFreshToken = await User.storeRefreshToken(refreshToken);

//       // Creates Secure Cookie with refresh token
//       res.cookie("jwt", refreshToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "None",
//         maxAge: 24 * 60 * 60 * 1000,
//       });

//       const currentDate = new Date().toISOString();

//       res.status(200).send({
//         status: "success",
//         message: "Login was successful",
//         data: { accessToken: accessToken, refreshToken: refreshToken },
//       });
//     } else {
//       const user = await User.findByPhone(phone);

//       if (user != null) {
//         const validPass = await bcrypt.compare(password, user.password);
//         if (!validPass) {
//           return res.status(400).send({
//             status: "error",
//             message: "Invalid password",
//             data: null,
//           });
//         }

//         const accessToken = generateAccessToken({
//           id: user.id,
//           email: user.email,
//           phone: user.phone,
//           lat: user.lat,
//           lon: user.lon,
//           role_id: user.role_id,
//         });
//         const refreshToken = jwt.sign(
//           {
//             id: user.id,
//             email: user.email,
//             phone: user.phone,
//             lat: user.lat,
//             lon: user.lon,
//             role_id: user.role_id,
//           },
//           process.env.REFRESH_TOKEN_SECRET
//         );

//         // Store refresh token
//         const storereFreshToken = await User.storeRefreshToken(refreshToken);

//         // Creates Secure Cookie with refresh token
//         res.cookie("jwt", refreshToken, {
//           httpOnly: true,
//           secure: true,
//           sameSite: "None",
//           maxAge: 24 * 60 * 60 * 1000,
//         });

//         const currentDate = new Date().toISOString();

//         res.status(200).send({
//           status: "success",
//           message: "Login was successful",
//           data: { accessToken: accessToken, refreshToken: refreshToken },
//         });
//       } else {
//         res.status(400).send({
//           status: "error",
//           message: "Email/Phone or password is not correct",
//           data: null,
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Login Error:", error); // <-- Add this
//     res
//       .status(500)
//       .json({ status: "error", message: "Failed to login user.", data: error });
//   }
// };

// const refreshToken = async (req, res) => {
//   const refreshToken = req.body.token;
//   if (refreshToken == null) return res.sendStatus(401);

//   const token = await User.getRefreshToken(refreshToken);
//   if (token && token.length < 0) return res.sendStatus(403);

//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
//     if (error) return res.sendStatus(403);
//     const accessToken = generateLongLiveAccessToken({
//       id: user.id,
//       email: user.email,
//       phone: user.phone,
//       lat: user.lat,
//       lon: user.lon,
//       role_id: user.role_id,
//     });

//     res.status(200).send({
//       status: "success",
//       message: "Refresh token retrieved successfully",
//       data: { accessToken: accessToken },
//     });
//   });
// };

// const login = async (req, res) => {
//   let { email, password } = req.body;

//   // Normalize email: trim and lowercase
//   email = email?.trim().toLowerCase();

//   console.log("Login attempt:", {
//     email,
//     password: password ? "****" : password,
//   });

//   try {
//     if (!email || !password) {
//       console.log("Login failed: Missing email or password");
//       return res.status(400).send({
//         status: "error",
//         message: "Email and password are required",
//         data: null,
//       });
//     }

//     const user = await User.findByEmail(email);
//     console.log(
//       "User lookup result:",
//       user ? `Found user with email ${email}` : "No user found"
//     );

//     if (!user) {
//       console.log("Login failed: User not found");
//       return res.status(400).send({
//         status: "error",
//         message: "Email or password is not correct",
//         data: null,
//       });
//     }

//     const validPass = await bcrypt.compare(password, user.password);
//     console.log("Password valid:", validPass);

//     if (!validPass) {
//       console.log("Login failed: Invalid password");
//       return res.status(400).send({
//         status: "error",
//         message: "Email or password is not correct",
//         data: null,
//       });
//     }

//     const accessToken = generateAccessToken({
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     });

//     const refreshToken = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.REFRESH_TOKEN_SECRET
//     );

//     await User.storeRefreshToken(user.id, refreshToken);
//     console.log("Stored refresh token for user:", user.id);

//     res.cookie("jwt", refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "None",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     console.log("Login successful for user:", user.email);

//     res.status(200).send({
//       status: "success",
//       message: "Login was successful",
//       data: { accessToken, refreshToken, user },
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to login user.",
//       data: error.message || error,
//     });
//   }
// };
// const login = async (req, res) => {
//   let { identifier, password } = req.body;

//   if (!identifier || !password) {
//     return res.status(400).send({
//       status: "error",
//       message: "Username, email, or full name and password are required.",
//       data: null,
//     });
//   }

//   const loginId = identifier.trim().toLowerCase();

//   try {
//     // 🔍 Find user by email, username, or full name (case-insensitive)
//     const user = await User.findOne({
//       $or: [
//         { email: loginId },
//         { username: new RegExp(`^${loginId}$`, "i") },
//         { fullname: new RegExp(`^${loginId}$`, "i") },
//       ],
//     });

//     if (!user) {
//       return res.status(400).send({
//         status: "error",
//         message: "Invalid login credentials.",
//         data: null,
//       });
//     }

//     const validPass = await bcrypt.compare(password, user.password);
//     if (!validPass) {
//       return res.status(400).send({
//         status: "error",
//         message: "Invalid login credentials.",
//         data: null,
//       });
//     }

//     const accessToken = generateAccessToken({
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     });

//     const refreshToken = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.REFRESH_TOKEN_SECRET
//     );

//     await User.storeRefreshToken(user.id, refreshToken);

//     res.cookie("jwt", refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "None",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.status(200).send({
//       status: "success",
//       message: "Login was successful",
//       data: { accessToken, refreshToken, user },
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to login user.",
//       data: error.message || error,
//     });
//   }
// };

 const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Find the user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).exec();

    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Log the provided password and the stored hashed password
    console.log("Password provided by user:", password);
    console.log("Stored hashed password for user:", user.password);

    // Compare provided password with hashed password
    const isPasswordValid = bcrypt.compareSync(password, user.password); // Using compareSync for logging consistency
    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", identifier);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const role = user.role;

    // Generate a token if the password is correct
    const token = jwt.sign({ user, role }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};
const refreshToken = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);

  const tokenExists = await User.getRefreshToken(refreshToken);
  if (!tokenExists) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      phone: user.phone,
    });

    res.status(200).send({
      status: "success",
      message: "Refresh token retrieved successfully",
      data: { accessToken },
    });
  });
};

const refreshTokenWeb = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const token = await User.getRefreshToken(refreshToken);
  if (token && token.length < 0) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) return res.json(error);
    const accessToken = generateLongLiveAccessToken({
      id: user.id,
      email: user.email,
      phone: user.phone,
      lat: user.lat,
      lon: user.lon,
      role_id: user.role_id,
    });

    // Store refresh token
    const storereFreshToken = User.storeRefreshToken(accessToken);

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).send({
      status: "success",
      message: "Refresh token retrieved successfully",
      data: { id: user.id, accessToken: accessToken },
    });
  });
};

const changePassword = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { password, newPassword } = req.body;

  if (password != null && newPassword != null) {
    try {
      const user = await User.findById(userId);

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return res.status(400).send({
          status: "error",
          message: "Invalid password",
          data: null,
        });
      }

      const hashedPassword = newPassword
        ? await bcrypt.hash(newPassword, 10)
        : null;
      const data = await User.resetPassword(userId, hashedPassword);

      res.status(201).json({
        status: "success",
        message: "Password reset was successful",
        data: data,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Registration failed." });
    }
  } else {
    return res.status(400).send({
      status: "error",
      message: "missing parameters",
      data: null,
    });
  }
};

const sendVerificationCode = async (req, res) => {
  const { phone } = req.body;

  try {
    // Send a verification code
    const verification = await twilioConfig.sendVerificationCode(phone);
    res.status(200).json({
      status: "success",
      message: "Verification code sent.",
      data: verification,
    });
  } catch (error) {
    console.error("Twilio Test Error:", error.message);
    res.status(400).json({
      status: "Twilio error",
      message: "An error occured. Try again",
      data: error.message,
    });
  }
};
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "12h" });
}
const verifyPhone = async (req, res) => {
  const { phone, code } = req.body;

  try {
    const isVerified = await twilioConfig.verifyCode(phone, code);

    res.status(200).json({
      status: "success",
      message: "Verification was successful.",
      data: isVerified,
    });
  } catch (error) {
    console.error("Twilio Test Error:", error.message);
    res.status(400).json({
      status: "Twilio error",
      message: "An error occured. Try again",
      data: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const data = await User.verifyEmail(email, code);
    if (data != null) {
      res.status(200).json({
        status: "success",
        message: "Verification was successfully.",
        data: data,
      });
      //await User.updateVerificationStatus(email, 1);
    } else {
      res
        .status(400)
        .json({ status: "error", message: "Verification failed", data: null });
    }
  } catch (error) {
    console.error("error:", error.message);
    res.status(500).json({
      status: "error",
      message: "An error occured. Try again",
      data: error.message,
    });
  }
};

const resendEmailVerirficationCode = async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(1000 + Math.random() * 9000);

  try {
    if (email != null) {
      let user;
      const check = await User.checkVerificationExist(email);
      if (check != null) {
        user = await User.updateVerificationCode(email, code);
      } else {
        user = await User.insertVerificationCode(email, code);
      }

      const data = { recepient_name: "there", code: code };
      await Notifications.whenUserRegister(email, data);

      res.status(200).json({
        status: "success",
        message: "Verification resent successfully.",
        data: user,
      });
    }
  } catch (error) {
    console.error("error:", error.message);
    res.status(500).json({
      status: "error",
      message: "An error occured. Try again",
      data: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findByEmail(email);
    console.log("User found by email:", user);
    if (user == null) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found", data: null });
    }

    const userId = user.id;
    const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Store token in DB
    await User.storeResetPasswordToken(userId, token);

    // Send Reset Email
    const resetLink = `${process.env.FRONTEND_URL}/reset-psw?token=${token}`;
    const data = {
      recepient_name: user.firstname,
      link: resetLink,
      code: token,
    };
    await Notifications.whenPasswordReset(email, data);

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email",
      data: email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;

    // Check if token is valid
    const tokenQuery = await User.getPasswordResetTokens(token, userId);
    if (tokenQuery == null) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired token",
        data: null,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    await User.resetPassword(userId, hashedPassword);

    // Delete the used token
    await User.deletePasswordResetTokens(token);

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
      data: [],
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "error",
      message: "Invalid or expired token",
      data: null,
    });
  }
};

module.exports = {
  registerUser,
  login,
  registerUsersBulk,
  deleteAccount,
  refreshToken,
  refreshTokenWeb,
  resetPassword,
  verifyPhone,
  getStudentById,
  sendVerificationCode,
  verifyEmail,
  resendEmailVerirficationCode,
  getProfileByUserId,
  getAllVice,
  updateUserProfile,
  forgotPassword,
  addSessionToUsersWithoutSession,
  getStudentDetailsWithSession,
  getUsersByRoleAndSession,
  getAllTeachers,
  changePassword,
  getAllHODs,
  deleteUser,
  getAuthenticatedUserProfile,
  updateUserById,
};

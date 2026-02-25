const Skill = require("../models/Skill");
const pool = require("../config/db");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  createConnectedAccount,
  generateAccountLink,
  processSplitPayment,
} = require("../utils/stripe");

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    const updatedUser = await User.update(userId, updates);
    res.status(200).json({
      status: "success",
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to update user." });
  }
};

exports.changeNotificationType = async (req, res) => {
  const userId = req.user.id;
  const { notification_type } = req.body;

  try {
    const updatedNotification = await User.changeNotificationType(
      userId,
      notification_type
    );
    res.status(200).json({
      status: "success",
      message: "Notification type updated successfully.",
      data: updatedNotification,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update notification type.",
    });
  }
};

exports.changeAppearanceMode = async (req, res) => {
  const userId = req.user.id;
  const { appearance_mode } = req.body;

  try {
    const mode = await User.changeAppearanceMode(userId, appearance_mode);
    res.status(200).json({
      status: "success",
      message: "Appearance mode updated successfully.",
      data: mode,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to update appearance mode." });
  }
};

// exports.getProfileByUserId = async (req, res) => {
//   const userId = parseInt(req.params.id);

//   try {
//     const data = await User.getProfileByUserId(userId);

//     if (data.length === 0) {
//       return res
//         .status(404)
//         .json({
//           status: "error",
//           message: "User profile not found.",
//           data: data,
//         });
//     }

//     const {
//       id,
//       phone,
//       email,
//       firstname,
//       lastname,
//       gender,
//       notification_type,
//       appearance_mode,
//       photourl,
//       bio,
//       spark_token_balance,
//       cash_balance,
//       total_followers,
//       total_following,
//       location,
//       street,
//       zip_code,
//       created_at,
//       updated_at,
//       referral_code,
//       website,
//     } = data[0];

//     // Map skills to an array
//     const skills = data[0].skills.map((item) => ({
//       skill_id: item.skill_id,
//       description: item.description,
//       skill_type: item.skill_type,
//       experience_level: item.experience_level,
//       hourly_rate: item.hourly_rate,
//       thumbnail01: item.thumbnail01,
//       thumbnail02: item.thumbnail02,
//       thumbnail03: item.thumbnail03,
//       thumbnail04: item.thumbnail04,
//     }));

//     const userProfile = {
//       id,
//       phone,
//       email,
//       firstname,
//       lastname,
//       gender,
//       notification_type,
//       appearance_mode,
//       photourl,
//       bio,
//       spark_token_balance,
//       cash_balance,
//       total_followers,
//       total_following,
//       location,
//       street,
//       zip_code,
//       referral_code,
//       website,
//       created_at,
//       updated_at,
//       skills: skills,
//     };

//     res
//       .status(200)
//       .json({
//         status: "success",
//         message: "User profile retrieved successfully.",
//         data: userProfile,
//       });
//   } catch (error) {
//     console.error("Error in getProfileByUserId:", error);
//     res
//       .status(500)
//       .json({
//         status: "error",
//         message: "Failed to retrieve profile.",
//         error: error.message,
//       });
//   }
// };
exports.getProfileByUserId = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const data = await User.getProfileByUserId(userId);

    if (data.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User profile not found.",
        data: data,
      });
    }

    const {
      id,
      phone,
      email,
      firstname,
      lastname,
      gender,
      notification_type,
      appearance_mode,
      photourl,
      bio,
      spark_token_balance,
      cash_balance,
      total_followers,
      total_following,
      location,
      street,
      zip_code,
      created_at,
      updated_at,
      referral_code,
      website,
    } = data[0];

    // Map skills to an array
    const skills = data[0].skills.map((item) => ({
      skill_id: item.skill_id,
      description: item.description,
      skill_type: item.skill_type,
      experience_level: item.experience_level,
      hourly_rate: item.hourly_rate,
      thumbnail01: item.thumbnail01,
      thumbnail02: item.thumbnail02,
      thumbnail03: item.thumbnail03,
      thumbnail04: item.thumbnail04,
    }));

    const userProfile = {
      id,
      phone,
      email,
      firstname,
      lastname,
      gender,
      notification_type,
      appearance_mode,
      photourl,
      bio,
      spark_token_balance,
      cash_balance,
      total_followers,
      total_following,
      location,
      street,
      zip_code,
      referral_code,
      website,
      created_at,
      updated_at,
      skills: skills,
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

// exports.getBasiceProfileByUserId = async (req, res) => {
//   const userId = parseInt(req.params.id);

//   try {
//     const data = await User.getProfileByUserId(userId);

//     if (data.length === 0) {
//       return res.status(404).json({
//         status: "error",
//         message: "User profile not found.",
//         data: data,
//       });
//     }

//     const {
//       id,
//       phone,
//       email,
//       firstname,
//       lastname,
//       gender,
//       notification_type,
//       appearance_mode,
//       photourl,
//       bio,
//       total_followers,
//       total_following,
//       location,
//       street,
//       zip_code,
//       referral_code,

//       website,
//     } = data[0];

//     // Map skills to an array
//     const skills = data[0].skills.map((item) => ({
//       skill_id: item.skill_id,
//       description: item.description,
//       skill_type: item.skill_type,
//       spark_token: item.spark_token || 0,
//       experience_level: item.experience_level,
//       hourly_rate: item.hourly_rate,
//       thumbnail01: item.thumbnail01,
//       thumbnail02: item.thumbnail02,
//       thumbnail03: item.thumbnail03,
//       thumbnail04: item.thumbnail04,
//     }));

//     const userProfile = {
//       id,
//       phone,
//       email,
//       firstname,
//       lastname,
//       gender,
//       notification_type,
//       appearance_mode,
//       photourl,
//       bio,
//       total_followers,
//       total_following,
//       location,
//       street,
//       zip_code,
//       referral_code,
//       website,

//       skills: skills,
//     };

//     res.status(200).json({
//       status: "success",
//       message: "User profile retrieved successfully.",
//       data: userProfile,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ status: "error", message: "Failed to retrieve profile." });
//   }
// };

// Controller function to compare SparkTokens
// exports.compareSparkTokens = async (req, res) => {
//   const { userId, skillId } = req.body; // userId: ID of the logged-in user, skillId: the skill for payment

//   try {
//     // Fetch the user's data (including their SparkTokens)
//     const user = await User.findById(userId);
//     const skill = await Skill.findSkill(skillId);

//     // Check if user and skill exist
//     if (!user || !skill) {
//       return res.status(404).json({ message: "User or skill not found" });
//     }

//     const userTokens = user.sparkTokens; // User's available SparkTokens
//     const skillTokensRequired = skill.sparkTokensRequired; // Tokens required for this skill

//     // Compare the tokens
//     if (userTokens >= skillTokensRequired) {
//       // If user has enough tokens
//       return res
//         .status(200)
//         .json({ message: "Sufficient SparkTokens", canPay: true });
//     } else {
//       // If user does not have enough tokens
//       return res
//         .status(400)
//         .json({ message: "Insufficient SparkTokens", canPay: false });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.compareSparkTokens = async (req, res) => {
//   const { userId, skillId } = req.body; // userId: ID of the logged-in user, skillId: the skill for payment

//   try {
//     // Log the incoming userId and skillId to verify
//     console.log("Received userId:", userId, "and skillId:", skillId);

//     // Fetch the user's data (including their SparkTokens)
//     const user = await User.findById(userId); // Already correct
//     const skill = await Skill.findSkill(skillId, userId); // ✅ Fixed

//     // Log the user and skill objects to verify what is being fetched
//     console.log("Fetched user data:", user);
//     console.log("Fetched skill data:", skill);

//     // Check if user and skill exist
//     if (!user || !skill) {
//       console.log("User or skill not found.");
//       return res.status(404).json({ message: "User or skill not found" });
//     }

//     const userTokens = user.sparkTokens || 0; // User's available SparkTokens (if not defined, default to 0)
//     const skillTokensRequired = skill.spark_token || 0; // Tokens required for this skill (ensure spark_token exists)

//     // Log the tokens to verify they are being correctly retrieved
//     console.log("User's available SparkTokens:", userTokens);
//     console.log("Skill's required SparkTokens:", skillTokensRequired);

//     // Ensure the user and skill both have tokens before proceeding
//     if (skillTokensRequired === null || skillTokensRequired === undefined) {
//       console.log("Skill does not have a valid spark_token.");
//       return res
//         .status(400)
//         .json({ message: "Skill does not have a valid spark_token" });
//     }

//     if (userTokens === undefined) {
//       console.log("User does not have SparkTokens.");
//       return res
//         .status(400)
//         .json({ message: "User does not have SparkTokens" });
//     }

//     // Compare the tokens
//     if (userTokens >= skillTokensRequired) {
//       // If user has enough tokens
//       console.log("User has sufficient SparkTokens.");
//       return res
//         .status(200)
//         .json({ message: "Sufficient SparkTokens", canPay: true });
//     } else {
//       // If user does not have enough tokens
//       console.log("User does not have sufficient SparkTokens.");
//       return res
//         .status(400)
//         .json({ message: "Insufficient SparkTokens", canPay: false });
//     }
//   } catch (error) {
//     console.error("Error occurred while comparing SparkTokens:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.compareSparkTokens = async (req, res) => {
//   const { userId, skillId } = req.body;

//   try {
//     console.log("Received userId:", userId, "and skillId:", skillId);

//     // Get the skill they want to "buy"
//     const targetSkill = await Skill.findSkill(skillId, userId);
//     if (!targetSkill) {
//       return res.status(404).json({ message: "Skill not found" });
//     }

//     const requiredTokens = parseInt(targetSkill.spark_token) || 0;
//     console.log("Skill's required SparkTokens:", requiredTokens);

//     if (!requiredTokens || isNaN(requiredTokens)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid spark_token for target skill" });
//     }

//     // Get all of the user's skills (excluding the current skillId)
//     const userSkills = await Skill.find({
//       user_id: userId,
//       _id: { $ne: skillId },
//     });

//     // Check if any of the user's skills have spark_token >= requiredTokens
//     const hasSufficientSkill = userSkills.some((skill) => {
//       const tokenValue = parseInt(skill.spark_token) || 0;
//       return tokenValue >= requiredTokens;
//     });

//     if (hasSufficientSkill) {
//       return res
//         .status(200)
//         .json({ message: "Sufficient SparkTokens", canPay: true });
//     } else {
//       return res
//         .status(400)
//         .json({ message: "Insufficient SparkTokens", canPay: false });
//     }
//   } catch (error) {
//     console.error("Error occurred while comparing SparkTokens:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.getBasiceProfileByUserId = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const data = await User.getProfileByUserId(userId);

    if (data.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User profile not found.",
        data: data,
      });
    }

    // Fetch wallet info
    const walletResult = await pool.query(
      "SELECT * FROM wallet WHERE user_id = $1",
      [userId]
    );
    const wallet = walletResult.rows[0] || {
      balance: 0,
      spark_tokens: 0,
      currency: "gbp",
    };

    const {
      id,
      phone,
      email,
      firstname,
      lastname,
      gender,
      notification_type,
      appearance_mode,
      photourl,
      bio,
      total_followers,
      total_following,
      location,
      street,
      zip_code,
      referral_code,
      website,
    } = data[0];

    const skills = data[0].skills.map((item) => ({
      skill_id: item.skill_id,
      description: item.description,
      skill_type: item.skill_type,
      spark_token: item.spark_token || 0,
      experience_level: item.experience_level,
      hourly_rate: item.hourly_rate,
      thumbnail01: item.thumbnail01,
      thumbnail02: item.thumbnail02,
      thumbnail03: item.thumbnail03,
      thumbnail04: item.thumbnail04,
    }));

    const userProfile = {
      id,
      phone,
      email,
      firstname,
      lastname,
      gender,
      notification_type,
      appearance_mode,
      photourl,
      bio,
      total_followers,
      total_following,
      location,
      street,
      zip_code,
      referral_code,
      website,
      wallet: {
        balance: wallet.balance,
        spark_tokens: wallet.spark_tokens,
        currency: wallet.currency,
      },
      skills,
    };

    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully.",
      data: userProfile,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve profile.",
    });
  }
};

exports.compareSparkTokens = async (req, res) => {
  const userId = req.user.id; // securely from token (logged-in user's ID)
  const { skillId, targetUserId } = req.body; // skillId and targetUserId passed in the request body

  try {
    console.log(
      "Checking SparkTokens for logged-in userId:",
      userId,
      "target skillId (owned by another user, targetUserId):",
      skillId,
      "targetUserId:",
      targetUserId
    );

    // Step 1: Get the target skill owned by the target user (targetUserId)
    const targetSkill = await Skill.findSkill(skillId, targetUserId); // Find skill with skillId for targetUserId

    if (!targetSkill) {
      return res
        .status(404)
        .json({ message: "Target skill not found for the other user" });
    }

    // Step 2: Get the required tokens from the target skill (the other user's skill)
    const requiredTokens = parseInt(targetSkill.spark_token);
    if (!requiredTokens || isNaN(requiredTokens)) {
      return res
        .status(400)
        .json({ message: "Invalid spark_token in target skill" });
    }

    // Step 3: Get all the skills of the logged-in user
    const allUserSkillsQuery = await pool.query(
      "SELECT * FROM skills WHERE user_id = $1", // Get skills of logged-in user
      [userId]
    );
    const userSkills = allUserSkillsQuery.rows;

    if (!userSkills || userSkills.length === 0) {
      return res.status(400).json({ message: "User has no skills" });
    }

    console.log("Logged-in user skills:", userSkills);

    // Step 4: Check if the logged-in user has enough SparkTokens in any of their skills
    const hasEnoughTokens = userSkills.some((skill) => {
      const userToken = parseInt(skill.spark_token);
      return !isNaN(userToken) && userToken >= requiredTokens;
    });

    if (hasEnoughTokens) {
      return res
        .status(200)
        .json({ message: "Sufficient SparkTokens", canPay: true });
    } else {
      return res
        .status(400)
        .json({ message: "Insufficient SparkTokens", canPay: false });
    }
  } catch (error) {
    console.error("Error comparing SparkTokens:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBasiceProfileByUserName = async (req, res) => {
  const name = req.params.name;

  try {
    console.log("Searching for user:", name);
    const data = await User.getProfileByUserName(name);
    console.log("User data:", data);
    if (data.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User profile not found.",
        data: data,
      });
    }

    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully.",
      data: data,
    });
  } catch (error) {
    console.error("Database error:", error.message, error.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve profile.",
      error: error.message,
    });
  }
};

// exports.profilePhotoUpload = async (req, res) => {
//   const userId = req.user.id;

//   if (req.filePaths != null) {
//     const filePath = req.filePaths;
//     //console.log("PTH ", filePath)
//     const file = filePath.slice(15);

//     try {
//       const mode = await User.changeAvatar(userId, file);
//       res.status(200).json({
//         status: "success",
//         message: "Profile photo updated successfully",
//         data: mode,
//       });
//     } catch (error) {
//       res
//         .status(500)
//         .json({ status: "error", message: "Failed to upload photo" });
//     }
//   } else {
//     res.status(400).send({
//       status: "error",
//       message: "No image found",
//       data: null,
//     });
//   }
// };
exports.profilePhotoUpload = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No image found",
        data: null,
      });
    }

    const fileUrl = req.file.location; // S3 URL

    // Store file URL in the database (Assuming `changeAvatar` updates the DB)
    const mode = await User.changeAvatar(userId, fileUrl);

    return res.status(200).json({
      status: "success",
      message: "Profile photo updated successfully",
      data: mode,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to upload photo",
      error: error.message,
    });
  }
};

exports.profilePhotoUploadS3 = async (req, res) => {
  const userId = req.user.id;
  const filePath = req.file.location;

  if (filePath != null) {
    //console.log("PTH ", filePath)

    try {
      const mode = await User.changeAvatar(userId, filePath);
      res.status(200).json({
        status: "success",
        message: "Profile photo updated successfully",
        data: mode,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Failed to upload photo" });
    }
  } else {
    res.status(400).send({
      status: "error",
      message: "No image found",
      data: null,
    });
  }
};

exports.updateBio = async (req, res) => {
  const userId = req.user.id;

  try {
    const mode = await User.updateBio(userId, req.body);
    res.status(200).json({
      status: "success",
      message: "Bio updated successfully",
      data: mode,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to update bio" });
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.user.id; //parseInt(req.params.id);
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
        .json({ status: "error", message: "Password reset failed." });
    }
  } else {
    return res.status(400).send({
      status: "error",
      message: "missing parameters",
      data: null,
    });
  }
};

exports.nearByUsers = async (req, res) => {
  const userId = req.user.id;
  const lat = req.params.lat;
  const lon = req.params.lon;
  const rad = req.params.radius ? req.params.radius : 5;

  if (!lat || !lon) {
    return res.status(400).send({
      status: "error",
      message: "Latitude and longitude are required",
      data: null,
    });
  }

  try {
    const users = await User.findNearbyUsers(
      parseFloat(lat),
      parseFloat(lon),
      parseFloat(rad)
    );

    if (users && users.length > 0) {
      res.status(200).json({
        status: "success",
        message: "Nearby users retrieved successful",
        data: users,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No nearby user found",
        data: null,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching nearby users", error: error.message });
  }
};

exports.nearByUsersByAddress = async (req, res) => {
  const userId = req.user.id;
  const address = req.params.address;

  if (!address) {
    return res.status(400).send({
      status: "error",
      message: "Address are required",
      data: null,
    });
  }

  try {
    const users = await User.findNearbyUsersByAddress(address);
    if (users && users.length > 0) {
      res.status(200).json({
        status: "success",
        message: "Nearby users retrieved successful",
        data: users,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No nearby user found",
        data: null,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching nearby users", error: error.message });
  }
};

exports.getAllusers = async (req, res) => {
  const userId = req.user.id;

  try {
    const users = await User.getAllusers();
    if (users && users.length > 0) {
      res.status(200).json({
        status: "success",
        message: "users retrieved successful",
        data: users,
      });
    } else {
      res
        .status(200)
        .json({ status: "success", message: "No user found", data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

exports.generateReferralCode = async (req, res) => {
  const userId = req.user.id;
  const code = Math.floor(1000 + Math.random() * 900000);
  const referralCode = `skv${code}`;

  try {
    const users = await User.setReferralCode(userId, referralCode);
    res.status(200).json({
      status: "success",
      message: "user referral code updated successful",
      data: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updateing referral code", error: error.message });
  }
};

exports.getReferredUsers = async (req, res) => {
  const code = req.params.code;

  try {
    const users = await User.getUsersByReferralCode(code);
    if (users && users.length > 0) {
      res.status(200).json({
        status: "success",
        message: "users retrieved successful",
        data: users,
      });
    } else {
      res
        .status(200)
        .json({ status: "success", message: "No user found", data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const noti = await User.getUserNotifications(userId);
    if (noti && noti.length > 0) {
      res.status(200).json({
        status: "success",
        message: "Notifications successful",
        data: noti,
      });
    } else {
      res
        .status(200)
        .json({ status: "success", message: "No record found", data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Notifications", error: error.message });
  }
};

exports.createStripeAccount = async (req, res) => {
  const userId = req.user.id;
  const email = req.user.email;

  if (userId != null) {
    try {
      const check = await User.checkStripeAccountExist(userId);

      if (check == null) {
        const account = await createConnectedAccount(email);

        if (account) {
          const user = await User.createStripeAccount(userId, account.id);
          res.status(201).json({
            status: "success",
            message: "Stripe account created successfully.",
            data: user,
          });
        }
      } else {
        res.status(400).json({
          status: "error",
          message: "User already has a stripe account",
          data: null,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Account creation failed.",
        data: error.detail,
      });
    }
  }
};

// exports.generateStripeAccountLink = async (req, res) => {
//   console.log("Request Body:", req.body); // 👀 Debugging line

//   res.setHeader("Access-Control-Allow-Origin", "*"); // ✅ Allow all origins (for testing)
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   const userId = req.user.id;
//   const { stripeAccountId } = req.body;

//   if (stripeAccountId != null) {
//     try {
//       const account = await generateAccountLink(stripeAccountId);

//       if (account) {
//         res.status(200).json({
//           status: "success",
//           message: "Onboarding link generated successfully",
//           data: account,
//         });
//       }
//     } catch (error) {
//       res.status(500).json({
//         status: "error",
//         message: "Failed to generate onboarding link",
//         data: error.detail,
//       });
//     }
//   } else {
//     res
//       .status(400)
//       .json({ status: "error", message: "Account is required", data: null });
//   }
// };

exports.generateStripeAccountLink = async (req, res) => {
  console.log("Request Body:", req.body); // ✅ Debugging line

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const userId = req.user.id;
  const { stripeAccountId } = req.body;

  if (stripeAccountId != null) {
    try {
      console.log("Generating account link for:", stripeAccountId); // ✅ Debug before calling function

      const account = await generateAccountLink(stripeAccountId);

      console.log("Account link generated:", account); // ✅ Debug after calling function

      if (account) {
        res.status(200).json({
          status: "success",
          message: "Onboarding link generated successfully",
          data: account,
        });
      }
    } catch (error) {
      console.error("Error generating account link:", error); // Log any errors
      res.status(500).json({
        status: "error",
        message: "Failed to generate onboarding link",
        data: error.message,
      });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: "Account is required", data: null });
  }
};

// exports.processSplitPayment = async (req, res) => {
//   const userId = req.user.id;
//   const { customerEmail, amount, currency, stripeAccountId } = req.body;

//   if (
//     stripeAccountId != null &&
//     amount != null &&
//     currency != null &&
//     customerEmail != null
//   ) {
//     try {
//       const paymentIntent = await processSplitPayment(
//         customerEmail,
//         amount,
//         currency,
//         stripeAccountId
//       );

//       if (paymentIntent) {
//         res.status(200).json({
//           status: "success",
//           message: "Payment Intent Created Successfully",
//           data: paymentIntent,
//         });
//       }
//     } catch (error) {
//       res.status(500).json({
//         status: "error",
//         message: "Failed to generate Payment Intent",
//         data: error.detail,
//       });
//     }
//   } else {
//     res.status(400).json({
//       status: "error",
//       message: "customerEmail, amount, currency, stripeAccountId are required",
//       data: null,
//     });
//   }
// };
exports.processSplitPayment = async (req, res) => {
  const userId = req.user.id;
  const { amount, currency, stripeAccountId, customerEmail, paymentMethod } =
    req.body;

  try {
    // Wallet method
    if (paymentMethod === "wallet" || paymentMethod === "spark_token") {
      const wallet = await pool.query(
        "SELECT * FROM wallet WHERE user_id = $1",
        [userId]
      );

      if (wallet.rows.length === 0) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const userWallet = wallet.rows[0];
      const currentBalance = parseFloat(
        paymentMethod === "wallet"
          ? userWallet.balance
          : userWallet.spark_tokens
      );

      if (currentBalance < amount) {
        return res
          .status(400)
          .json({ message: "Insufficient balance in wallet." });
      }

      // Deduct from appropriate wallet
      if (paymentMethod === "wallet") {
        await pool.query(
          "UPDATE wallet SET balance = balance - $1, updated_at = NOW() WHERE user_id = $2",
          [amount, userId]
        );
      } else if (paymentMethod === "spark_token") {
        await pool.query(
          "UPDATE wallet SET spark_tokens = spark_tokens - $1, updated_at = NOW() WHERE user_id = $2",
          [amount, userId]
        );
      }

      // If using wallet, simulate success (you can log internally)
      return res.status(200).json({
        status: "success",
        message: `Payment of £${amount} made from ${paymentMethod.replace(
          "_",
          " "
        )}.`,
      });
    }

    // Stripe payment method (split payment)
    if (paymentMethod === "stripe") {
      const paymentIntent = await processSplitPayment(
        customerEmail,
        amount,
        currency,
        stripeAccountId
      );

      if (paymentIntent) {
        return res.status(200).json({
          status: "success",
          message: "Stripe Payment Intent Created",
          data: paymentIntent,
        });
      }
    }

    return res.status(400).json({ message: "Invalid payment method" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Payment processing failed",
      error: err.message,
    });
  }
};

exports.updateStripeAccount = async (req, res) => {
  const { chargesEnabled, payoutsEnabled, detailsSubmitted, stripeAccountId } =
    req.body;

  try {
    const account = await User.updateStripeAccount(
      chargesEnabled,
      payoutsEnabled,
      detailsSubmitted,
      stripeAccountId
    );
    res.status(200).json({
      status: "success",
      message: "Stripe account updated successfully",
      data: account,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to update Stripe account" });
  }
};

exports.deleteStripeAccount = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const mode = await User.deleteStripeAccount(id);
    res.status(200).json({
      status: "success",
      message: "Account deleted successfully.",
      data: mode,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to delete account." });
  }
};

exports.getUserStripeAccount = async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (userId != null) {
    try {
      const check = await User.checkStripeAccountExist(userId);

      if (check != null) {
        res.status(200).json({
          status: "success",
          message: "Stripe account retrieved successfully.",
          data: check,
        });
      } else {
        res.status(400).json({
          status: "error",
          message: "No stripe account found for this user",
          data: null,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Account retrieval failed.",
        data: error.detail,
      });
    }
  }
};

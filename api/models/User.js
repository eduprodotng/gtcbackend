const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    photourl: { type: String, default: null },
    tradeSection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      default: null,
    },
    role: {
      type: String,
      required: true,
      enum: [
        "principal",
        "vice_principal",
        "head_of_department",
        "teacher",
        "student",
      ],
    },
    tech: {
      type: String,
      enum: ["tech_1", "tech_2", "tech_3", null],
      default: null,
    },
    // 👇 Additional fields for students
    admNo: { type: String, default: null },
    classRole: { type: String, default: null },
    gender: { type: String, enum: ["male", "female", null], default: null },
    birthday: { type: Date, default: null },
    // 👇 Additional field for teachers
    subjectTaught: { type: String, default: null },
    session: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
    refreshToken: { type: String, default: null },
    is_email_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Static method to check user existence
userSchema.statics.checkUserExist = async function (phone, email) {
  return await this.findOne({
    $or: [{ phone }, { email }],
  });
};
userSchema.statics.findByEmail = async function (email) {
  return await this.findOne({ email });
};
userSchema.statics.storeRefreshToken = async function (userId, token) {
  // You can store the refresh token in the database.
  // Option 1: Add a refreshToken field in the schema (recommended for MongoDB)

  await this.findByIdAndUpdate(userId, {
    $set: { refreshToken: token },
  });
};

userSchema.statics.getProfileByUserId = async function (id) {
  return await this.findById(id).select("-password -__v -refreshToken");
};

userSchema.statics.createUser = async function (data) {
  const {
    phone,
    username,
    email,
    fullname,
    password,
    tradeSection,
    tech,
    photourl,
    role,
    admNo,
    classRole,
    gender,
    birthday,
    subjectTaught,
    session,
  } = data;

  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string.");
  }

  const hashedPassword = await bcrypt.hash(password.trim(), 10);

  const newUser = new this({
    phone,
    username,
    email,
    fullname,
    password: hashedPassword,
    photourl: photourl || null,
    role,
    tradeSection,
    tech: role === "student" ? tech : null,
    admNo: role === "student" ? admNo : null,
    classRole: role === "student" ? classRole : null,
    gender: role === "student" ? gender : null,
    birthday: role === "student" ? birthday : null,
    subjectTaught: role === "teacher" ? subjectTaught : null,
    session: session ? (Array.isArray(session) ? session : [session]) : [],
    is_email_verified: false,
  });

  return await newUser.save();
};

const User = mongoose.model("User", userSchema);
module.exports = User;

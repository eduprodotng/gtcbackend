// /* global process */

// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//       connectTimeoutMS: 15000,
//       serverSelectionTimeoutMS: 30000,
//       socketTimeoutMS: 120000,
//     });
//     console.log("MongoDB connected.");
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;
// /* global process */

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected.");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
mongoose.connection.once("open", () => {
  console.log("✅ Connected to DB:", mongoose.connection.name);
});

module.exports = connectDB;

// import mongoose from "mongoose";
// import dotenv from "dotenv";
// //following users is for who can insert into the database.

// import users from "./data/users.js";
// import items from "./data/Data.js";
// import sales from "./data/saleData.js";
// import Sale from "./models/saleModel.js";
// import Dashboard from "./models/dashboardModel.js";
// import Admin from "./models/adminModel.js";

// dotenv.config();
// import connectDB from "./config/db.js";
// connectDB();
// const importData = async () => {
//   try {
//     await Admin.deleteMany();
//     await Sale.deleteMany();
//     await Dashboard.deleteMany();
//     const createdUsers = await Admin.insertMany(users);
//     console.log("inserted users");
//     const adminUser = createdUsers[0]._id;

//     const sampleSales = sales.map((sale) => {
//       return { ...sale, user: adminUser };
//     });

//     await Dashboard.insertMany(items);
//     await Sale.insertMany(sampleSales);

//     console.log("Data imported.");
//     process.exit();
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// const exportData = async () => {
//   try {
//     await Sale.deleteMany();
//     await Dashboard.deleteMany();
//     await Admin.deleteMany();

//     console.log("Data destroyed.");
//     process.exit();
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// if (process.argv[2] === "-d") {
//   destroyData();
// } else {
//   importData();
// }

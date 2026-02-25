// import Cat from "../models/bookCatModel.js";
// export const createCat = async (req, res) => {
//   const { catName } = req.body; // Destructure catName from req.body
//   if (!catName) {
//     return res.status(400).json({ error: "catName is required" });
//   }

//   const newCat = new Cat({ catName }); // Create a new Cat instance with catName
//   try {
//     const savedCat = await newCat.save();
//     res.status(200).json(savedCat);
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// controllers/categoryController.js
import Category from "../models/bookCatModel.js";
import Product from "../models/productModel.js";

// Create Category (can be top-level or subcategory)
// export const createCategory = async (req, res) => {
//   try {
//     const { name, parent, icon } = req.body;
//     let image = null;

//     if (req.file) {
//       image = req.file.filename; // Assuming using multer for image upload
//     }

//     const newCategory = new Category({
//       name,
//       parent: parent || null,
//       icon,
//       image,
//     });

//     const savedCategory = await newCategory.save();
//     res.status(201).json(savedCategory);
//   } catch (err) {
//     console.error("Category creation error:", err);
//     res.status(500).json({ error: "Failed to create category" });
//   }
// };
export const createCategory = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, parent, icon } = req.body;
    let image = null;

    if (req.file) {
      image = req.file.location || req.file.filename; // S3 gives `.location`, local gives `.filename`
    }

    const newCategory = new Category({
      name,
      parent: parent || null,
      icon,
      image,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error("Category creation error:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// Get All Categories (nested structure)
// export const getAllCategories = async (req, res) => {
//   try {
//     const categories = await Category.find().lean();

//     // Function to build tree
//     const buildTree = (parentId = null) =>
//       categories
//         .filter((cat) => String(cat.parent) === String(parentId))
//         .map((cat) => ({
//           ...cat,
//           children: buildTree(cat._id),
//         }));

//     const tree = buildTree();
//     res.status(200).json(tree);
//   } catch (err) {
//     console.error("Fetching categories failed:", err);
//     res.status(500).json({ error: "Failed to fetch categories" });
//   }
// };
export const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find().lean();

    // Function to build tree with products as children of child categories
    const buildTree = async (parentId = null) => {
      const categoryTree = categories
        .filter((cat) => String(cat.parent) === String(parentId))
        .map(async (cat) => {
          // Fetch products for the category if any
          const products = await Product.find({ category: cat._id }).lean();

          // Recursively build children (subcategories)
          const children = await buildTree(cat._id);

          // If products exist, include them as children of the current category
          if (products.length > 0) {
            return {
              ...cat,
              children: [
                ...children, // Include the subcategories as children
                ...products, // Add products as children
              ],
            };
          }

          // Return category without products if no products exist
          return {
            ...cat,
            children,
          };
        });

      // Wait for all category trees to be built
      return await Promise.all(categoryTree);
    };

    // Build the category tree with products as children if any
    const tree = await buildTree();
    res.status(200).json(tree); // Send the category tree with products as children
  } catch (err) {
    console.error("Fetching categories failed:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

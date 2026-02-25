import Blog from "../models/blogModel.js";

// Assuming you have fetched the data from MongoDB
const mongoDate = new Date(); // Replace with your actual date value

// export const createProperties = async (req, res, next) => {
//   const newProperties = new Properties(req.body);

//   try {
//     const savedProperties = await newProperties.save();
//     res.status(200).json(savedProperties);
//   } catch (err) {
//     next(err);
//   }
// };

export const createBlog = async (req, res, next) => {
  const newProperties = new Blog(req.body);

  // Generate slug from title
  newProperties.slug = req.body.title.toLowerCase().replace(/\s+/g, "-");

  try {
    const savedProperties = await newProperties.save();
    res.status(200).json(savedProperties);
  } catch (err) {
    next(err);
  }
};
export const getPropertiesBySlug = async (req, res, next) => {
  try {
    const properties = await Blog.findOne({ slug: req.params.slug });
    res.status(200).json(properties);
  } catch (err) {
    next(err);
  }
};
export const updateBlog = async (req, res, next) => {
  try {
    const updatedProperties = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProperties);
  } catch (err) {
    next(err);
  }
};
export const deleteBlog = async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json("Property has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getBlog = async (req, res, next) => {
  try {
    const properties = await Blog.findById(req.params.id);
    res.status(200).json(properties);
  } catch (err) {
    next(err);
  }
};
export const getBlogBySlug = async (req, res, next) => {
  try {
    const properties = await Blog.findOne({ slug: req.params.slug });
    res.status(200).json(properties);
  } catch (err) {
    next(err);
  }
};
// export const getProperties = async (req, res, next) => {
//   try {
//     const properties = await Properties.findOne({ title: req.params.title });
//     res.status(200).json(properties);
//   } catch (err) {
//     next(err);
//   }
// };

export const getAllBlog = async (req, res, next) => {
  const qNew = req.query.new;
  const qCategory = req.query.categories;
  try {
    let property;

    if (qNew) {
      property = await Blog.find();
    } else if (qCategory) {
      property = await Blog.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      property = await Blog.find();
    }

    res.status(200).json(property);
  } catch (err) {
    res.status(500).json(err);
  }
};

//add comment

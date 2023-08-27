const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const upload = require('../config/multer'); // Import Multer configuration
const Image = require('../models/Image'); // Import the Image model
const sharp = require("sharp");
exports.getBlogImage = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.imageId);

    if (!blog || !blog.image) {

      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', 'image/png');
    res.send(blog.image);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

//GET ALL BLOGS
exports.getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate("user");
    if (!blogs) {
      return res.status(200).send({
        success: false,
        message: "No Blogs Found",
      });
    }
    // Construct image URLs for each blog
  /*  const blogsWithImageUrls = blogs.map((blog) => ({
      ...blog._doc,
      image: `/api/v1/blog/image/${blog.image}`,
    }));  */
    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: "All Blogs lists",
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error WHile Getting Blogs",
      error,
    });
  }
};


exports.createBlogController = async (req, res) => {
  try {
    console.log(req.file);
    const buffer = await sharp(req.file.buffer).png().toBuffer();
    const { title, description, user } = req.body;
    const { mimetype } = req.file; // Extract image buffer and mimetype

    console.log("validation", req.body);

    // Validation
    if (!title || !description || !user || !buffer || !mimetype) {
      return res.status(400).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    // Find the existing user
    const existingUser = await userModel.findById(user);

    // Validation
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "Unable to find user",
      });
    }

    // Save the image to the database
  //  const newImage = new Image({
  //    data: req.file.buffer,
   //   contentType: req.file.mimetype,
  //  });
  //  await newImage.save();
    
    // Create a new blog entry with the image reference
    const newBlog = new blogModel({
      title,
      description,
      image: buffer,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ session });
    await session.commitTransaction();

    return res.status(201).send({
      success: true,
      message: "Blog Created!",
      newBlog,
  //    imageUrl: `/api/v1/blog/image/${newImage._id}`,

    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error While Creating Blog",
      error,
    });
  }
};


exports.updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    let updatedFields = { title, description };

    // Check if a new image is being uploaded
    if (req.file) {
      const { buffer, mimetype } = req.file;

      // Create a new image document
      const newImage = new Image({
        data: buffer,
        contentType: mimetype,
      });
      await newImage.save();

      // Update the fields to include the new image ID
      updatedFields.image = newImage._id;
    }

    const blog = await blogModel.findByIdAndUpdate(id, updatedFields, { new: true });

    return res.status(200).send({
      success: true,
      message: "Blog Updated!",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error While Updating Blog",
      error,
    });
  }
};


//SIngle Blog
exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "blog not found with this is",
      });
    }
    return res.status(200).send({
      success: true,
      message: "fetch single blog",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error while getting single blog",
      error,
    });
  }
};

//Delete Blog
exports.deleteBlogController = async (req, res) => {
  try {
    const blog = await blogModel
      // .findOneAndDelete(req.params.id)
      .findByIdAndDelete(req.params.id)
      .populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: "Blog Deleted!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Erorr WHile Deleteing BLog",
      error,
    });
  }
};

//GET USER BLOG
exports.userBlogControlller = async (req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id).populate("blogs");

    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: "blogs not found with this id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "user blogs",
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error in user blog",
      error,
    });
  }
};

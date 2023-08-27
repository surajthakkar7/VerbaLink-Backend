const express = require("express");
const {
  getAllBlogsController,
  createBlogController,
  updateBlogController,
  getBlogByIdController,
  deleteBlogController,
  userBlogControlller,
  getBlogImage, // Add this line to import the getBlogImage controller
} = require("../controllers/blogControlller");

// Import the upload middleware and configure it
const upload = require('../config/multer'); // Import Multer configuration

//router object
const router = express.Router();

//routes
// GET || all blogs
router.get("/all-blog", getAllBlogsController);

router.get('/image/:imageId', getBlogImage); // Image serving route

// POST || create blog
router.post("/create-blog", upload.single('image'), createBlogController);

// PUT || update blog
router.put("/update-blog/:id", updateBlogController);

// GET || Single Blog Details
router.get("/get-blog/:id", getBlogByIdController);

// DELETE || delete blog
router.delete("/delete-blog/:id", deleteBlogController);

// GET || user blog
router.get("/user-blog/:id", userBlogControlller);

module.exports = router;

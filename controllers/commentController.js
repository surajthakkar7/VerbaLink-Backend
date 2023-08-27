const Comment = require('../models/Comment');
const mongoose = require("mongoose");

exports.createComment = async (req, res) => {
    try {
      console.log("Creating a new comment...");
  
      const { username, text } = req.body; // Ensure that you're extracting the username
      const newComment = new Comment({ username, text });
      await newComment.save();
  
      console.log("Comment created:", newComment);
  
      res.status(201).json(newComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
exports.updateComment = async (req, res) => {
    try {
      console.log(`Updating comment with ID: ${req.params.id}`);
      const { text } = req.body;
      const updatedComment = await Comment.findByIdAndUpdate(req.params.id, { text }, { new: true });
      
      if (!updatedComment) {
        console.log(`Comment with ID ${req.params.id} not found.`);
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      console.log(`Comment updated:`, updatedComment);
      res.status(200).json(updatedComment);
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.deleteComment = async (req, res) => {
    try {
      console.log(`Deleting comment with ID: ${req.params.id}`);
      const deletedComment = await Comment.findByIdAndDelete(req.params.id);
  
      if (!deletedComment) {
        console.log(`Comment with ID ${req.params.id} not found.`);
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      console.log(`Comment deleted:`, deletedComment);
      res.status(200).json(deletedComment);
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: error.message });
    }
  };
  

// Add a new function to get comments by blog ID
exports.getCommentsByBlogId = async (req, res) => {
    try {
      const { blogId } = req.query;
      const comments = await Comment.find({ blogId }); // Assuming you have a 'blogId' field in your comment schema
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
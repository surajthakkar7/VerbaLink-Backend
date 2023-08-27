const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// POST a new comment
router.post('/', commentController.createComment);

// PUT (update) a comment
router.put('/api/comments/:id', commentController.updateComment);

// DELETE a comment
router.delete('/api/comments/:id', commentController.deleteComment);

// Add a new route to get comments by blog ID
router.get('/', commentController.getCommentsByBlogId);

module.exports = router;

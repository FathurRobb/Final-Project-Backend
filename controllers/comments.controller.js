const db = require('../models');
const { Op } =  require('sequelize');
const Comment = db.comments;

// Create and Save a new Comment
exports.addComment = async (req, res) => {
    const { id } = req.params;

    const { userId, comment } = req.body;
    try {
        await Comment.create({
            postId: id,
            userId,
            comment
        });

        return res.status(201).json({
            message: "Your comment have successfully created"
        });
    }
    catch (error) {
        console.error(error);
        // Trace the error
        console.trace(error);
        return res.status(500).json({
            message: "Your comment cannot be created"
        });
    }
};

// Retrieve all Comments from the database.
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            data: comments
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};

// Update a Comment
exports.updateComment = async (req, res) => {
    const { id } = req.params;

    const { comment } = req.body;
    try {
        const commentToUpdate = await Comment.findOne({
            where: {
                commentId: id,
                userId: req.user.userId
            }
        });

        if (!commentToUpdate) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        await commentToUpdate.update({
            comment
        });

        return res.status(200).json({
            message: "Your comment have successfully updated"
        });

    } catch (error) {

        console.error(error);
        return res.status(500).json({
            message: "Your comment cannot be updated"
        });
        
    }
};

// Delete a Comment

exports.deleteComment = async (req, res) => {
    // Get comment id from params
    const { id } = req.params;
    try {
        // Find comment by id

        const comment = await Comment.findOne({
            where: {
                commentId: id
            }
        });

        // Check if comment exists

        if (!comment) {

            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Delete comment

        await comment.destroy();

        return res.status(200).json({
            message: "Your comment have successfully deleted"
        });

    } catch (error) {
        
        console.error(error);
        return res.status(500).json({
            message: "Your comment cannot be deleted"
        });
        
    }
};

// Get Comments by Post Id

exports.getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.findAll({
            where: {
                postId
            },
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            data: comments
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};

// Get Comments by User Id

exports.getCommentsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const comments = await Comment.findAll({
            where: {
                userId
            },
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            data: comments
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};
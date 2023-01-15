const { addComment, getAllComments, updateComment, deleteComment, getCommentsByPostId, getCommentsByUserId } = require('../controllers/comments.controller');

module.exports = app => {
    app.post('/api/comments/:id', addComment);
    app.get('/api/comments', getAllComments);
    app.put('/api/comments/:id', updateComment);
    app.delete('/api/comments/:id', deleteComment);
    app.get('/api/comments/post/:postId', getCommentsByPostId);
    app.get('/api/comments/user/:userId', getCommentsByUserId);
}
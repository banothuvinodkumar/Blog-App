const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const comment = new Comment({
            text,
            user: req.user.id,
            postId: req.params.postId
        });
        await comment.save();
        const populatedComment = await comment.populate('user', 'username');
        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).populate('user', 'username').sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

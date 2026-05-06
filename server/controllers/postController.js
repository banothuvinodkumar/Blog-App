const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

        const post = new Post({ title, content, author: req.user.id });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (req.user.role !== 'admin' && post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You are not authorized to perform this action.' });
        }

        const { title, content } = req.body;
        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (req.user.role !== 'admin' && post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You are not authorized to perform this action.' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

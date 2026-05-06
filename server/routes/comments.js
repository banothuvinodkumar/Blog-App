const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.get('/:postId', commentController.getComments);
router.post('/:postId', auth, commentController.addComment);

module.exports = router;
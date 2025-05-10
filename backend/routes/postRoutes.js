const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const verifyToken = require('../middleware/authMiddleware');

// 投稿関連ルーティング（保護ルート）
router.post('/', verifyToken, postController.createPost);
router.get('/', verifyToken, postController.getPosts);
router.delete('/:id', verifyToken, postController.deletePost);

module.exports = router;

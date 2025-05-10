const Post = require('../models/Post');

// 投稿を作成
exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      user: req.user.id,
      title: req.body.title,
      content: req.body.content,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error creating post' });
  }
};

// 投稿一覧取得
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
};

// 投稿削除
exports.deletePost = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};

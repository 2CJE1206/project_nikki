const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User'); 
const verifyToken = require('../middleware/authMiddleware');

// 認証関連ルーティング
router.post('/register', authController.register);
router.post('/login', authController.login);

// ユーザーID重複チェック
router.get('/check-username/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const exists = await User.exists({ username });
    res.json({ exists: !!exists });
  } catch (err) {
    console.error('重複チェック中エラー:', err);
    res.status(500).json({ error: '確認エラー' });
  }
});

//ユーザー削除
router.delete('/delete', verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;
      await User.findByIdAndDelete(userId);
      res.json({ message: 'ユーザーを削除しました' });
    } catch (err) {
      console.error('ユーザー削除エラー:', err);
      res.status(500).json({ error: '削除に失敗しました' });
    }
  });

module.exports = router;

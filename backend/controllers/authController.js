const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ユーザー登録
exports.register = async (req, res) => {
  const { username, password } = req.body

  // バリデーション：ユーザーIDとパスワード両方必要
  if (!username || username.length < 5) {
    return res.status(400).json({ error: 'ユーザーIDは5文字以上で入力してください' })
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'パスワードは6文字以上で入力してください' })
  }

  try {
    // 重複確認
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: 'このユーザーIDは既に使われています' })
    }

    // 登録処理
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: '登録に成功しました' })
  } catch (err) {
    // MongoDBの重複エラー（unique: true の制約）
    if (err.code === 11000) {
      return res.status(400).json({ error: 'このユーザーIDはすでに登録されています' })
    }

    // その他の予期しないエラー
    console.error('登録エラー:', err)
    res.status(500).json({ error: 'サーバーエラーにより登録に失敗しました' })
  }
}



// ユーザーログイン
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'ユーザーが見つかりません' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'パスワードが違います' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  res.json({ token });
};

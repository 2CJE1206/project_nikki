// アプリのエントリーポイント
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

//  CORS有効化とJSONパースは最初に設定
app.use(cors());
app.use(express.json());

//  レートリミッター：1時間に1回だけ登録可能（IP単位）
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    // 👇 JSON形式で明示的に返す（Content-Type付き）
    res.status(429).json({
      error: '登録は1時間に1回までです。しばらくしてから再試行してください。'
    });
  }
});
app.use('/api/auth/register', registerLimiter);

//  APIルート
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

//  MongoDB接続
console.log("MONGO_URI from .env:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5500, () => {
      console.log('Server running & MongoDB connected');
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

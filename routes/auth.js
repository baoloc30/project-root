const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');


const SALT_ROUNDS = 10;

// Đăng nhập
router.get('/login', (req, res) => {
  res.render('login', { title: 'Đăng nhập' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.render('login', { title: 'Đăng nhập', error: 'Sai tài khoản hoặc mật khẩu' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render('login', { title: 'Đăng nhập', error: 'Sai tài khoản hoặc mật khẩu' });
  }

  req.session.user = user;
  res.redirect('/');
});

// Đăng ký
router.get('/register', (req, res) => {
  res.render('register', { title: 'Đăng ký' });
});

router.post('/register', async (req, res) => {
  const { username, password, email, phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ username, password: hashedPassword, email, phone });
  await user.save();

  res.redirect('/auth/login');
});

// Quên mật khẩu
router.get('/forgot', (req, res) => {
  res.render('forgot', { title: 'Quên mật khẩu' });
});

router.post('/forgot', async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findOne({ username, email });
  if (!user) {
    return res.render('forgot', { title: 'Quên mật khẩu', error: 'Không tìm thấy tài khoản phù hợp' });
  }

  // Reset mật khẩu mặc định = 123456 (hash lại)
  const newPassword = '123456';
  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.save();

  res.render('login', { 
    title: 'Đăng nhập', 
    message: 'Mật khẩu đã được reset về 123456, vui lòng đăng nhập lại' 
  });
});

// Đăng xuất
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;

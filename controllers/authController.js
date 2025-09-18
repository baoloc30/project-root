const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getRegister = (req, res) => res.render('register');
exports.register = async (req, res) => {
  const { username, password, email, phone } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash, email, phone });
  await user.save();
  res.redirect('/auth/login');
};

exports.getLogin = (req, res) => res.render('login');
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.redirect('/auth/login');
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.redirect('/auth/login');
  req.session.userId = user._id;
  res.redirect('/');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

// Middleware: bắt buộc đăng nhập
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

// Danh sách nhà cung cấp
router.get('/', requireLogin, async (req, res) => {
  const suppliers = await Supplier.find();
  res.render('suppliers/index', { title: 'Quản lý nhà cung cấp', suppliers });
});

// Form thêm mới
router.get('/new', requireLogin, (req, res) => {
  res.render('suppliers/form', { title: 'Thêm nhà cung cấp', supplier: {} });
});

router.post('/new', requireLogin, async (req, res) => {
  const { name, address, phone } = req.body;
  const supplier = new Supplier({ name, address, phone });
  await supplier.save();
  res.redirect('/suppliers');
});

// Form sửa
router.get('/:id/edit', requireLogin, async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  res.render('suppliers/form', { title: 'Sửa nhà cung cấp', supplier });
});

router.post('/:id/edit', requireLogin, async (req, res) => {
  const { name, address, phone } = req.body;
  await Supplier.findByIdAndUpdate(req.params.id, { name, address, phone });
  res.redirect('/suppliers');
});

// Xóa
router.get('/:id/delete', requireLogin, async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.redirect('/suppliers');
});

module.exports = router;

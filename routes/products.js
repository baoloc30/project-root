const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

// Middleware: bắt buộc đăng nhập
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

// Danh sách sản phẩm
router.get('/', requireLogin, async (req, res) => {
  const products = await Product.find().populate('supplier');
  res.render('products/index', { title: 'Quản lý sản phẩm', products });
});

// Form thêm mới
router.get('/new', requireLogin, async (req, res) => {
  const suppliers = await Supplier.find();
  res.render('products/form', { title: 'Thêm sản phẩm', product: {}, suppliers });
});

router.post('/new', requireLogin, async (req, res) => {
  const { name, price, quantity, supplier } = req.body;
  const product = new Product({ name, price, quantity, supplier });
  await product.save();
  res.redirect('/products');
});

// Form sửa
router.get('/:id/edit', requireLogin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  const suppliers = await Supplier.find();
  res.render('products/form', { title: 'Sửa sản phẩm', product, suppliers });
});

router.post('/:id/edit', requireLogin, async (req, res) => {
  const { name, price, quantity, supplier } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, price, quantity, supplier });
  res.redirect('/products');
});

// Xóa
router.get('/:id/delete', requireLogin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/products');
});

module.exports = router;

const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

exports.index = async (req, res) => {
  const query = {};
  if (req.query.search) query.name = { $regex: req.query.search, $options: 'i' };
  if (req.query.supplier) query.supplier = req.query.supplier;

  const products = await Product.find(query).populate('supplier');
  const suppliers = await Supplier.find();
  res.render('products/index', { products, suppliers });
};

exports.form = async (req, res) => {
  const suppliers = await Supplier.find();
  res.render('products/form', { product: {}, suppliers });
};

exports.create = async (req, res) => {
  await Product.create(req.body);
  res.redirect('/products');
};

exports.edit = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const suppliers = await Supplier.find();
  res.render('products/form', { product, suppliers });
};

exports.update = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/products');
};

exports.delete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/products');
};

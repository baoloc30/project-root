const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    let filter = {};

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.supplier) {
      filter.supplier = req.query.supplier;
    }

    const products = await Product.find(filter).populate('supplier');
    res.render('index', {
      title: 'Trang chủ',
      products,
      suppliers,
      query: req.query
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

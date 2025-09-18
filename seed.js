const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');
const User = require('./models/User');

const SALT_ROUNDS = 10;


async function seed() {
  try {
    // Kết nối MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/product_supplier');
    console.log('✅ MongoDB connected');

    // Xóa dữ liệu cũ
    await Supplier.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // Thêm nhà cung cấp
    const suppliers = await Supplier.insertMany([
      { name: "Công ty A", address: "123 Trần Hưng Đạo, Hà Nội", phone: "0901234567" },
      { name: "Công ty B", address: "456 Nguyễn Huệ, TP.HCM", phone: "0902345678" },
      { name: "Công ty C", address: "789 Lê Lợi, Đà Nẵng", phone: "0903456789" }
    ]);

    // Thêm sản phẩm
    await Product.insertMany([
      { name: "Laptop Dell XPS 13", price: 30000, quantity: 10, supplier: suppliers[0]._id },
      { name: "Chuột Logitech MX Master 3", price: 2500, quantity: 50, supplier: suppliers[0]._id },
      { name: "Điện thoại iPhone 15", price: 25000, quantity: 20, supplier: suppliers[1]._id },
      { name: "Tai nghe AirPods Pro", price: 5000, quantity: 30, supplier: suppliers[1]._id },
      { name: "Màn hình LG UltraWide", price: 8000, quantity: 15, supplier: suppliers[2]._id }
    ]);

    // Thêm user
    const hashedPassword = await bcrypt.hash('123456', SALT_ROUNDS);
    await User.insertMany([
        { username: 'admin', password: hashedPassword, email: 'admin@example.com', phone: '0909000001' }
    ]);

    console.log('🎉 Seed thành công!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi seed:', err);
    process.exit(1);
  }
}

seed();
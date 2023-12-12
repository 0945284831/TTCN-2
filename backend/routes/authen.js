const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const session = require('express-session');


router.use(
  session({
    secret: 'toan2002@', // Thay đổi bằng secret key phức tạp hơn trong môi trường thực
    resave: true,
    saveUninitialized: true,
  })
);

// API để đăng ký
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone ,isAdmin } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }
    // Create a new user
    const newUser = new User({ email, password, name, phone, isAdmin });

    // Save the user to the database
    await newUser.save();
    req.session.user = newUser;

    res.json({ success: true, message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API để đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    // Kiểm tra mật khẩu sử dụng comparePassword method
    const passwordValid = await user.comparePassword(password);

    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    // Kiểm tra quyền của người dùng
    const isAdmin = user.isAdmin || false; // Assuming you have an 'isAdmin' property in your user model

    // Trả về thông tin đăng nhập thành công cùng với _id
    res.json({ success: true, message: 'Đăng nhập thành công', isAdmin, _id: user._id });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});



router.post('/logout', (req, res) => {
  // Xóa cookie phiên làm việc (nếu sử dụng cookie-based session)
  res.clearCookie('sessionToken');
  res.json({ success: true, message: 'Đăng xuất thành công' });
});

  
// API để xóa tất cả người dùng
router.delete('/delete-all', async (req, res) => {
  try {
    await User.deleteMany({}); // Xóa tất cả người dùng

    res.json({ success: true, message: 'Đã xóa tất cả người dùng' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

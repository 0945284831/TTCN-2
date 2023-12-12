const express = require('express');
const User = require('../models/userModel'); // Điều chỉnh đường dẫn dựa trên cấu trúc dự án của bạn

const router = express.Router();

// Thêm thông tin liên hệ cho người dùng theo userId
router.post('/users/:userId/addContactInfo', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Tìm người dùng dựa trên userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Trích xuất chi tiết thông tin liên hệ từ cơ thể yêu cầu
    const { fullName, phone, address, country, province, district, ward, zipCode, isDefault } = req.body;

    // Tạo một đối tượng thông tin liên hệ mới
    const newContactInfo = {
      fullName,
      phone,
      address,
      country,
      province,
      district,
      ward,
      zipCode,
      isDefault,
    };

    // Thêm thông tin liên hệ mới vào mảng contactInfo của người dùng
    user.contactInfo.push(newContactInfo);

    // Lưu tài liệu người dùng đã cập nhật
    await user.save();

    res.status(201).json({ message: 'Thông tin liên hệ được thêm thành công', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Nội Bộ của Máy Chủ' });
  }
});

router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Sử dụng findById để tìm người dùng theo userId
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error getting user by userId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});




module.exports = router;

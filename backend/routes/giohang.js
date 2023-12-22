const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Product = require('../models/productModel');
const ShoppingCart = require('../models/shoppingCartModel');

// Route để thêm sản phẩm vào giỏ hàng
router.post('/add-to-cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Kiểm tra xem người dùng và sản phẩm có tồn tại không
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(400).json({ success: false, message: 'Người dùng hoặc sản phẩm không tồn tại' });
    }

    // Kiểm tra xem giỏ hàng của người dùng đã được tạo chưa
    let shoppingCart = await ShoppingCart.findOne({ user: userId });

    // Nếu giỏ hàng chưa tồn tại, tạo mới
    if (!shoppingCart) {
      shoppingCart = new ShoppingCart({ user: userId, items: [] });
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItemIndex = shoppingCart.items.findIndex(item => item.product.toString() === productId);

    // Nếu sản phẩm đã tồn tại, cập nhật số lượng
    if (existingItemIndex !== -1) {
      // Giảm số lượng của sản phẩm trong danh sách chính của người dùng
      user.shoppingCartQuantity -= quantity;

      // Cập nhật số lượng trong giỏ hàng
      shoppingCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới
      shoppingCart.items.push({ product: productId, quantity });

      // Giảm số lượng của sản phẩm trong danh sách chính của người dùng
      user.shoppingCartQuantity -= quantity;
    }

    // Tính toán và cập nhật totalAmount
    shoppingCart.totalAmount += product.productPrice * quantity;

    // Lưu giỏ hàng, người dùng và sản phẩm vào database
    await shoppingCart.save();
    await user.save();
    await product.save();

    res.json({ success: true, shoppingCart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

  
// Route để xóa sản phẩm khỏi giỏ hàng
router.post('/remove-from-cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Kiểm tra xem người dùng và sản phẩm có tồn tại không
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(400).json({ success: false, message: 'Người dùng hoặc sản phẩm không tồn tại' });
    }

    // Kiểm tra xem giỏ hàng của người dùng đã được tạo chưa
    let shoppingCart = await ShoppingCart.findOne({ user: userId });

    // Nếu giỏ hàng không tồn tại, trả về lỗi
    if (!shoppingCart) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng không tồn tại' });
    }

    // Kiểm tra xem sản phẩm có trong giỏ hàng không
    const existingItemIndex = shoppingCart.items.findIndex(item => item.product.toString() === productId);

    // Nếu sản phẩm không có trong giỏ hàng, trả về lỗi
    if (existingItemIndex === -1) {
      return res.status(400).json({ success: false, message: 'Sản phẩm không có trong giỏ hàng' });
    }

    // Kiểm tra xem số lượng cần xóa có lớn hơn số lượng trong giỏ hàng không
    if (quantity > shoppingCart.items[existingItemIndex].quantity) {
      return res.status(400).json({ success: false, message: 'Số lượng cần xóa lớn hơn số lượng trong giỏ hàng' });
    }

    // Giảm số lượng sản phẩm trong giỏ hàng
    shoppingCart.items[existingItemIndex].quantity -= quantity;

    // Nếu số lượng sản phẩm trong giỏ hàng bằng 0, xóa khỏi mảng
    if (shoppingCart.items[existingItemIndex].quantity === 0) {
      shoppingCart.items.splice(existingItemIndex, 1);
    }

    // Lưu giỏ hàng vào database
    await shoppingCart.save();

    res.json({ success: true, shoppingCart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/get-cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra xem giỏ hàng của người dùng đã được tạo chưa
    const shoppingCart = await ShoppingCart.findOne({ user: userId }).populate('items.product');

    // Nếu giỏ hàng không tồn tại, tạo mới
    if (!shoppingCart) {
      const newShoppingCart = new ShoppingCart({ user: userId, items: [] });
      await newShoppingCart.save();
      return res.json({ success: true, shoppingCart: newShoppingCart });
    }

    res.json({ success: true, shoppingCart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ShoppingCart = require('../models/shoppingCartModel');


// Route để đặt hàng
router.post('/create-order', async (req, res) => {
  try {
    const { userId } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra xem giỏ hàng của người dùng có tồn tại không
    const shoppingCart = await ShoppingCart.findOne({ user: userId }).populate('items.product');

    if (!shoppingCart) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng không tồn tại' });
    }

    // Tính tổng số tiền của giỏ hàng
    const totalAmount = shoppingCart.items.reduce((total, item) => {
      const productPrice = item.product.price; // Giả sử có trường price trong schema Product
      return total + productPrice * item.quantity;
    }, 0);

    // Tạo đơn hàng từ thông tin giỏ hàng
    const order = new Order({
      user: userId,
      items: shoppingCart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      shippingAddress: [
        {
          fullName: user.contactInfo[0].fullName,
          phone: user.contactInfo[0].phone,
          address: user.contactInfo[0].address,
          country: user.contactInfo[0].country,
          province: user.contactInfo[0].province,
          district: user.contactInfo[0].district,
          ward: user.contactInfo[0].ward,
          zipCode: user.contactInfo[0].zipCode,
          isDefault: user.contactInfo[0].isDefault,
        },
      ],
      totalAmount: shoppingCart.totalAmount,
      // Bạn có thể thêm các trường khác tùy thuộc vào yêu cầu của bạn
    });

    // Lưu đơn hàng vào database
    await order.save();

    // Xóa giỏ hàng sau khi tạo đơn hàng thành công
    await ShoppingCart.deleteOne({ user: userId });

    // Cập nhật số lượng sản phẩm và các hoạt động khác nếu cần

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route để hủy đơn hàng
router.post('/huy-don-hang', async (req, res) => {
  try {
    const { userId, orderId } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra xem đơn hàng có tồn tại không
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(400).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    // Hủy đơn hàng
    order.status = 'Hủy';

    // Lưu đơn hàng và cập nhật người dùng vào cơ sở dữ liệu
    await order.save();
    await user.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/update-order-status', async (req, res) => {
  try {
    const { userId, orderId, newStatus } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra xem đơn hàng có tồn tại không
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(400).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    // Kiểm tra xem trạng thái mới có hợp lệ hay không
    if (!order.isValidStatus(newStatus)) {
      return res.status(400).json({ success: false, message: 'Trạng thái mới không hợp lệ' });
    }

    // Cập nhật trạng thái của đơn hàng
    order.status = newStatus;

    // Lưu đơn hàng và cập nhật người dùng vào cơ sở dữ liệu
    await order.save();
    await user.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.post('/get-orders', async (req, res) => {
  try {
    const userId = req.body.userId; // Nhận userId từ request body
    const orders = await Order.find({ user: userId }).exec();
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/get-all-orders', async (req, res) => {
  try {
    const orders = await Order.find().exec();
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/revenue-report', async (req, res) => {
  try {
    // Thống kê doanh thu theo sản phẩm
    const revenueByProduct = await Order.aggregate([
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.product.productPrice'] } }
        }
      }
    ]);

    // Tính tổng số sản phẩm và tổng tiền
    const totalProducts = revenueByProduct.length;
    const totalRevenue = revenueByProduct.reduce((total, item) => total + item.totalRevenue, 0);

    // Trả về kết quả
    res.json({
      totalProducts,
      totalRevenue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.delete('/don_hang/delete-all', async (req, res) => {
//   try {
//     await Order.deleteMany({}); // Xóa tất cả người dùng

//     res.json({ success: true, message: 'Đã xóa tất cả đơn hàng' });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

module.exports = router;

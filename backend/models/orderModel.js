const mongoose = require('mongoose');
const moment = require('moment-timezone');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 0,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ['chờ xác nhận', 'Đã xác nhận, đang đóng gói', 'Đã đưa cho đơn vị vận chuyển', 'Đơn hàng đang giao đến bạn', 'Giao không thành công','Giao thành công','Hủy'],
    default: 'chờ xác nhận',
  },
  shippingAddress: [
    {
      fullName: String,
      phone: String,
      address: String,
      country: String,
      province: String,
      district: String,
      ward: String,
      zipCode: String,
      isDefault: Boolean,
    },
  ],
  paymentMethod: {
    type: String,
    default: 'thanh toán khi nhận hàng',
    required: true,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => moment().tz('Asia/Ho_Chi_Minh').toDate(),
  },
});

orderSchema.methods.isValidStatus = function (newStatus) {
    return this.schema.path('status').enumValues.includes(newStatus);
  };

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

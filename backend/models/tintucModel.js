const mongoose = require('mongoose');
const moment = require('moment-timezone');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  newsImage: {
    type: [String], // Giả sử là đường dẫn hình ảnh
    default: null,
  },
  publishedAt: {
    type: Date,
    default: () => moment().tz('Asia/Ho_Chi_Minh').toDate(),
  },
});

const News = mongoose.model('News', newsSchema);

module.exports = News;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: mongoose.Types.ObjectId,
    auto: true },
  productName: String,
  productDescription: String,
  productPrice: Number,
  productImage: {
    type: [String],
  },
  productQuantity: Number,
  mainCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainCategory'
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

const mongoose = require('mongoose');

const mainCategorySchema = new mongoose.Schema({
  mainCategoryId: {
    type: String,
  },
  mainCategoryName: String,
  subCategoryIds: []
});

mainCategorySchema.pre('save', function (next) {
  if (!this.mainCategoryId) {
    this.mainCategoryId = this._id.toString();
  }
  next();
});

const MainCategory = mongoose.model('MainCategory', mainCategorySchema);

module.exports = MainCategory;

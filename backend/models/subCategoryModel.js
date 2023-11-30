const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  subCategoryName: String,
  mainCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainCategory'
  },
  subCategoryId: {
    type: String,
  }
});

subCategorySchema.pre('save', function (next) {
  if (!this.subCategoryId) {
    this.subCategoryId = this._id.toString();
  }
  next();
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;

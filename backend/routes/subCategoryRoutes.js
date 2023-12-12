const express = require('express');
const SubCategory = require('../models/subCategoryModel');
const MainCategory = require('../models/mainCategoryModel');
const Product = require('../models/productModel');

const router = express.Router();

router.get('/api/subcategories', async (req, res) => {
    const subCategories = await SubCategory.find();
    res.json(subCategories);
});

router.post('/api/subcategories', async (req, res) => {
    const { subCategoryName, mainCategoryId } = req.body;
    
    // Kiểm tra xem mainCategoryId có tồn tại và hợp lệ không
    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) {
      return res.status(400).json({ message: 'Danh mục chính không tồn tại.' });
    }
    
    const subCategory = new SubCategory({ subCategoryName, mainCategoryId });
    await subCategory.save();
    
    // Cập nhật danh mục chính với danh sách các danh mục phụ (subCategoryIds)
    mainCategory.subCategoryIds.push(subCategory._id);
    await mainCategory.save();
    
    res.status(201).json(subCategory);
  });
  // Modify your router in sub-category.route.js
router.get('/api/maincategories/:mainCategoryId/name', async (req, res) => {
  try {
    const mainCategory = await MainCategory.findById(req.params.mainCategoryId);
    if (mainCategory) {
      res.json(mainCategory.mainCategoryName);
    } else {
      res.status(404).json({ message: 'Main category not found' });
    }
  } catch (error) {
    console.error('Error fetching main category name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/api/subcategories/:id', async (req, res) => {
  const subCategoryId = req.params.id;

  try {
    // Check if the subcategory exists
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Delete the subcategory
    await SubCategory.findByIdAndDelete(subCategoryId);

    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/api/subcategories/:subCategoryId/products', async (req, res) => {
  const { subCategoryId } = req.params;

  try {
      // Tìm danh mục phụ theo ID
      const subCategory = await SubCategory.findById(subCategoryId);

      if (!subCategory) {
          // Nếu không tìm thấy danh mục phụ, trả về lỗi 404
          return res.status(404).json({ error: 'Sub category not found' });
      }

      // Tìm tất cả các sản phẩm thuộc danh mục phụ
      const products = await Product.find({ subCategoryId: subCategory._id });

      // Trả về danh sách các sản phẩm
      res.json(products);
  } catch (error) {
      // Xử lý bất kỳ lỗi nào xảy ra
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

const express = require('express');
const MainCategory = require('../models/mainCategoryModel');
const SubCategory = require('../models/subCategoryModel');

const router = express.Router();

router.get('/api/maincategories', async (req, res) => {
    const mainCategories = await MainCategory.find();
    res.json(mainCategories);
});

router.post('/api/maincategories', async (req, res) => {
    const { mainCategoryName } = req.body;
    const mainCategory = new MainCategory({ mainCategoryName });
    await mainCategory.save();
    res.status(201).json(mainCategory);
});

router.delete('/api/maincategories/:mainCategoryId', async (req, res) => {
    const { mainCategoryId } = req.params;
  
    try {
      // Use findOneAndDelete to find and remove the main category by ID
      const deletedMainCategory = await MainCategory.findOneAndDelete({
        mainCategoryId: mainCategoryId
      });
  
      if (!deletedMainCategory) {
        // If the main category was not found, return a 404 response
        return res.status(404).json({ error: 'Main category not found' });
      }
  
      // If successfully deleted, return a success message
      res.json({ message: 'Main category deleted successfully' });
    } catch (error) {
      // Handle any errors that occurred during the deletion process
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/api/maincategories/:mainCategoryId/subcategories', async (req, res) => {
    const { mainCategoryId } = req.params;
  
    try {
      // Tìm danh mục chính theo ID
      const mainCategory = await MainCategory.findById(mainCategoryId);
  
      if (!mainCategory) {
        // Nếu không tìm thấy danh mục chính, trả về lỗi 404
        return res.status(404).json({ error: 'Main category not found' });
      }
  
      // Tìm tất cả các danh mục phụ thuộc danh mục chính
      const subCategories = await SubCategory.find({ mainCategoryId });
  
      // Trả về danh sách các danh mục phụ
      res.json(subCategories);
    } catch (error) {
      // Xử lý bất kỳ lỗi nào xảy ra
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;

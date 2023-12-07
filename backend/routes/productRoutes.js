const express = require('express');
const Product = require('../models/productModel');
const SubCategory = require('../models/subCategoryModel');
const MainCategory = require('../models/mainCategoryModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');


const router = express.Router();

const sanitizeFilename = (filename) => {
  // Chuyển đổi tên file thành dạng slug (URL-friendly)
  const slug = slugify(filename, { lower: true });
  return slug;
};

let productImageCount = 0;

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads/products');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const mimeType = file.mimetype.split('/');
    const fileType = mimeType[1];
    const sanitizedProductName = sanitizeFilename(req.body.productName);
    const fileName = `${sanitizedProductName}_${productImageCount + 1}.${fileType}`;
    productImageCount++;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.use('/api/products', (req, res, next) => {
  productImageCount = 0;
  next();
});
const staticPath = path.join(__dirname, 'uploads/products');
router.use('/uploads/products', express.static(staticPath));

router.post('/api/products', upload.array('productImage',10), async (req, res) => {
  try {
    const productImages = req.files.map(file => `/uploads/products/${file.filename}`);
    const {
      productName,
      productDescription, 
      productPrice,
      productQuantity,
      mainCategoryId,
      subCategoryId,
    } = req.body;

    // Kiểm tra xem mainCategoryId và subCategoryId có tồn tại và hợp lệ không
    const mainCategory = await MainCategory.findById(mainCategoryId);
    const subCategory = await SubCategory.findById(subCategoryId);

    if (!mainCategory || !subCategory) {
      return res.status(400).json({ message: 'Danh mục chính hoặc phụ không hợp lệ.' });
    }

    const product = new Product({
      productName,
      productDescription,
      productPrice,
      productQuantity,
      mainCategoryId,
      subCategoryId,
      productImage: productImages,
    });

    await product.save();

    // Cập nhật danh mục chính và danh mục phụ với danh sách sản phẩm (productIds)

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo sản phẩm.' });
  }
});

// Route sửa thông tin sản phẩm
router.put('/api/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProduct = req.body;

    const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật sản phẩm.' });
  }
});

// Route xóa sản phẩm
router.delete('/api/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }

    // Xóa sản phẩm khỏi danh mục chính và phụ
    const mainCategory = await MainCategory.findById(product.mainCategoryId);
    const subCategory = await SubCategory.findById(product.subCategoryId);

    if (mainCategory) {
      mainCategory.productIds = mainCategory.productIds.filter(id => id.toString() !== productId);
      await mainCategory.save();
    }

    if (subCategory) {
      subCategory.productIds = subCategory.productIds.filter(id => id.toString() !== productId);
      await subCategory.save();
    }

    res.json({ message: 'Sản phẩm đã được xóa.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sản phẩm.' });
  }
});

// Route lấy danh sách sản phẩm
router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm.' });
  }
});


module.exports = router;
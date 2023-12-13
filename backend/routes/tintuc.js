const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const News = require('../models/tintucModel');

const sanitizeFilename = (filename) => {
  // Chuyển đổi tên file thành dạng slug (URL-friendly)
  const slug = slugify(filename, { lower: true });
  return slug;
};
let newsImageCount = 0;
// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads/news');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const mimeType = file.mimetype.split('/');
    const fileType = mimeType[1];
    const sanitizedNewsTitle = sanitizeFilename(req.body.title);
    const fileName = `${sanitizedNewsTitle}_${newsImageCount + 1}.${fileType}`;
    newsImageCount++;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
router.use('/news', (req, res, next) => {
  newsImageCount = 0;
  next();
});
const staticPath = path.join(__dirname, 'uploads/news');
router.use('/uploads/news', express.static(staticPath))

// Route: Tạo tin tức mới với hình ảnh
router.post('/news', upload.array('newsImage', 10), async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Kiểm tra dữ liệu gửi lên
    const imagePath = req.files.map(file => `/uploads/news/${file.filename}`);
    console.log('Image Path:', imagePath); // Kiểm tra đường dẫn ảnh
    const { title, content, author, tags } = req.body;
    const newNews = new News({ title, content, author, tags, newsImage: imagePath });
    const savedNews = await newNews.save();
    res.json(savedNews);
  } catch (error) {
    console.error('Error:', error); // Kiểm tra lỗi
    res.status(500).json({ error: 'Lỗi khi tạo tin tức mới' });
  }
});
router.get('/news', async (req, res) => {
  try {
    const newsList = await News.find();
    res.json(newsList);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách tin tức' });
  }
});

router.get('/news/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const newsDetail = await News.findById(id);
    if (!newsDetail) {
      return res.status(404).json({ error: 'Không tìm thấy tin tức' });
    }
    res.json(newsDetail);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết tin tức' });
  }
});


// Route: Xóa tin tức theo ID
router.delete('/news/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) {
      return res.status(404).json({ error: 'Không tìm thấy tin tức' });
    }
    res.json(deletedNews);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa tin tức' });
  }
});

module.exports = router;


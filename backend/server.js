const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mainCategoryRoutes = require('./routes/mainCategoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authen'); 
const user = require('./routes/user'); 
const token = require('./routes/token'); 
const giohang = require('./routes/giohang'); 
const donhang = require('./routes/donhang'); 

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb+srv://admin:admin@ttcn2.j4imb6x.mongodb.net/test', { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
  console.log("kết nối db thành công")
});

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(mainCategoryRoutes);
app.use(subCategoryRoutes);
app.use(productRoutes);
app.use(user);
app.use(token);
app.use(giohang);
app.use(donhang);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


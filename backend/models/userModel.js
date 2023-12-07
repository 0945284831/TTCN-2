const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const contactInfoSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  address: String,
  country: String,
  province: String,
  district: String,
  ward: String,
  zipCode: String,
  isDefault: Boolean,
});

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId, auto: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  contactInfo: [contactInfoSchema],
});



// Trước khi lưu, hash mật khẩu
userSchema.pre('save', async function (next) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
  
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      return next();
    } catch (error) {
      return next(error);
    }
  });
  
  // Method to compare entered password with stored hashed password
  userSchema.methods.comparePassword = async function (enteredPassword) {
    try {
      return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
      throw error;
    }
  };
  

const User = mongoose.model('User', userSchema);

module.exports = User;

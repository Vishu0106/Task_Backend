import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
     type: String,
     required: true, 
     unique: true 
    },
  password: { 
    type: String, 
    required: true 
}
},{timestamps:true});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare given password with hashed password
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);
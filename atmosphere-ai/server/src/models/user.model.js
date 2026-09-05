import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema Definition for Atmosphere AI
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      default: 'Weather Explorer',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Never return passwordHash by default in queries
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Virtual for password field setter
 * Allows setting `user.password = 'myPlaintextPassword'` before save
 */
userSchema.virtual('password').set(function (plainPassword) {
  this._plainPassword = plainPassword;
});

/**
 * Pre-validate hook to hash password if set or modified
 * Runs before schema field requirements are checked
 */
userSchema.pre('validate', async function (next) {
  try {
    if (this._plainPassword) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this._plainPassword, salt);
    } else if (this.isModified('passwordHash') && this.passwordHash && !this.passwordHash.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Method to verify password match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * JSON serialization transform
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj._plainPassword;
  delete obj.__v;
  return obj;
};

export const User = mongoose.model('User', userSchema);
export default User;
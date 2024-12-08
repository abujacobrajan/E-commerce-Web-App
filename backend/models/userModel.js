import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    phone: { type: String },
    role: {
      type: String,
      default: 'user',
    },
    profilePic: {
      type: String,
      default:
        'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg',
    },
    address: {
      house: String,
      street: String,
      district: String,
      state: String,
      pin: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export { User };

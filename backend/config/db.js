import mongoose from 'mongoose';

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_BASE_URI);
    console.log('Database connected succesfully.');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export default connectDB;

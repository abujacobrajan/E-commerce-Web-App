import { Seller } from '../models/sellerModel.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token.js';
import { handleImageUpload } from '../utils/imageUpload.js';

const sellerSignup = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, businessName, profilePic } =
      req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    const isSellerExist = await Seller.findOne({ email });
    if (isSellerExist) {
      return res.status(400).json({ message: 'Seller already exists.' });
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newSeller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      profilePic,
      businessName,
    });

    const token = generateToken(newSeller._id, newSeller.role);

    res.cookie('token', token, {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Seller created successfully',
      seller: newSeller,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const sellerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    const sellerExist = await Seller.findOne({ email });

    if (!sellerExist) {
      return res
        .status(404)
        .json({ success: false, message: 'Seller does not exist.' });
    }

    const passwordMatch = bcrypt.compareSync(password, sellerExist.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Seller not authorized.' });
    }
    const token = generateToken(sellerExist._id, sellerExist.role);

    res.cookie('token', token, {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      sellerId: sellerExist._id,
      role: sellerExist.role,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const sellerLogout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
    });
    res.json({ message: 'Seller logout successful.', success: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const sellerProfile = async (req, res, next) => {
  try {
    const seller = req.user;
    const sellerData = await Seller.findOne({ _id: seller.id });
    res.json({
      success: true,
      message: 'Seller data fetched.',
      data: sellerData,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateSellerProfile = async (req, res, next) => {
  try {
    const sellerId = req.user.id;

    const { name, email, phone, address, password, businessName, status } =
      req.body;

    let imageUrl;

    if (req.file) {
      imageUrl = await handleImageUpload(req.file.path);
    }

    const updateFields = {
      name,
      email,
      phone,
      address: address ? JSON.parse(address) : undefined,
      profilePic: imageUrl || req.body.profilePic,
      businessName,
      status,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value !== undefined)
    );

    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      filteredUpdates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSeller) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully.',
      user: updatedSeller,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteSellerAccount = async (req, res, next) => {
  try {
    const sellerId = req.user.id;

    const deletedSeller = await Seller.findByIdAndDelete(sellerId);

    if (!deletedSeller) {
      return res
        .status(404)
        .json({ success: false, message: 'Seller not found.' });
    }

    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: 'Seller account deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const viewSellerList = async (req, res, next) => {
  try {
    const sellers = await Seller.find().select('-password');

    res.status(200).json({
      success: true,
      message: 'Seller list fetched successfully.',
      sellers,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const checkSeller = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    res.json({
      success: true,
      message: 'Seller is authenticated',
      sellerId: req.user.id,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export {
  sellerSignup,
  sellerLogin,
  sellerLogout,
  sellerProfile,
  updateSellerProfile,
  deleteSellerAccount,
  viewSellerList,
  checkSeller,
};

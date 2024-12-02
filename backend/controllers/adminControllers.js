import { Admin } from '../models/adminModel.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token.js';

const adminSignup = async (req, res, next) => {
  try {
    const { name, email, password, phone, profilePic, address } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }
    const isAdminExist = await Admin.findOne({ email });
    if (isAdminExist) {
      return res.status(400).json({ message: 'Admin already exists.' });
    }
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    console.log(hashedPassword);
    const newUser = await Admin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      profilePic,
      address,
    });

    const token = generateToken(newUser._id);

    res.cookie('token', token, {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    // next(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }
    const adminExist = await Admin.findOne({ email });
    if (!adminExist) {
      return res
        .status(404)
        .json({ success: false, message: 'Admin does not exist.' });
    }
    const passwordMatch = bcrypt.compareSync(password, adminExist.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Admin not authorized.' });
    }
    const token = generateToken(adminExist._id, 'admin');

    res.cookie('token', token, {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      message: 'Admin login successful.',
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || 'Server Error' });
  }
};

const adminLogout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
    });
    res.json({ message: 'Admin logout successful.', success: true });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || 'Server Error' });
  }
};

const adminProfile = async (req, res, next) => {
  try {
    const admin = req.admin;
    const adminData = await Admin.findOne({ _id: admin.id });
    res.json({
      success: true,
      message: 'Admin data fetched successfully.',
      data: adminData,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || 'Server Error' });
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    const { admin } = req;
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: 'Admin not authorized' });
    }

    res.json({
      success: true,
      message: 'Admin authorized.',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

const updateAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const { name, email, phone, profilePic } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { name, email, phone, profilePic },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res
        .status(404)
        .json({ success: false, message: 'Admin not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully.',
      admin: updatedAdmin,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || 'Server Error' });
  }
};

const deleteAdminAccount = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res
        .status(404)
        .json({ success: false, message: 'Admin not found.' });
    }

    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: 'Admin account deleted successfully.',
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || 'Server Error' });
  }
};

const viewAdminList = async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password');

    res.status(200).json({
      success: true,
      message: 'Admin list fetched successfully.',
      admins,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || 'Server Error' });
  }
};

export {
  adminSignup,
  adminLogin,
  adminLogout,
  adminProfile,
  checkAdmin,
  updateAdminProfile,
  deleteAdminAccount,
  viewAdminList,
};

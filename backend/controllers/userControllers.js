import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token.js';
import { handleImageUpload } from '../utils/imageUpload.js';

const userSignup = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, profilePic, address } =
      req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    console.log(hashedPassword);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      profilePic,
      address,
      role,
    });

    const token = generateToken(newUser._id, newUser.role);

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
    next(error);
    // res.status(500).json({ success: false, message: 'Server error' });
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res
        .status(404)
        .json({ success: false, message: 'User does not exist.' });
    }

    const passwordMatch = bcrypt.compareSync(password, userExist.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'User not authorised.' });
    }
    const token = generateToken(userExist._id);

    res.cookie('token', token, {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      message: 'User login successfull.',
    });
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).json({ success: false, message: 'Server error' });
  }
};

const userLogout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
    });
    res.json({ message: 'user logout success.', success: true });
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).json({ success: false, message: 'Server error' });
  }
};

const userProfile = async (req, res, next) => {
  try {
    const user = req.user;
    // const { id } = req.params;
    const userData = await User.findOne({ _id: user.id });
    return res.json({
      success: true,
      message: 'User data fetched.',
      data: userData,
    });
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).json({ success: false, message: 'Server error' });
  }
};

const checkUser = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User not authorized' });
    }
    res.json({
      success: true,
      message: 'User authorized.',
    });
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { name, email, phone, address, password } = req.body;

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
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value !== undefined)
    );

    const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).json({ success: false, message: 'Server error' });
  }
};

const viewUserList = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      message: 'User list fetched successfully.',
      users,
    });
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteUserByAdmin = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export {
  userSignup,
  userLogin,
  userLogout,
  userProfile,
  checkUser,
  updateUserProfile,
  deleteUserAccount,
  viewUserList,
  deleteUserByAdmin,
};

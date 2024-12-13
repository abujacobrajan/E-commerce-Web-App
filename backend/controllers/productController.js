import { cloudinaryInstance } from '../config/cloudinaryConfig.js';
import { upload } from '../middlewares/multer.js';
import { Product } from '../models/productModel.js';
import { handleImageUpload } from '../utils/imageUpload.js';

const createProduct = async (req, res, next) => {
  try {
    const user = req.user;

    const {
      name,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
      rating,
    } = req.body;

    let imageUrl;

    if (
      !name ||
      !brand ||
      !category ||
      !description ||
      !price ||
      !countInStock
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const isProductExist = await Product.findOne({ name });
    if (isProductExist) {
      return res
        .status(400)
        .json({ success: false, message: 'Product already exists.' });
    }

    if (req.file) {
      imageUrl = await handleImageUpload(req.file.path);
    }

    const newProduct = new Product({
      name,
      image: imageUrl,
      brand,
      category,
      description,
      price,
      countInStock,
      seller: req.user.id,
    });
    if (user.role == 'seller') newProduct.seller = user.id;
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: newProduct,
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, brand, category, description, price, countInStock } =
      req.body;

    let imageUrl;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    if (req.file) {
      imageUrl = await handleImageUpload(req.file.path);
    }

    const updateFields = {
      name,
      brand,
      category,
      description,
      price,
      countInStock,
      image: imageUrl,
    };
    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );
    if (name) {
      const existingProduct = await Product.findOne({ name });
      if (existingProduct && existingProduct._id.toString() !== productId) {
        return res.status(400).json({
          success: false,
          message: `Product with the name "${name}" already exists.`,
        });
      }
    }
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: `Product with the name "${req.body.name}" already exists.`,
      });
    } else {
      console.error('Error in updateProduct:', error);
      next(error);
    }
  }
};

const listAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error in listAllProducts:', error);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate('seller', 'name email')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name',
        },
      });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error in getProductById:', error);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    console.log('Delete product by ID route hit.');

    const { productId } = req.params;

    const productDeleted = await Product.findByIdAndDelete({ _id: productId });
    if (!productDeleted) {
      return res.status(404).json({ message: 'Product already deleted.' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    console.error('Error in deleteProductById:', error);
    next(error);
  }
};

const listSellerProducts = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    console.log('Seller ID:', sellerId);
    const products = await Product.find({ seller: sellerId });
    console.log('Products found:', products);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error in listSellerProducts:', error);
    next(error);
  }
};

export {
  createProduct,
  updateProduct,
  listAllProducts,
  getProductById,
  deleteProduct,
  listSellerProducts,
};

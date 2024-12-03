import { Wishlist } from '../models/wishlistModel.js';

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: 'Product ID is required' });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
      return res
        .status(200)
        .json({ success: true, message: 'Product added to wishlist' });
    } else {
      return res
        .status(400)
        .json({ success: false, message: 'Product already in wishlist' });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add product to wishlist',
      error: error.message,
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ userId }).populate('products');

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: 'Wishlist not found' });
    }

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message,
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: 'Product ID is required' });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: 'Wishlist not found' });
    }

    const productIndex = wishlist.products.indexOf(productId);

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found in wishlist' });
    }

    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    res
      .status(200)
      .json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove product from wishlist',
      error: error.message,
    });
  }
};

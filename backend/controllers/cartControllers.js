import { Cart } from '../models/cartModel.js';
import { Product } from '../models/productModel.js';
import { User } from '../models/userModel.js';

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log('User ID:', userId);
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        products: [],
        address: user.address,
      });
    }

    const existingProductIndex = cart.products.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({
        productId: product._id,
        price: product.price,
        quantity,
      });
    }

    cart.calculateTotalPrice();

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product added to cart successfully.',
      data: cart,
    });
  } catch (error) {
    console.error('Error in addProductToCart:', error);
    next(error);
  }
};

export const updateProductQuantityInCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const productIndex = cart.products.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    cart.products[productIndex].quantity = quantity;

    cart.calculateTotalPrice();

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product quantity updated successfully.',
      data: cart,
    });
  } catch (error) {
    console.error('Error in updateProductQuantityInCart:', error);
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const productIndex = cart.products.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    cart.products.splice(productIndex, 1);

    cart.calculateTotalPrice();

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from cart successfully.',
      data: cart,
    });
  } catch (error) {
    console.error('Error in removeProductFromCart:', error);
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    cart.products = [];

    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully.',
      data: cart,
    });
  } catch (error) {
    console.error('Error in clearCart:', error);
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart) {
      cart = {
        userId,
        products: [
          {
            productId: {
              _id: 'dummyProductId123',
              name: 'Sample Product',
              price: 20.0,
              description: 'This is a sample product.',
              imageUrl: 'https://example.com/sample-product.jpg',
            },
            quantity: 1,
          },
        ],
      };
    }

    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully with a sample product.',
      data: cart,
    });
  } catch (error) {
    console.error('Error in getCart:', error);
    next(error);
  }
};

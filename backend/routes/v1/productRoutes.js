import express from 'express';
import {
  createProduct,
  updateProduct,
  listAllProducts,
  getProductById,
  deleteProduct,
  listSellerProducts,
} from '../../controllers/productController.js';
import { upload } from '../../middlewares/multer.js';
import { sellerAuth } from '../../middlewares/sellerAuth.js';

const router = express.Router();

router.post('/create', sellerAuth, upload.single('image'), createProduct);
router.put(
  '/update/:productId',
  sellerAuth,
  upload.single('image'),
  updateProduct
);
router.get('/productlists', listAllProducts);
router.get('/seller-products', sellerAuth, listSellerProducts);
router.get('/:productId', getProductById);
router.delete('/delete/:productId', sellerAuth, deleteProduct);
export { router as productRoutes };

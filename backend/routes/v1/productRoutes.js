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
router.put('/update/:id', sellerAuth, upload.single('image'), updateProduct);
router.get('/productlists', listAllProducts);
router.get('/seller-products', sellerAuth, listSellerProducts);
router.get('/:id', getProductById);
router.delete('/delete/:id', sellerAuth, deleteProduct);
export { router as productRoutes };

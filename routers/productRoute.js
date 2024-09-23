import express from 'express';
import { requireSignIn, isAdmin } from './../middlewares/authMiddleware.js';
import {
    createProductController,
    deleteProductController,
    getProductController,
    getProductsByCategoryController,
    getSingleProductBySlugController,
    getSingleProductByIdController,
    productFilterController,
    productPhotoController,
    updateProductByIdController,
    updateProductBySlugController,
    createPaymentController
} from '../controllers/productController.js';
import Formidable from 'express-formidable';

const router = express.Router();

// Route to create a new product
router.post('/create-product', requireSignIn, isAdmin, Formidable(), createProductController);

// Route to get all products with optional search and price range filtering
router.get('/get-product', getProductController);

// Route to get a single product by ID
router.get('/get-product/:productId', getSingleProductByIdController);

// Route to get a single product by slug
router.get('/product/slug/:slug', getSingleProductBySlugController);

// Update a product by ID
router.put('/update-product/:productId', requireSignIn, isAdmin, Formidable(), updateProductByIdController);

// Update a product by slug
router.put('/update-product/slug/:slug', requireSignIn, isAdmin, Formidable(), updateProductBySlugController);

// Photo
router.get('/product-photo/:productId', productPhotoController);

// Get products by category
router.get('/products/:categoryId', getProductsByCategoryController);

// Route to delete a product by ID
router.delete('/delete-product/:productId', requireSignIn, isAdmin, deleteProductController);

// Route for product filtering
router.get('/filter', productFilterController);



export default router;

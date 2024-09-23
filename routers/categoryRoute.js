import express from 'express'
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoryByIdController, getProductsByCategorySlug, updateCategoryController } from '../controllers/categoryController.js';


const router = express.Router()

router.post('/create-category', requireSignIn, isAdmin, createCategoryController);
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);
router.get('/get-category', getAllCategoriesController);
router.get('/single-category/:id', getCategoryByIdController);
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);
router.get('/:slug', getProductsByCategorySlug);
export default router;
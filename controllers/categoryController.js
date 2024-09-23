import slugify from 'slugify';
import categoryModel from '../models/categoryModel.js'; // Use the correct model name
import Product from '../models/productModel.js';
// Create Category Controller
export const createCategoryController = async (req, res) => {
    try {
        const { name, slug } = req.body;

        // Validate input
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Name is required"
            });
        }

        // Check if the category already exists
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(409).send({
                success: false,
                message: "Category already exists"
            });
        }

        const category = new categoryModel({
            name,
            slug: slug ? slugify(slug) : slugify(name)
        });

        await category.save();

        res.status(201).send({
            success: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error creating category"
        });
    }
};

// Update Category Controller
export const updateCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;

        // Validate input
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Name is required"
            });
        }

        // Find the category by ID
        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found"
            });
        }

        // Update category details
        category.name = name;
        category.slug = slug ? slugify(slug) : slugify(name);

        const updatedCategory = await category.save(); // Save the updated category

        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error updating category"
        });
    }
};


export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.status(200).send({
            success: true,
            message: "Categories retrieved successfully",
            data: categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error retrieving categories"
        });
    }
};

export const getCategoryByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Category retrieved successfully",
            data: category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error retrieving category"
        });
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params; // Category ID to delete

        // Find and delete the category by ID
        const category = await categoryModel.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Category deleted successfully",
            data: category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error deleting category"
        });
    }
};

export const getProductsByCategorySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOne({ slug });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const products = await Product.find({ category: category._id });

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ success: false, message: 'Error fetching products by category' });
    }
};
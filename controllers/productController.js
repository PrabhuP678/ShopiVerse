import Product from '../models/productModel.js'; // Adjust path as needed
import slugify from 'slugify';
import fs from 'fs';
import Stripe from 'stripe';

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files; // Handle file upload if applicable

        if (!name || !description || !price || !category || !quantity) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        if (photo && photo.size > 1000000) { // Check file size (1MB)
            return res.status(400).json({ success: false, message: 'Photo size exceeds limit. Maximum size is 1MB.' });
        }

        const product = new Product({
            name,
            slug: slugify(name),
            description,
            price,
            category,
            quantity,
            shipping,
            photo: photo ? {
                data: fs.readFileSync(photo.path),
                contentType: photo.mimetype
            } : null
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

export const getProductsByCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.find({ category: categoryId });
        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
        });
    }
};

export const getProductController = async (req, res) => {
    try {
        const { search, minPrice, maxPrice } = req.query;
        let query = {};

        if (search) {
            const regex = new RegExp(search, 'i');
            query.name = { $regex: regex };
        }

        if (minPrice && maxPrice) {
            query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
        }

        const products = await Product.find(query).select("-photo").populate("category");

        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const updateProductByIdController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        if (!name || !description || !price || !category || !quantity) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const updateData = {
            name,
            slug: slugify(name),
            description,
            price,
            category,
            quantity,
            shipping
        };

        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (photo) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(photo.type)) {
                return res.status(400).json({ success: false, message: 'Invalid file type. Only images are allowed.' });
            }

            if (photo.size > 5 * 1024 * 1024) { // 5MB
                return res.status(400).json({ success: false, message: 'File size exceeds limit. Maximum size is 5MB.' });
            }

            updateData.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type
            };
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, updateData, { new: true });

        res.status(200).json({ success: true, message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
    }
};

export const updateProductBySlugController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        if (!name || !description || !price || !category || !quantity) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const updateData = {
            name,
            slug: slugify(name),
            description,
            price,
            category,
            quantity,
            shipping
        };

        const product = await Product.findOne({ slug: req.params.slug });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (photo) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(photo.type)) {
                return res.status(400).json({ success: false, message: 'Invalid file type. Only images are allowed.' });
            }

            if (photo.size > 5 * 1024 * 1024) { // 5MB
                return res.status(400).json({ success: false, message: 'File size exceeds limit. Maximum size is 5MB.' });
            }

            updateData.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type
            };
        }

        const updatedProduct = await Product.findOneAndUpdate({ slug: req.params.slug }, updateData, { new: true });

        res.status(200).json({ success: true, message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
    }
};

export const getSingleProductByIdController = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)
            .select("-photo")
            .populate("category");

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, message: "Product fetched", product });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getSingleProductBySlugController = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, message: "Product fetched", product });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const productPhotoController = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).select('photo');

        if (!product || !product.photo || !product.photo.data) {
            return res.status(404).json({ success: false, message: 'Photo not found' });
        }

        res.set('Content-Type', product.photo.contentType);
        return res.send(product.photo.data);

    } catch (error) {
        console.error('Error fetching product photo:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product photo',
            error: error.message
        });
    }
};

export const deleteProductController = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.productId).select('-photo');
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
    }
};

export const productFilterController = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, minRating, maxRating, sortBy, page = 1, limit = 10 } = req.query;

        const query = {};

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (minRating || maxRating) {
            query.rating = {};
            if (minRating) query.rating.$gte = Number(minRating);
            if (maxRating) query.rating.$lte = Number(maxRating);
        }

        const sort = {};
        if (sortBy) {
            const [field, order] = sortBy.split('_');
            sort[field] = order === 'asc' ? 1 : -1;
        }

        const skip = (page - 1) * limit;
        const limitNumber = parseInt(limit);

        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNumber);

        const totalProducts = await Product.countDocuments(query);

        res.json({
            success: true,
            products,
            totalProducts,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / limitNumber),
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while filtering products',
            error,
        });
    }
};



const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY); // Add your Stripe secret key in your .env file

export const createPaymentController = async (req, res) => {
    try {
        const { productIds, paymentMethodId } = req.body;

        if (!productIds || productIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No products selected for purchase' });
        }

        // Log the received product IDs for debugging
        console.log('Received product IDs:', productIds);

        const products = await Product.find({ _id: { $in: productIds } });

        // Log the retrieved products for debugging
        console.log('Retrieved products:', products);

        if (products.length !== productIds.length) {
            return res.status(404).json({ success: false, message: 'Some products not found' });
        }

        const totalAmount = products.reduce((total, product) => total + product.price, 0) * 100; // Stripe expects amount in cents

        // Log the total amount for debugging
        console.log('Total amount (in cents):', totalAmount);

        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: totalAmount,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
        });

        // Log the payment intent for debugging
        console.log('Payment Intent:', paymentIntent);

        res.status(200).json({
            success: true,
            message: 'Payment successful',
            paymentIntent,
        });
    } catch (error) {
        // Log the error with as much detail as possible
        console.error('Error creating payment:', error);

        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message,
        });
    }
};

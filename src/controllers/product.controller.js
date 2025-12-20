import { Product, Category, Seller, Review } from '../models/index.js';

export const getAllProducts = async (req, res) => {
    try {
        const { 
            category_id, 
            seller_id, 
            status, 
            min_price, 
            max_price,
            search,
            page = 1,
            limit = 20
        } = req.query;

        const query = {};

        if (category_id) {
            query.category_id = category_id;
        }
        if (seller_id) {
            query.seller_id = seller_id;
        }
        if (status) {
            query.status = status;
        }
        if (min_price || max_price) {
            query.price = {};
            if (min_price) query.price.$gte = Number(min_price);
            if (max_price) query.price.$lte = Number(max_price);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const products = await Product.find(query)
            .populate('seller_id', 'store_name')
            .populate('category_id', 'name')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.status(200).json({ 
            success: true,
            count: products.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            products 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
            .populate('seller_id')
            .populate('category_id');
        
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            product 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            product_images, // Now expects array of {filename, mimetype, data, size}
            price, 
            stock_quantity, 
            status,
            seller_id, 
            category_id 
        } = req.body;

        if (!name || !description || !price || !seller_id || !category_id) {
            return res.status(400).json({ 
                success: false,
                message: 'Name, description, price, seller_id, and category_id are required' 
            });
        }

        const seller = await Seller.findById(seller_id);
        if (!seller) {
            return res.status(404).json({ 
                success: false,
                message: 'Seller not found' 
            });
        }

        const categoryIds = Array.isArray(category_id) ? category_id : [category_id];
        const categories = await Category.find({ _id: { $in: categoryIds } });
        if (categories.length !== categoryIds.length) {
            return res.status(404).json({ 
                success: false,
                message: 'One or more categories not found' 
            });
        }

        const product = new Product({
            name,
            description,
            product_images: product_images || [],
            price,
            stock_quantity: stock_quantity || 0,
            status: status || 'active',
            seller_id,
            category_id: categoryIds,
            review_summary: {
                avg_rating: 0,
                rating_count: 0
            }
        });

        await product.save();

        seller.rating_summary.num_products += 1;
        await seller.save();

        await product.populate('seller_id', 'store_name');
        await product.populate('category_id', 'name');

        res.status(201).json({ 
            success: true,
            message: 'Product created successfully',
            product 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        if (updateData.category_id) {
            const categoryIds = Array.isArray(updateData.category_id) 
                ? updateData.category_id 
                : [updateData.category_id];
            const categories = await Category.find({ _id: { $in: categoryIds } });
            if (categories.length !== categoryIds.length) {
                return res.status(404).json({ 
                    success: false,
                    message: 'One or more categories not found' 
                });
            }
        }

        Object.assign(product, updateData);
        product.updated_at = Date.now();
        await product.save();

        await product.populate('seller_id', 'store_name');
        await product.populate('category_id', 'name');

        res.status(200).json({ 
            success: true,
            message: 'Product updated successfully',
            product 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        const seller = await Seller.findById(product.seller_id);
        if (seller && seller.rating_summary.num_products > 0) {
            seller.rating_summary.num_products -= 1;
            await seller.save();
        }

        res.status(200).json({ 
            success: true,
            message: 'Product deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};
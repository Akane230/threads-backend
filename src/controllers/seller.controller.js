import { Seller, User, Product } from '../models/index.js';

export const getAllSellers = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);
        const sellers = await Seller.find()
            .populate('user_id', 'username email first_name last_name profile_picture')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Seller.countDocuments();

        res.status(200).json({ 
            success: true,
            count: sellers.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            sellers 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const getSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const seller = await Seller.findById(id)
            .populate('user_id', 'username email first_name last_name profile_picture');
        
        if (!seller) {
            return res.status(404).json({ 
                success: false,
                message: 'Seller not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            seller 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const getSellerByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const seller = await Seller.findOne({ user_id })
            .populate('user_id', 'username email first_name last_name profile_picture');
        
        if (!seller) {
            return res.status(404).json({ 
                success: false,
                message: 'Seller not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            seller 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const getSellerByStoreName = async (req, res) => {
    try {
        const { storeName } = req.params;
        const seller = await Seller.findOne({ 
            store_name: { $regex: new RegExp(`^${storeName}$`, 'i') }
        }).populate('user_id', 'username email first_name last_name profile_picture');
        
        if (!seller) {
            return res.status(404).json({ 
                success: false,
                message: 'Seller not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            seller 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const createSeller = async (req, res) => {
    try {
        const { 
            user_id, 
            store_name, 
            store_description, 
            address, 
            contact_number,
            store_profile_photo,
            store_cover_photo
        } = req.body;

        if (!user_id || !store_name || !store_description || !address || !contact_number) {
            return res.status(400).json({ 
                success: false,
                message: 'User ID, store name, description, address, and contact number are required' 
            });
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        const existingSeller = await Seller.findOne({ user_id });
        if (existingSeller) {
            return res.status(400).json({ 
                success: false,
                message: 'Seller profile already exists for this user' 
            });
        }

        const sellerData = {
            user_id,
            store_name,
            store_description,
            address,
            contact_number,
            rating_summary: {
                avg_rating: 0,
                rating_count: 0,
                num_products: 0
            }
        };

        if (store_profile_photo) {
            sellerData.store_profile_photo = store_profile_photo;
        }

        if (store_cover_photo) {
            sellerData.store_cover_photo = store_cover_photo;
        }

        const seller = new Seller(sellerData);
        await seller.save();
        await seller.populate('user_id', 'username email first_name last_name profile_picture');

        res.status(201).json({ 
            success: true,
            message: 'Seller created successfully',
            seller 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,
                message: 'Seller profile already exists for this user' 
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const updateSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            store_name, 
            store_description, 
            address, 
            contact_number,
            store_profile_photo,
            store_cover_photo
        } = req.body;

        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({ 
                success: false,
                message: 'Seller not found' 
            });
        }

        if (store_name) seller.store_name = store_name;
        if (store_description) seller.store_description = store_description;
        if (address) seller.address = address;
        if (contact_number) seller.contact_number = contact_number;
        if (store_profile_photo !== undefined) seller.store_profile_photo = store_profile_photo;
        if (store_cover_photo !== undefined) seller.store_cover_photo = store_cover_photo;
        
        seller.updated_at = Date.now();

        await seller.save();
        await seller.populate('user_id', 'username email first_name last_name profile_picture');

        res.status(200).json({ 
            success: true,
            message: 'Seller updated successfully',
            seller 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const deleteSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const seller = await Seller.findByIdAndDelete(id);
        
        if (!seller) {
            return res.status(404).json({ 
                success: false,
                message: 'Seller not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Seller deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const getSellerProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            page = 1, 
            limit = 20,
            status,
            min_price,
            max_price,
            category_id,
            search
        } = req.query;

        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({ 
                success: false,
                message: 'Seller not found' 
            });
        }

        const query = { seller_id: id };

        if (status) {
            query.status = status;
        }
        if (min_price || max_price) {
            query.price = {};
            if (min_price) query.price.$gte = Number(min_price);
            if (max_price) query.price.$lte = Number(max_price);
        }
        if (category_id) {
            query.category_id = category_id;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const products = await Product.find(query)
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
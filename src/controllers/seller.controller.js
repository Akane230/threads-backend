import { Seller, User, Product } from '../models/index.js';

export const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find()
            .populate('user_id', 'username email first_name last_name profile_image')
            .sort({ created_at: -1 });

        res.status(200).json({ 
            success: true,
            count: sellers.length,
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
            .populate('user_id', 'username email first_name last_name profile_image');
        
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
            .populate('user_id', 'username email first_name last_name profile_image');
        
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
            contact_number 
        } = req.body;

        if (!user_id || !store_name || !store_description || !address || !contact_number) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
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

        const seller = new Seller({
            user_id,
            store_name,
            store_description,
            address,
            contact_number
        });

        await seller.save();
        await seller.populate('user_id', 'username email first_name last_name profile_image');

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
        const { store_name, store_description, address, contact_number } = req.body;

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
        seller.updated_at = Date.now();

        await seller.save();
        await seller.populate('user_id', 'username email first_name last_name profile_image');

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
        const { page = 1, limit = 20 } = req.query;

        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({ 
                success: false,
                message: 'Seller not found' 
            });
        }

        const skip = (Number(page) - 1) * Number(limit);
        const products = await Product.find({ seller_id: id })
            .populate('category_id', 'name')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments({ seller_id: id });

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


import { User, Product, Seller } from '../models/index.js';

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ created_at: -1 });

        res.status(200).json({ 
            success: true,
            count: users.length,
            users 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Get single user
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, username, email, profile_image } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (username) user.username = username;
        if (email) user.email = email;
        if (profile_image !== undefined) user.profile_image = profile_image;

        await user.save();

        res.status(200).json({ 
            success: true,
            message: 'User updated successfully',
            user: {
                _id: user._id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                profile_image: user.profile_image,
                wishlist_ids: user.wishlist_ids,
                following_seller_ids: user.following_seller_ids,
                addresses: user.addresses,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                success: false,
                message: `${field} already exists` 
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'User deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Add address to user
export const addAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { address_type, street, city, province, postal_code, is_default } = req.body;

        if (!address_type || !street || !city || !province || !postal_code) {
            return res.status(400).json({ 
                success: false,
                message: 'All address fields are required' 
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // If this is set as default, unset other defaults
        if (is_default) {
            user.addresses.forEach(addr => {
                addr.is_default = false;
            });
        }

        user.addresses.push({
            address_type,
            street,
            city,
            province,
            postal_code,
            is_default: is_default || false
        });

        await user.save();

        res.status(200).json({ 
            success: true,
            message: 'Address added successfully',
            user: {
                _id: user._id,
                addresses: user.addresses
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Update address
export const updateAddress = async (req, res) => {
    try {
        const { id, addressIndex } = req.params;
        const { address_type, street, city, province, postal_code, is_default } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        const index = parseInt(addressIndex);
        if (index < 0 || index >= user.addresses.length) {
            return res.status(404).json({ 
                success: false,
                message: 'Address not found' 
            });
        }

        if (address_type) user.addresses[index].address_type = address_type;
        if (street) user.addresses[index].street = street;
        if (city) user.addresses[index].city = city;
        if (province) user.addresses[index].province = province;
        if (postal_code) user.addresses[index].postal_code = postal_code;
        if (is_default !== undefined) {
            if (is_default) {
                user.addresses.forEach((addr, i) => {
                    addr.is_default = i === index;
                });
            } else {
                user.addresses[index].is_default = false;
            }
        }

        await user.save();

        res.status(200).json({ 
            success: true,
            message: 'Address updated successfully',
            user: {
                _id: user._id,
                addresses: user.addresses
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Delete address
export const deleteAddress = async (req, res) => {
    try {
        const { id, addressIndex } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        const index = parseInt(addressIndex);
        if (index < 0 || index >= user.addresses.length) {
            return res.status(404).json({ 
                success: false,
                message: 'Address not found' 
            });
        }

        user.addresses.splice(index, 1);
        await user.save();

        res.status(200).json({ 
            success: true,
            message: 'Address deleted successfully',
            user: {
                _id: user._id,
                addresses: user.addresses
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({ 
                success: false,
                message: 'Product ID is required' 
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Verify product exists
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        // Check if already in wishlist
        if (user.wishlist_ids.includes(product_id)) {
            return res.status(400).json({ 
                success: false,
                message: 'Product already in wishlist' 
            });
        }

        user.wishlist_ids.push(product_id);
        await user.save();

        res.status(200).json({ 
            success: true,
            message: 'Product added to wishlist',
            wishlist_ids: user.wishlist_ids
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { id, product_id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        user.wishlist_ids = user.wishlist_ids.filter(
            id => id.toString() !== product_id
        );
        await user.save();

        res.status(200).json({ 
            success: true,
            message: 'Product removed from wishlist',
            wishlist_ids: user.wishlist_ids
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Follow seller
export const followSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const { seller_id } = req.body;

        if (!seller_id) {
            return res.status(400).json({ 
                success: false,
                message: 'Seller ID is required' 
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Verify seller exists
        const seller = await Seller.findById(seller_id);
        if (!seller) {
            return res.status(404).json({ 
                success: false,
                message: 'Seller not found' 
            });
        }

        // Check if already following
        if (user.following_seller_ids.includes(seller_id)) {
            return res.status(400).json({ 
                success: false,
                message: 'Already following this seller' 
            });
        }

        user.following_seller_ids.push(seller_id);
        await user.save();

        res.status(200).json({ 
            success: true,
            message: 'Seller followed successfully',
            following_seller_ids: user.following_seller_ids
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Unfollow seller
export const unfollowSeller = async (req, res) => {
    try {
        const { id, seller_id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        user.following_seller_ids = user.following_seller_ids.filter(
            id => id.toString() !== seller_id
        );
        await user.save();

        res.status(200).json({ 
            success: true,
            message: 'Seller unfollowed successfully',
            following_seller_ids: user.following_seller_ids
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};


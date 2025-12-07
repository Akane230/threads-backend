import { Review, Product, User } from '../models/index.js';

export const getAllReviews = async (req, res) => {
    try {
        const { product_id, user_id, page = 1, limit = 20 } = req.query;
        const query = {};

        if (product_id) query.product_id = product_id;
        if (user_id) query.user_id = user_id;

        const skip = (Number(page) - 1) * Number(limit);
        const reviews = await Review.find(query)
            .populate('user_id', 'username first_name last_name profile_image')
            .populate('product_id', 'name product_image')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Review.countDocuments(query);

        res.status(200).json({ 
            success: true,
            count: reviews.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            reviews 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const getReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id)
            .populate('user_id', 'username first_name last_name profile_image')
            .populate('product_id', 'name product_image');
        
        if (!review) {
            return res.status(404).json({ 
                success: false,
                message: 'Review not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            review 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const createReview = async (req, res) => {
    try {
        const { user_id, product_id, rating, comment, images } = req.body;

        if (!user_id || !product_id || !rating || !comment) {
            return res.status(400).json({ 
                success: false,
                message: 'User ID, product ID, rating, and comment are required' 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false,
                message: 'Rating must be between 1 and 5' 
            });
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        const existingReview = await Review.findOne({ user_id, product_id });
        if (existingReview) {
            return res.status(400).json({ 
                success: false,
                message: 'You have already reviewed this product' 
            });
        }

        const review = new Review({
            user_id,
            product_id,
            rating,
            comment,
            images: images || []
        });

        await review.save();

        await updateProductReviewSummary(product_id);

        await review.populate('user_id', 'username first_name last_name profile_image');
        await review.populate('product_id', 'name product_image');

        res.status(201).json({ 
            success: true,
            message: 'Review created successfully',
            review 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment, images } = req.body;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ 
                success: false,
                message: 'Review not found' 
            });
        }

        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Rating must be between 1 and 5' 
                });
            }
            review.rating = rating;
        }
        if (comment !== undefined) review.comment = comment;
        if (images !== undefined) review.images = images;

        await review.save();

        await updateProductReviewSummary(review.product_id);

        await review.populate('user_id', 'username first_name last_name profile_image');
        await review.populate('product_id', 'name product_image');

        res.status(200).json({ 
            success: true,
            message: 'Review updated successfully',
            review 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);
        
        if (!review) {
            return res.status(404).json({ 
                success: false,
                message: 'Review not found' 
            });
        }

        const product_id = review.product_id;
        await Review.findByIdAndDelete(id);

        await updateProductReviewSummary(product_id);

        res.status(200).json({ 
            success: true,
            message: 'Review deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

const updateProductReviewSummary = async (product_id) => {
    const reviews = await Review.find({ product_id });
    const rating_count = reviews.length;
    const avg_rating = rating_count > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / rating_count
        : 0;

    await Product.findByIdAndUpdate(product_id, {
        'review_summary.avg_rating': Math.round(avg_rating * 10) / 10,
        'review_summary.rating_count': rating_count
    });
};


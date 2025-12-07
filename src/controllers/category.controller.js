import { Category } from '../models/index.js';

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        
        res.status(200).json({ 
            success: true,
            count: categories.length,
            categories 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Get single category
export const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        
        if (!category) {
            return res.status(404).json({ 
                success: false,
                message: 'Category not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            category 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Create category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ 
                success: false,
                message: 'Name and description are required' 
            });
        }

        const category = new Category({ name, description });
        await category.save();

        res.status(201).json({ 
            success: true,
            message: 'Category created successfully',
            category 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,
                message: 'Category name already exists' 
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ 
                success: false,
                message: 'Category not found' 
            });
        }

        if (name) category.name = name;
        if (description) category.description = description;

        await category.save();

        res.status(200).json({ 
            success: true,
            message: 'Category updated successfully',
            category 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,
                message: 'Category name already exists' 
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        
        if (!category) {
            return res.status(404).json({ 
                success: false,
                message: 'Category not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Category deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};


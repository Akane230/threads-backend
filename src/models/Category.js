import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
	{
		name: { 
            type: String, 
            required: true, 
            index: true,
            unique: true
        },
		description: { 
            type: String,
            required: true,
            index: true
        }
	},
	{ 
        timestamps: true,
        index: true
    }
);

const Category = mongoose.model('Category', CategorySchema);
export default Category;



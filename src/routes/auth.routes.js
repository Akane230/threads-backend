import express from 'express';
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (user_id) => {
    return jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// User Registration Route
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, username, email, password, confirm_password } = req.body;
        if (!first_name || !last_name || !username || !email || !password || !confirm_password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters long" });
        }

        if (password !== confirm_password) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const profile_image = `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`;

        const user = new User({ 
            first_name, 
            last_name, 
            username, 
            email, 
            password,
            profile_image       
        });
        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({   
            success: true,
            message: "User registered successfully", 
            token,
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                password: user.password
            }
            
        });

        } catch (error) {
            res.status(500).json({ 
                message: "Server Error",
                error: error.message,
            });
        }
    });


//Uer Login Route    
router.post("/login", async(req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ 
                success: false,
                message: "Email and password are required" 
            });
        }

        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({ 
            success: true,
            message: "Login successful",
            token,
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                password: user.password
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        })
    }
});

export default router;
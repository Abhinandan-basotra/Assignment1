import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        const sanitizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: sanitizedEmail }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, 
            sameSite: 'lax', 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            message: 'Logged in successfully',
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide all required fields' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, error: 'Passwords do not match' });
        }

        const sanitizedUsername = username.trim();
        const sanitizedEmail = email.toLowerCase().trim();

        if (sanitizedUsername.length < 3 || sanitizedUsername.length > 30) {
            return res.status(400).json({ success: false, error: 'Username must be between 3 and 30 characters' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ $or: [{ email: sanitizedEmail }, { username: sanitizedUsername }] });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email or username already exists' });
        }

        const user = new User({ username: sanitizedUsername, email: sanitizedEmail, password });
        await user.save();

        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // Disable for local development
            sameSite: 'lax', // Less restrictive for local dev
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('Register error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Email or username already exists' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('authToken');
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export const getUser = async (req, res) => {
    try {
        console.log('getUser called - req.cookies:', req.cookies);
        console.log('getUser called - req.user:', req.user);
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
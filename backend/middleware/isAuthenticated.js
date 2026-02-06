import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try {
        console.log('Auth middleware - Cookies:', req.cookies);
        console.log('Auth middleware - authToken:', req.cookies?.authToken);
        
        const token = req.cookies?.authToken;

        if (!token) {
            console.log('No token found in cookies');
            return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ success: false, error: 'Invalid token.' });
    }
}
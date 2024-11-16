// JWT Authentication Middleware
const jwt = require('jsonwebtoken');

let authMiddleware = (req, res, next) => {
    
const authHeader = req.headers.authorization;
    // Check if token is provided
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token,process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Attach the decoded info (e.g., user ID) to req.user
        req.user = decoded;
        next(); // Move to the next middleware or route handler
    });
};

module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: '访问被拒绝，没有提供token'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'token无效，用户不存在'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('认证中间件错误:', error);
        res.status(401).json({
            success: false,
            message: 'token无效'
        });
    }
};

module.exports = authMiddleware;

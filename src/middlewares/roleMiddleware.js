import STATUS from '../constants/statusCodes.js';

// Middleware to check if user has one of the allowed roles
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // req.user.role can be either a string (from JWT) or populated Role object
        const userRole = typeof req.user.role === 'string'
            ? req.user.role
            : req.user.role?.name;

        if (!allowedRoles.includes(userRole)) {
            return res.status(STATUS.FORBIDDEN).json({
                success: false,
                message: 'You do not have permission to access this resource'
            });
        }

        next();
    };
};

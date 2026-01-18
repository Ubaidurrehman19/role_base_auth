import express from 'express';
import STATUS from '../constants/statusCodes.js';
import DashboardService from '../services/dashboardService.js';
import { authenticateToken } from '../middlewares/authmiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();
const dashboardService = new DashboardService();

// Admin dashboard - Admin only
router.get('/admin', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const data = await dashboardService.getAdminDashboard(req.user.userId);
        return res.status(STATUS.OK).json({
            success: true,
            data
        });
    } catch (err) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message
        });
    }
});

// User dashboard - Authenticated users
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const data = await dashboardService.getUserDashboard(req.user.userId);
        return res.status(STATUS.OK).json({
            success: true,
            data
        });
    } catch (err) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message
        });
    }
});

// Statistics - Role-based
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const stats = await dashboardService.getStats(req.user.role);
        return res.status(STATUS.OK).json({
            success: true,
            data: stats
        });
    } catch (err) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message
        });
    }
});

export default router;

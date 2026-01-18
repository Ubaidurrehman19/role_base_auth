import express from 'express';
import STATUS from '../constants/statusCodes.js';
import RoleService from '../services/roleService.js';
import { authenticateToken } from '../middlewares/authmiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();
const roleService = new RoleService();

// Create role - Admin only
router.post('/', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const { name, permissions, description } = req.body;
        const result = await roleService.createRole(name, permissions, description);
        return res.status(STATUS.CREATED).json({
            success: true,
            message: result.message,
            data: result.role
        });
    } catch (err) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: err.message
        });
    }
});

// Get all roles - Authenticated users
router.get('/', authenticateToken, async (req, res) => {
    try {
        const roles = await roleService.getAllRoles();
        return res.status(STATUS.OK).json({
            success: true,
            data: roles
        });
    } catch (err) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message
        });
    }
});

// Get role by ID - Authenticated users
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const role = await roleService.getRoleById(req.params.id);
        return res.status(STATUS.OK).json({
            success: true,
            data: role
        });
    } catch (err) {
        return res.status(STATUS.NOT_FOUND).json({
            success: false,
            message: err.message
        });
    }
});

// Update role - Admin only
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const { name, permissions, description } = req.body;
        const result = await roleService.updateRole(req.params.id, {
            name,
            permissions,
            description
        });
        return res.status(STATUS.OK).json({
            success: true,
            message: result.message,
            data: result.role
        });
    } catch (err) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: err.message
        });
    }
});

// Delete role - Admin only
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const result = await roleService.deleteRole(req.params.id);
        return res.status(STATUS.OK).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: err.message
        });
    }
});

export default router;

import User from '../models/user.js';
import Role from '../models/Role.js';

export default class DashboardService {

    // Get admin dashboard data
    async getAdminDashboard(userId) {
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalRoles = await Role.countDocuments();

        // Get user distribution by role
        const usersByRole = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get recent users (last 10)
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('role', 'name description');

        // Get all roles with user count
        const roles = await Role.find();
        const rolesWithCount = await Promise.all(
            roles.map(async (role) => {
                const userCount = await User.countDocuments({ role: role._id });
                return {
                    ...role.toObject(),
                    userCount
                };
            })
        );

        return {
            stats: {
                totalUsers,
                totalRoles,
                usersByRole
            },
            recentUsers,
            roles: rolesWithCount
        };
    }

    // Get user dashboard data
    async getUserDashboard(userId) {
        const user = await User.findById(userId)
            .select('-password')
            .populate('role', 'name description permissions');

        if (!user) {
            throw new Error('User not found');
        }

        return {
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                createdAt: user.createdAt
            },
            message: `Welcome back, ${user.username}!`
        };
    }

    // Get statistics based on role
    async getStats(userRole) {
        if (userRole === 'ADMIN') {
            const totalUsers = await User.countDocuments();
            const totalRoles = await Role.countDocuments();
            const adminCount = await User.countDocuments({ role: 'ADMIN' });
            const userCount = await User.countDocuments({ role: 'USER' });

            return {
                totalUsers,
                totalRoles,
                adminCount,
                userCount
            };
        } else {
            // Regular users get limited stats
            return {
                message: 'Limited statistics available for your role'
            };
        }
    }
}

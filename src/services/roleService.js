import Role from '../models/Role.js';
import User from '../models/user.js';

export default class RoleService {

    // Create a new role
    async createRole(name, permissions = [], description = '') {
        const existingRole = await Role.findOne({ name: name.toUpperCase() });

        if (existingRole) {
            throw new Error('Role already exists');
        }

        if (!name || name.trim() === '') {
            throw new Error('Role name is required');
        }

        const newRole = new Role({
            name: name.toUpperCase(),
            permissions,
            description
        });

        await newRole.save();
        return {
            message: 'Role created successfully',
            role: newRole
        };
    }

    // Get all roles
    async getAllRoles() {
        const roles = await Role.find().sort({ createdAt: -1 });
        return roles;
    }

    // Get role by ID
    async getRoleById(id) {
        const role = await Role.findById(id);

        if (!role) {
            throw new Error('Role not found');
        }

        return role;
    }

    // Update role
    async updateRole(id, updates) {
        const role = await Role.findById(id);

        if (!role) {
            throw new Error('Role not found');
        }

        // Prevent updating name to an existing role name
        if (updates.name && updates.name !== role.name) {
            const existingRole = await Role.findOne({ name: updates.name.toUpperCase() });
            if (existingRole) {
                throw new Error('A role with this name already exists');
            }
            role.name = updates.name.toUpperCase();
        }

        // Only update fields that are provided
        if (updates.permissions !== undefined) role.permissions = updates.permissions;
        if (updates.description !== undefined) role.description = updates.description;

        await role.save();

        return {
            message: 'Role updated successfully',
            role
        };
    }

    // Delete role
    async deleteRole(id) {
        const role = await Role.findById(id);

        if (!role) {
            throw new Error('Role not found');
        }

        // Check if any users have this role
        const usersWithRole = await User.countDocuments({ role: id });

        if (usersWithRole > 0) {
            throw new Error(`Cannot delete role. ${usersWithRole} user(s) are assigned to this role`);
        }

        await Role.findByIdAndDelete(id);

        return {
            message: 'Role deleted successfully'
        };
    }

    // Initialize default roles (utility method)
    async initializeDefaultRoles() {
        const defaultRoles = [
            {
                name: 'ADMIN',
                permissions: ['all'],
                description: 'Administrator with full access'
            },
            {
                name: 'USER',
                permissions: ['read'],
                description: 'Regular user with limited access'
            }
        ];

        for (const roleData of defaultRoles) {
            const exists = await Role.findOne({ name: roleData.name });
            if (!exists) {
                await Role.create(roleData);
            }
        }
    }
}

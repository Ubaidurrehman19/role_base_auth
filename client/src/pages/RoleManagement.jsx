import { useState, useEffect } from 'react';
import { roleAPI } from '../services/api';
import RoleForm from '../components/RoleForm';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await roleAPI.getAll();
            setRoles(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load roles');
            setLoading(false);
        }
    };

    const handleDelete = async (id, roleName) => {
        if (!window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
            return;
        }

        try {
            await roleAPI.delete(id);
            fetchRoles();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete role');
        }
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingRole(null);
        fetchRoles();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading roles...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Role Management</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    + Create New Role
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <RoleForm
                    role={editingRole}
                    onClose={handleFormClose}
                />
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Permissions</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    No roles found. Create one to get started!
                                </td>
                            </tr>
                        ) : (
                            roles.map((role) => (
                                <tr key={role._id}>
                                    <td>
                                        <strong>{role.name}</strong>
                                    </td>
                                    <td>{role.description || '-'}</td>
                                    <td>
                                        <div className="permissions-list">
                                            {role.permissions.map((perm, idx) => (
                                                <span key={idx} className="permission-tag">
                                                    {perm}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>{new Date(role.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-small btn-secondary"
                                                onClick={() => handleEdit(role)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-small btn-danger"
                                                onClick={() => handleDelete(role._id, role.name)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoleManagement;

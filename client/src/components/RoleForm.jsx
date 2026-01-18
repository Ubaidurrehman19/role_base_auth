import { useState, useEffect } from 'react';
import { roleAPI } from '../services/api';

const RoleForm = ({ role, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (role) {
            setFormData({
                name: role.name,
                description: role.description || '',
                permissions: role.permissions.join(', '),
            });
        }
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const permissions = formData.permissions
            .split(',')
            .map((p) => p.trim())
            .filter((p) => p);

        try {
            if (role) {
                // Update existing role
                await roleAPI.update(role._id, {
                    description: formData.description,
                    permissions,
                });
            } else {
                // Create new role
                await roleAPI.create(formData.name, permissions, formData.description);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{role ? 'Edit Role' : 'Create New Role'}</h2>
                    <button className="close-button" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="role-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Role Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="e.g., MANAGER"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!!role}
                            required
                        />
                        {role && <small>Role name cannot be changed</small>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Describe the role's purpose"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="permissions">Permissions</label>
                        <input
                            id="permissions"
                            type="text"
                            placeholder="e.g., read, write, delete (comma-separated)"
                            value={formData.permissions}
                            onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                            required
                        />
                        <small>Enter permissions separated by commas</small>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoleForm;

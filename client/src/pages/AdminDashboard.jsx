import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await dashboardAPI.getAdminDashboard();
            setDashboardData(response.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome back, {user?.username}!</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Total Users</h3>
                        <p className="stat-number">{dashboardData?.stats.totalUsers || 0}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🎭</div>
                    <div className="stat-content">
                        <h3>Total Roles</h3>
                        <p className="stat-number">{dashboardData?.stats.totalRoles || 0}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👑</div>
                    <div className="stat-content">
                        <h3>Admins</h3>
                        <p className="stat-number">
                            {dashboardData?.stats.usersByRole?.find(r => r._id === 'ADMIN')?.count || 0}
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🙋</div>
                    <div className="stat-content">
                        <h3>Regular Users</h3>
                        <p className="stat-number">
                            {dashboardData?.stats.usersByRole?.find(r => r._id === 'USER')?.count || 0}
                        </p>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <h2>Recent Users</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData?.recentUsers?.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>
                                        <span className={`badge badge-${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="dashboard-section">
                <h2>Roles Overview</h2>
                <div className="roles-grid">
                    {dashboardData?.roles?.map((role) => (
                        <div key={role._id} className="role-card">
                            <h3>{role.name}</h3>
                            <p className="role-description">{role.description}</p>
                            <div className="role-stats">
                                <span className="role-users">{role.userCount} users</span>
                                <span className="role-permissions">
                                    {role.permissions.length} permissions
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

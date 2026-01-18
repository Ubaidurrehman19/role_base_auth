import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await dashboardAPI.getUserDashboard();
            setDashboardData(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>{dashboardData?.message || 'Welcome!'}</h1>
                <p>Your personal dashboard</p>
            </div>

            <div className="user-profile-section">
                <div className="profile-card">
                    <div className="profile-icon">👤</div>
                    <div className="profile-info">
                        <h2>{dashboardData?.user.username}</h2>
                        <p className="user-role">
                            <span className={`badge badge-${dashboardData?.user.role?.toLowerCase() || 'user'}`}>
                                {dashboardData?.user.role || user?.role}
                            </span>
                        </p>
                        <p className="member-since">
                            Member since {new Date(dashboardData?.user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <div className="info-card">
                    <h3>Account Information</h3>
                    <div className="info-item">
                        <span className="info-label">User ID:</span>
                        <span className="info-value">{dashboardData?.user.id}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Username:</span>
                        <span className="info-value">{dashboardData?.user.username}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Role:</span>
                        <span className="info-value">{dashboardData?.user.role || user?.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;

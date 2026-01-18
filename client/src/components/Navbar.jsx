import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    🔐 Auth System
                </Link>

                {user && (
                    <div className="navbar-menu">
                        <Link to="/dashboard/user" className="nav-link">
                            Dashboard
                        </Link>

                        {isAdmin() && (
                            <>
                                <Link to="/dashboard/admin" className="nav-link">
                                    Admin
                                </Link>
                                <Link to="/roles" className="nav-link">
                                    Roles
                                </Link>
                            </>
                        )}

                        <div className="navbar-user">
                            <span className="user-name">👤 {user.username}</span>
                            <span className={`user-badge badge-${user.role.toLowerCase()}`}>
                                {user.role}
                            </span>
                            <button onClick={handleLogout} className="btn btn-small">
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <header className="navbar">
      <Link className="brand" to={currentUser ? '/dashboard' : '/login'}>
        Firebase Todo
      </Link>
      <div className="nav-actions">
        {currentUser ? (
          <>
            <span className="user-chip">{currentUser.email}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            {location.pathname !== '/login' && (
              <Link className="btn btn-link" to="/login">
                Login
              </Link>
            )}
            {location.pathname !== '/signup' && (
              <Link className="btn btn-link" to="/signup">
                Signup
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;

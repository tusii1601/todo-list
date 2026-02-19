import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Login failed. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-wrapper">
      <h1>Login</h1>
      <form className="auth-card" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            className="text-input"
            type="email"
            required
            value={formData.email}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, email: event.target.value }))
            }
          />
        </label>

        <label>
          Password
          <input
            className="text-input"
            type="password"
            required
            minLength={6}
            value={formData.password}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, password: event.target.value }))
            }
          />
        </label>

        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Login'}
        </button>
        <small>
          Need an account? <Link to="/signup">Sign up here</Link>
        </small>
      </form>
    </section>
  );
}

export default Login;

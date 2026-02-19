import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await signup(formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch {
      toast.error('Signup failed. Please verify your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-wrapper">
      <h1>Create account</h1>
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
          Password (min 6 chars)
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
          {submitting ? 'Creating…' : 'Signup'}
        </button>
        <small>
          Already have an account? <Link to="/login">Login</Link>
        </small>
      </form>
    </section>
  );
}

export default Signup;

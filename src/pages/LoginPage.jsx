// import React, { useState } from 'react';
// import axios from 'axios';
// import styles from './AuthPage.module.css';
// import { useNavigate, NavLink } from 'react-router-dom';

// function LoginPage() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.post('http://localhost:5000/api/auth/login', form)
//       .then(res => {
//         localStorage.setItem('token', res.data.token);
//         localStorage.setItem('role', res.data.user.role);
//         localStorage.setItem('userName', res.data.user.name);
//         navigate('/dashboard'); // redirect to dashboard
//       })
//       .catch(err => alert(err.response?.data?.message || 'Login failed'));
//   };

//   return (
//     <div className={styles.container}>
//       <h1>Login</h1>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
//         <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
//         <button type="submit">Login</button>
//       </form>

//       {/* Create new account link */}
//       <p className={styles.signupText}>
//         Don't have an account?{' '}
//         <NavLink to="/signup" className={styles.signupLink}>
//           Create new account
//         </NavLink>
//       </p>
//     </div>
//   );
// }

// // export default LoginPage;


import { useState } from 'react';
import axios from 'axios';
import styles from './AuthPage.module.css';
import { useNavigate, NavLink } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL; // Use Vite env for API

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, form);

      // Save token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('userName', res.data.user.name);

    
      // Redirect based on role
if (res.data.user.role === 'admin') {
  navigate('/dashboard');
} else if (res.data.user.role === 'storekeeper') {
  navigate('/materials');
} else {
  // worker, engineer, pm
  navigate('/requests');
}

    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className={styles.signupText}>
        Don't have an account?{' '}
        <NavLink to="/signup" className={styles.signupLink}>
          Create new account
        </NavLink>
      </p>
    </div>
  );
}

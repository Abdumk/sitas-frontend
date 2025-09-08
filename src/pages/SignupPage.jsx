// import React, { useState } from 'react';
// import axios from 'axios';
// import styles from './AuthPage.module.css';
// import { useNavigate } from 'react-router-dom';

// function SignupPage() {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'worker', // default role
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.post('http://localhost:5000/api/auth/register', form)
//       .then(res => {
//         alert('User created successfully!');
//         navigate('/login');
//       })
//       .catch(err => alert(err.response?.data?.message || 'Signup failed'));
//   };

//   return (
//     <div className={styles.container}>
//       <h1>Sign Up</h1>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
//         <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
//         <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
//         <select name="role" value={form.role} onChange={handleChange}>
//           <option value="worker">Worker</option>
//           <option value="engineer">Engineer</option>
//           <option value="pm">Project Manager</option>
//           <option value="storekeeper">Storekeeper</option>
//           <option value="admin">Admin</option>
//         </select>
//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// }

// export default SignupPage;


import { useState } from 'react';
import axios from 'axios';
import styles from './AuthPage.module.css';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL; // e.g., https://sitas-pro-backend.onrender.com

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'worker',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, form);
      alert('User created successfully!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="worker">Worker</option>
          <option value="engineer">Engineer</option>
          <option value="pm">Project Manager</option>
          <option value="storekeeper">Storekeeper</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

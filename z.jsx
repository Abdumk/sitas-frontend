
// .header {
//     background-color: #2c3e50; /* Dark blue-grey */
//     color: #ecf0f1; /* Light grey text */
//     /* padding: 1rem 2rem; */
//     padding: 15px;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//     font-family: 'Inter', sans-serif;
//     /* border-bottom-left-radius: 8px; /* Rounded corners */
//     /* border-bottom-right-radius: 8px; Rounded corners  */
//     /* min-width: 90%; */
//     margin: -7px ;
// }

// .appInfo {
//     display: flex;
//     align-items: center;
// }

// .logo {
//     font-size: 2.5rem; /* Larger emoji logo */
//     margin-right: 0.8rem;
// }

// .appTitle {
//     font-size: 1.8rem;
//     font-weight: bold;
//     color: #ecf0f1;
//     text-decoration: none; /* Remove underline from link */
//     transition: color 0.3s ease;
// }

// .appTitle:hover {
//     color: #3498db; /* Blue on hover */
// }

// .userInfo {
//     display: flex;
//     align-items: center;
//     gap: 1.5rem; /* Space between welcome text and button */
// }

// .welcomeText {
//     font-size: 1rem;
//     color: #bdc3c7; /* Slightly darker light grey */
// }

// .logoutButton {
//     background-color: #e74c3c; /* Red */
//     color: white;
//     padding: 0.6rem 1.2rem;
//     border: none;
//     border-radius: 5px;
//     cursor: pointer;
//     font-size: 1rem;
//     font-weight: 600;
//     transition: background-color 0.3s ease, transform 0.2s ease;
// }

// .logoutButton:hover {
//     background-color: #c0392b; /* Darker red on hover */
//     transform: translateY(-2px);
// }
// .link{
//     background-color: #f6a206;
//     color: white;
//     padding: 0.6rem 1.2rem;
//     border: none;
//     border-radius: 5px;
//     cursor: pointer;
//     font-size: 1rem;
//     font-weight: 600;
//     transition: background-color 0.3s ease, transform 0.2s ease;
//     text-decoration: none;
// }
// /* Responsive adjustments */
// @media (max-width: 768px) {
//     .header {
//         flex-direction: column;
//         text-align: center;
//         padding: 1rem;
//         gap: 1rem;
//     }

//     .appInfo {
//         flex-direction: column;
//         gap: 0.5rem;
//     }

//     .appTitle {
//         font-size: 1.5rem;
//     }

//     .userInfo {
//         flex-direction: column;
//         gap: 0.8rem;
//     }

//     .welcomeText {
//         font-size: 0.9rem;
//     }

//     .logoutButton {
//         width: 100%;
//         max-width: 150px;
//         padding: 0.5rem;
//     }
// }

// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import styles from './Header.module.css';

// function Header() {
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');
//     const userName = localStorage.getItem('userName') || 'User';
//     const userRole = localStorage.getItem('role') || '';

//     const handleLogout = () => {
//         localStorage.clear();
//         navigate('/login');
//     };

//     return (
//         <header className={styles.header}>
//             {/* Abbreviation of  "SITAS = Smart Inventory Tracking & Alert System" */}
//             <div className={styles.appInfo}>
//                 <span className={styles.logo}>📦</span>
//                 <NavLink to={token ? "/dashboard" : "/login"} className={styles.appTitle}>
//                     SITAS Pro  
                    
//                 </NavLink>
//             </div>

//             <div className={styles.userInfo}>
//                 {!token ? (
//                     <>
//                         <NavLink to="/login" className={styles.link}>Login</NavLink>
//                         <NavLink to="/signup" className={styles.link}>Sign Up</NavLink>
//                     </>
//                 ) : (
//                     <>
//                         <span className={styles.welcomeText}>
//                             Welcome, {userName} {userRole && `(${userRole})`}
//                         </span>
//                         <button onClick={handleLogout} className={styles.logoutButton}>
//                             Logout
//                         </button>
//                     </>
//                 )}
//             </div>
//         </header>
//     );
// }

// export default Header;


// /* src/pages/Sidebar.module.css */
// :root {
//   --header-h: 90px; /* Adjust to your header's real height */
// }

// .sidebar {
//   width: 240px;
//   height: calc(100vh - var(--header-h)); /* full viewport minus header */
//   background: #2c3e50;
//   color: white;
//   position: sticky;
//   /* top: var(--header-h); 👈 Start below the header */
//   left: 0;
//   /* padding: 6px 7px; */
//   box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
//   /*overflow-y: auto;  scroll if too tall */
//   margin-left: -7px;
//   margin-top: -13px;
// }

// .logo {
//   text-align: center;
//   padding: 10px 20px;
//   border-bottom: 1px solid #34495e;
// }

// .logo h2 {
//   margin: 0;
//   color: #ecf0f1;
//   font-size: 1.3em;
// }

// .menu ul {
//   list-style: none;
//   padding: 0;
//   margin: 0;
// }

// .menu ul li {
//   padding: 8px auto;
// }

// .menu ul li a {
//   color: #bdc3c7;
//   text-decoration: none;
//   display: block;
//   padding: 10px 15px;
//   border-radius: 4px;
//   transition: all 0.3s ease;
// }

// .menu ul li a:hover,
// .menu ul li a.active {
//   background: #34495e;
//   color: #fff;
//   font-weight: 600;
// }
// // src/pages/Sidebar.jsx
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import styles from './Sidebar.module.css'; // ← Import as styles

// function Sidebar() {
//   const role = localStorage.getItem('role');

//   const canView = (allowedRoles) => {
//     if (!role) return false;
//     return allowedRoles.includes(role);
//   };

//   return (
//     <aside className={styles.sidebar}>
//       <div className={styles.logo}>
//         {/* <h2>SITAS Pro</h2> */}
//       </div>

//       <nav className={styles.menu}>
//         <ul>
//           <li>
//             <NavLink
//               to="/dashboard"
//               end
//               className={({ isActive }) => (isActive ? styles.active : '')}
//             >
//               🏠 Dashboard
//             </NavLink>
//           </li>

//           {canView(['admin']) && (
//             <li>
//               <NavLink
//                 to="/projects"
//                 className={({ isActive }) => (isActive ? styles.active : '')}
//               >
//                 🏗️ Projects
//               </NavLink>
//             </li>
//           )}

//           {canView(['admin', 'storekeeper']) && (
//             <li>
//               <NavLink
//                 to="/materials"
//                 className={({ isActive }) => (isActive ? styles.active : '')}
//               >
//                 📦 Materials
//               </NavLink>
//             </li>
//           )}

//           {canView(['worker', 'engineer', 'pm', 'storekeeper','admin']) && (
//             <li>
//               <NavLink
//                 to="/requests"
//                 className={({ isActive }) => (isActive ? styles.active : '')}
//               >
//                 📥 Requests
//               </NavLink>
//             </li>
//           )}


     
//           <li>
//             <NavLink
//               to="/notifications"
//               className={({ isActive }) => (isActive ? styles.active : '')}
//             >
//               🔔 Notifications
//             </NavLink>
//           </li>
//              <li>
//             <NavLink
//               to="/reports"
//               className={({ isActive }) => (isActive ? styles.active : '')}
//             >
//               🔔 Reports
//             </NavLink>
//           </li>
//         </ul>
//       </nav>
//     </aside>
//   );
// }

// export default Sidebar;


/* ProjectsPage.module.css */
.container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

/* Search */
.search {
  padding: 8px 12px;
  font-size: 14px;
  width: 250px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* Form */
.form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.form input,
.form select {
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  flex: 1 1 200px;
}

.form button {
  padding: 4px 20px;
  border-radius: 8px;
  border: none;
   background-color: #f6a206;
  color: #040000;
  cursor: pointer;
  margin-left: 40px;
}

.form button:hover {
  background-color: #0056b3;
}

/* Table */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table th,
.table td {
  padding: 10px;
  border: 1px solid #eee;
  text-align: left;
}

.table th {
  background-color: #f4f4f4;
}
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProjectsPage.module.css';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    location: '',
    managerId: '',
    startDate: '',
    status: 'ongoing',
  });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios
      .get('http://localhost:5000/api/projects', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProjects(res.data))
      .catch((err) => console.log(err));
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form (Add / Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios
        .put(`http://localhost:5000/api/projects/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          fetchProjects();
          resetForm();
        });
    } else {
      axios.post('http://localhost:5000/api/projects', form, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          fetchProjects();
          resetForm();
        });
    }
  };

  const resetForm = () => {
    setForm({ name: '', location: '', managerId: '', startDate: '', status: 'ongoing' });
    setEditId(null);
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name,
      location: project.location,
      managerId: project.managerId,
      startDate: project.startDate.slice(0, 10),
      status: project.status,
    });
    setEditId(project._id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      axios.delete(`http://localhost:5000/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => fetchProjects());
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1>Projects</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.search}
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="name" placeholder="Project Name" value={form.name} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <input type="text" name="managerId" placeholder="Manager ID" value={form.managerId} onChange={handleChange} required />
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">{editId ? 'Update Project' : 'Add Project'}</button>
        {editId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {/* Projects Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Manager ID</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project._id}>
              <td>{project.name}</td>
              <td>{project.location}</td>
              <td>{project.managerId}</td>
              <td>{project.startDate.slice(0, 10)}</td>
              <td>{project.status}</td>
              <td>
                <button onClick={() => handleEdit(project)}>Edit</button>
                <button onClick={() => handleDelete(project._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {filteredProjects.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No projects found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectsPage;
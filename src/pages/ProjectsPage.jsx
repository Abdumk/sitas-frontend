
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import styles from './ProjectsPage.module.css';

// function ProjectsPage() {
//   const [projects, setProjects] = useState([]);
//   const [search, setSearch] = useState('');
//   const [form, setForm] = useState({
//     name: '',
//     location: '',
//     managerId: '',
//     startDate: '',
//     status: 'ongoing',
//   });
//   const [editId, setEditId] = useState(null);

//   const token = localStorage.getItem('token');

//   // Fetch projects
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = () => {
//     axios
//       .get('http://localhost:5000/api/projects', { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => setProjects(res.data))
//       .catch((err) => console.log(err));
//   };

//   // Handle form input
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Submit form (Add / Update)
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editId) {
//       axios
//         .put(`http://localhost:5000/api/projects/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } })
//         .then(() => {
//           fetchProjects();
//           resetForm();
//         });
//     } else {
//       axios.post('http://localhost:5000/api/projects', form, { headers: { Authorization: `Bearer ${token}` } })
//         .then(() => {
//           fetchProjects();
//           resetForm();
//         });
//     }
//   };

//   const resetForm = () => {
//     setForm({ name: '', location: '', managerId: '', startDate: '', status: 'ongoing' });
//     setEditId(null);
//   };

//   const handleEdit = (project) => {
//     setForm({
//       name: project.name,
//       location: project.location,
//       managerId: project.managerId,
//       startDate: project.startDate.slice(0, 10),
//       status: project.status,
//     });
//     setEditId(project._id);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this project?')) {
//       axios.delete(`http://localhost:5000/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } })
//         .then(() => fetchProjects());
//     }
//   };

//   // Filtered projects
//   const filteredProjects = projects.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase()) ||
//     p.location.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className={styles.container}>
//       <h1>Projects</h1>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search by name or location..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className={styles.search}
//       />

//       {/* Form */}
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <input type="text" name="name" placeholder="Project Name" value={form.name} onChange={handleChange} required />
//         <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
//         <input type="text" name="managerId" placeholder="Manager ID" value={form.managerId} onChange={handleChange} required />
//         <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
//         <select name="status" value={form.status} onChange={handleChange}>
//           <option value="ongoing">Ongoing</option>
//           <option value="completed">Completed</option>
//         </select>
//         <button type="submit">{editId ? 'Update Project' : 'Add Project'}</button>
//         {editId && <button type="button" onClick={resetForm}>Cancel</button>}
//       </form>

//       {/* Projects Table */}
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Location</th>
//             <th>Manager ID</th>
//             <th>Start Date</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredProjects.map((project) => (
//             <tr key={project._id}>
//               <td>{project.name}</td>
//               <td>{project.location}</td>
//               <td>{project.managerId}</td>
//               <td>{project.startDate.slice(0, 10)}</td>
//               <td>{project.status}</td>
//               <td>
//                 <button onClick={() => handleEdit(project)}>Edit</button>
//                 <button onClick={() => handleDelete(project._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//           {filteredProjects.length === 0 && (
//             <tr>
//               <td colSpan="6" style={{ textAlign: 'center' }}>No projects found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ProjectsPage;

// // src/pages/ProjectsPage.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import styles from './ProjectsPage.module.css';

// function ProjectsPage() {
//   const [projects, setProjects] = useState([]);
//   const [search, setSearch] = useState('');
//   const [form, setForm] = useState({
//     name: '',
//     location: '',
//     managerId: '',
//     startDate: '',
//     status: 'ongoing',
//   });
//   const [editId, setEditId] = useState(null);

//   const token = localStorage.getItem('token');

//   // Fetch projects
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = () => {
//     axios
//       .get('http://localhost:5000/api/projects', { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => setProjects(res.data))
//       .catch((err) => console.log(err));
//   };

//   // Handle form input
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Submit form (Add / Update)
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editId) {
//       axios
//         .put(`http://localhost:5000/api/projects/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } })
//         .then(() => {
//           fetchProjects();
//           resetForm();
//         });
//     } else {
//       axios.post('http://localhost:5000/api/projects', form, { headers: { Authorization: `Bearer ${token}` } })
//         .then(() => {
//           fetchProjects();
//           resetForm();
//         });
//     }
//   };

//   const resetForm = () => {
//     setForm({ name: '', location: '', managerId: '', startDate: '', status: 'ongoing' });
//     setEditId(null);
//   };

//   const handleEdit = (project) => {
//     setForm({
//       name: project.name,
//       location: project.location,
//       managerId: project.managerId,
//       startDate: project.startDate.slice(0, 10),
//       status: project.status,
//     });
//     setEditId(project._id);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this project?')) {
//       axios.delete(`http://localhost:5000/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } })
//         .then(() => fetchProjects());
//     }
//   };

//   // Filtered projects
//   const filteredProjects = projects.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase()) ||
//     p.location.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className={styles.container}>
//       <h1>Projects</h1>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search by name or location..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className={styles.search}
//       />

//       {/* Form */}
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Project Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="location"
//           placeholder="Location"
//           value={form.location}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="managerId"
//           placeholder="Manager ID"
//           value={form.managerId}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="date"
//           name="startDate"
//           value={form.startDate}
//           onChange={handleChange}
//           required
//         />
//         <select name="status" value={form.status} onChange={handleChange}>
//           <option value="ongoing">Ongoing</option>
//           <option value="completed">Completed</option>
//         </select>
//         <div className={styles.formButtons}>
//           <button type="submit">
//             {editId ? 'Update Project' : 'Add Project'}
//           </button>
//           {editId && (
//             <button type="button" onClick={resetForm} className={styles.cancelBtn}>
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Table (Desktop) */}
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Location</th>
//             <th>Manager ID</th>
//             <th>Start Date</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredProjects.map((project) => (
//             <tr key={project._id}>
//               <td>{project.name}</td>
//               <td>{project.location}</td>
//               <td>{project.managerId}</td>
//               <td>{project.startDate.slice(0, 10)}</td>
//               <td>
//                 <span className={`${styles.status} ${styles[project.status]}`}>
//                   {project.status}
//                 </span>
//               </td>
//               <td>
//                 <button onClick={() => handleEdit(project)}>Edit</button>
//                 <button onClick={() => handleDelete(project._id)} className={styles.deleteBtn}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {filteredProjects.length === 0 && (
//             <tr>
//               <td colSpan="6" className={styles.empty}>
//                 No projects found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Cards (Mobile) */}
//       <div className={styles.cards}>
//         {filteredProjects.map((project) => (
//           <div key={project._id} className={styles.card}>
//             <h3>{project.name}</h3>
//             <div className={styles.cardInfo}>
//               <span>📍 Location:</span>
//               <span>{project.location}</span>
//             </div>
//             <div className={styles.cardInfo}>
//               <span>👷 Manager ID:</span>
//               <span>{project.managerId}</span>
//             </div>
//             <div className={styles.cardInfo}>
//               <span>📅 Start Date:</span>
//               <span>{project.startDate.slice(0, 10)}</span>
//             </div>
//             <div className={styles.cardInfo}>
//               <span>Status:</span>
//               <span className={`${styles.status} ${styles[project.status]}`}>
//                 {project.status}
//               </span>
//             </div>
//             <div className={styles.cardActions}>
//               <button onClick={() => handleEdit(project)}>Edit</button>
//               <button onClick={() => handleDelete(project._id)} className={styles.deleteBtn}>
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//         {filteredProjects.length === 0 && (
//           <p className={styles.empty}>No projects found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProjectsPage;


// src/pages/ProjectsPage.jsx
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

      {/* Table (Desktop Only) */}
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
        <td>
          <span className={`${styles.status} ${styles[project.status]}`}>
            {project.status}
          </span>
        </td>
        <td>
          <button onClick={() => handleEdit(project)}>Edit</button>
          <button onClick={() => handleDelete(project._id)} className={styles.deleteBtn}>
            Delete
          </button>
        </td>
      </tr>
    ))}
    {filteredProjects.length === 0 && (
      <tr>
        <td colSpan="6" className={styles.empty}>
          No projects found.
        </td>
      </tr>
    )}
  </tbody>
</table>

      {/* Projects Cards (Mobile Only) */}
      <div className={styles.cards}>
        {filteredProjects.map((project) => (
          <div key={project._id} className={styles.card}>
            <h3>{project.name}</h3>
            <div className={styles.cardInfo}>
              <strong>📍 Location:</strong>
              <span>{project.location}</span>
            </div>
            <div className={styles.cardInfo}>
              <strong>👷 Manager ID:</strong>
              <span>{project.managerId}</span>
            </div>
            <div className={styles.cardInfo}>
              <strong>📅 Start Date:</strong>
              <span>{project.startDate.slice(0, 10)}</span>
            </div>
            <div className={styles.cardInfo}>
              <strong>Status:</strong>
              <span className={project.status === 'ongoing' ? styles.ongoing : styles.completed}>
                {project.status}
              </span>
            </div>
            <div className={styles.cardActions}>
              <button onClick={() => handleEdit(project)}>Edit</button>
              <button onClick={() => handleDelete(project._id)} className={styles.deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <p className={styles.empty}>No projects found.</p>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;
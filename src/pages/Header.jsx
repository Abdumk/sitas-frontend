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
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import Sidebar from './Sidebar';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('role') || '';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.appInfo}>
          <NavLink to={token ? "/dashboard" : "/login"} className={styles.appTitle}>
            SITAS Pro
          </NavLink>
        </div>

        {/* Desktop user info: hide on mobile */}
        <div className={styles.userInfoDesktop}>
          {!token ? (
            <>
              <NavLink to="/login" className={styles.link}>Login</NavLink>
              <NavLink to="/signup" className={styles.link}>Sign Up</NavLink>
            </>
          ) : (
            <>
              <span className={styles.welcomeText}>
                Welcome, {userName} {userRole && `(${userRole})`}
              </span>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button className={styles.hamburger} onClick={toggleSidebar}>☰</button>
      </header>

      {/* Sidebar drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        token={token}
        userName={userName}
        userRole={userRole}
        handleLogout={handleLogout}
      />
    </>
  );
}

export default Header;

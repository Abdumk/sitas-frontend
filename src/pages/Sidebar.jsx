
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar({ isOpen, onClose, token, userName, userRole, handleLogout }) {
  // If user is not logged in, don't render sidebar
  if (!token) return null;
  const role = localStorage.getItem('role');
  const canView = (allowedRoles) => token && role && allowedRoles.includes(role);

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose}></div>}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          <button className={styles.close} onClick={onClose}>×</button>

          {token && (
            <nav className={styles.menu}>
              <ul>
                <li>
                  <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>🏠 Dashboard</NavLink>
                </li>
                {canView(['admin']) && <li><NavLink to="/projects" className={({ isActive }) => isActive ? styles.active : ''}>🏗️ Projects</NavLink></li>}
                {canView(['admin','storekeeper']) && <li><NavLink to="/materials" className={({ isActive }) => isActive ? styles.active : ''}>📦 Materials</NavLink></li>}
                {canView(['worker','engineer','pm','storekeeper','admin']) && <li><NavLink to="/requests" className={({ isActive }) => isActive ? styles.active : ''}>📥 Requests</NavLink></li>}
                <li><NavLink to="/notifications" className={({ isActive }) => isActive ? styles.active : ''}>🔔 Notifications</NavLink></li>
                <li><NavLink to="/reports" className={({ isActive }) => isActive ? styles.active : ''}>📊 Reports</NavLink></li>
              </ul>
            </nav>
          )}

          {/* Mobile user info at bottom */}
          <div className={styles.mobileUserInfo}>
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
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

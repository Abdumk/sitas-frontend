import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Create a CSS file for styling

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const canView = (allowedRoles) => {
        if (!role) return false;
        return allowedRoles.includes(role);
    };

    return (
        <nav className="navbar">
            <div className="nav-links">
                <NavLink to="/dashboard">Dashboard</NavLink>
                {canView(['admin']) && (
                    <NavLink to="/projects">Projects</NavLink>
                )}
                {canView(['admin', 'storekeeper']) && (
                    <NavLink to="/materials">Materials</NavLink>
                )}
                {canView(['worker', 'engineer', 'pm', 'storekeeper']) && (
                    <NavLink to="/requests">Requests</NavLink>
                )}
                <NavLink to="/notifications">Notifications</NavLink>
            </div>
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </nav>
    );
};

export default Navbar;
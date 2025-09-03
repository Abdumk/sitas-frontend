import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/ProjectsPage';
import Materials from '../pages/MaterialsPage';
import Requests from '../pages/RequestsPage';
import Notifications from '../pages/NotificationsPage';
import Login from '../pages/LoginPage';
import ReportsPage from '../pages/ReportsPage';

function AppRoutes() {
  const token = localStorage.getItem('token'); // simple auth check

  if (!token) return <Login />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
         <Route path="/projects" element={<Projects />} />
       <Route path="/materials" element={<Materials />} />
       <Route path="/requests" element={<Requests />} />
          <Route path="/notifications" element={<Notifications />} />
       <Route path="/reports" element={<ReportsPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

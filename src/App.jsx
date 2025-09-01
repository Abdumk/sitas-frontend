import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import MaterialsPage from './pages/MaterialsPage';
import RequestsPage from './pages/RequestsPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';
import Layout from './pages/Layout';
import PublicLayout from './pages/PublicLayout';
import PrivateRoute from './pages/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected Routes inside Layout */}
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <ProjectsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/materials"
            element={
              <PrivateRoute allowedRoles={['admin', 'storekeeper']}>
                <MaterialsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <PrivateRoute allowedRoles={['worker', 'engineer', 'pm', 'storekeeper', 'admin']}>
                <RequestsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute allowedRoles={['worker', 'engineer', 'pm', 'storekeeper', 'admin']}>
                <NotificationsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute allowedRoles={['worker', 'engineer', 'pm', 'storekeeper', 'admin']}>
                <ReportsPage />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Default route -> redirect to /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;


// src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
// import Dashboard from './pages/Dashboard';
// import ProjectsPage from './pages/ProjectsPage';
// import MaterialsPage from './pages/MaterialsPage';
// import RequestsPage from './pages/RequestsPage';
// import NotificationsPage from './pages/NotificationsPage';
// import Layout from './pages/Layout';
// import PrivateRoute from './pages/PrivateRoute';

// function App() {
//   return (
//     <Router>

//       <Routes>
//         {/* Public Route */}
//         <Route path="/login" element={<LoginPage />} />

//         {/* Protected Routes inside Layout */}
//         <Route element={<Layout />}>
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute allowedRoles={['admin']}>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/projects"
//             element={
//               <PrivateRoute allowedRoles={['admin']}>
//                 <ProjectsPage />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/materials"
//             element={
//               <PrivateRoute allowedRoles={['admin', 'storekeeper']}>
//                 <MaterialsPage />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/requests"
//             element={
//               <PrivateRoute allowedRoles={['worker', 'engineer', 'pm', 'storekeeper']}>
//                 <RequestsPage />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/notifications"
//             element={
//               <PrivateRoute allowedRoles={['worker', 'engineer', 'pm', 'storekeeper', 'admin']}>
//                 <NotificationsPage />
//               </PrivateRoute>
//             }
//           />
//         </Route>

//         {/* Catch-all Redirect */}
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

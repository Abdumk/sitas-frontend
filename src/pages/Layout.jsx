// // src/pages/Layout.jsx
// import React from 'react';
// import Sidebar from './Sidebar';
// import styles from './Layout.module.css';
// import { Outlet } from 'react-router-dom'; // 👈 important

// function Layout() {
//   return (
//     <div className={styles.layout}>
//       {/* Sidebar */}
//       <aside className={styles.sidebar}>
//         <Sidebar />
//       </aside>

//       {/* Main Content (this is where nested routes will render) */}
//       <main className={styles['main-content']}>
//         <Outlet />   {/* 👈 this replaces {children} */}
//       </main>
//     </div>
//   );
// }

// export default Layout;

// import React from "react";
// import { Outlet } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import Sidebar from "./Sidebar";
// import styles from "./Layout.module.css";

// export default function Layout() {
//   return (
//     <div className={styles.layout}>
//       <header className={styles.header}><Header /></header>
//       <aside className={styles.sidebar}><Sidebar /></aside>
//       <main className={styles.content}><Outlet /></main>
//       <footer className={styles.footer}><Footer /></footer>
//     </div>
//   );
// }
// src/pages/Layout.jsx
// src/pages/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}><Header /></header>
      <aside className={styles.sidebar}><Sidebar /></aside>
      <main className={styles.content}><Outlet /></main>
      <footer className={styles.footer}><Footer /></footer>
    </div>
  );
}


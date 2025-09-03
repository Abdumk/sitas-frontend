import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./Layout.module.css";

export default function PublicLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}><Header /></header>
      <main className={styles.content}><Outlet /></main>
      <footer className={styles.footer}><Footer /></footer>
    </div>
  );
}

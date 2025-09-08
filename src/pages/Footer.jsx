// Footer.jsx
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} SITAS Pro. All rights reserved.</p>
      <div className={styles.footerLinks}>
        <Link to="/terms-of-service" className={styles.link}>Terms of Service</Link>
        <Link to="/privacy-policy" className={styles.link}>Privacy Policy</Link>
      </div>
    </footer>
  );
}

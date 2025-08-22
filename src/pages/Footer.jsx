import React from 'react';
import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} SITAS Pro. All rights reserved.</p>
            <div className={styles.footerLinks}>
                <a href="/terms" className={styles.link}>Terms of Service</a>
                <a href="/privacy" className={styles.link}>Privacy Policy</a>
            </div>
        </footer>
    );
}

export default Footer;

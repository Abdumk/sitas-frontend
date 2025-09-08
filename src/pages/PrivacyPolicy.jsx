// src/pages/PrivacyPolicy.jsx
import React from "react";
import styles from "./PrivacyPolicy.module.css";

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <h1>Privacy Policy</h1>
      <p>Your privacy is important to us. This policy explains how we collect, use, and protect your data.</p>

      <section>
        <h2>1. Information Collection</h2>
        <p>
          We may collect personal information such as your name, email, and account details when you use SITAS Pro.
        </p>
      </section>

      <section>
        <h2>2. Use of Information</h2>
        <ul>
          <li>To provide and improve our services.</li>
          <li>To communicate important updates.</li>
          <li>To personalize your experience.</li>
        </ul>
      </section>

      <section>
        <h2>3. Data Protection</h2>
        <p>
          We implement industry-standard measures to protect your data from unauthorized access, alteration, or disclosure.
        </p>
      </section>

      <section>
        <h2>4. Cookies & Tracking</h2>
        <p>
          We may use cookies to enhance your experience. You can disable cookies in your browser settings.
        </p>
      </section>

      <section>
        <h2>5. Third-Party Services</h2>
        <p>
          We do not share your personal data with third-party companies for marketing purposes without consent.
        </p>
      </section>

      <section>
        <h2>6. Changes to Privacy Policy</h2>
        <p>
          We may update this policy periodically. Continued use of our platform constitutes acceptance.
        </p>
      </section>
    </div>
  );
}

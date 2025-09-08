// src/pages/TermsOfService.jsx
import React from "react";
import styles from "./TermsOfService.module.css";

export default function TermsOfService() {
  return (
    <div className={styles.container}>
      <h1>Terms of Service</h1>
      <p>Welcome to SITAS Pro. By using our services, you agree to the following terms:</p>
      
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing our platform, you agree to comply with these Terms of Service. 
          Please read them carefully.
        </p>
      </section>

      <section>
        <h2>2. User Responsibilities</h2>
        <ul>
          <li>Provide accurate information during registration.</li>
          <li>Keep your account credentials secure.</li>
          <li>Use the platform in a lawful manner.</li>
        </ul>
      </section>

      <section>
        <h2>3. Intellectual Property</h2>
        <p>
          All content, logos, and materials on SITAS Pro are the property of the company and protected by law.
        </p>
      </section>

      <section>
        <h2>4. Limitation of Liability</h2>
        <p>
          SITAS Pro is not liable for any direct or indirect damages arising from the use of our platform.
        </p>
      </section>

      <section>
        <h2>5. Changes to Terms</h2>
        <p>
          We may update these terms occasionally. Continued use of the platform indicates acceptance.
        </p>
      </section>
    </div>
  );
}

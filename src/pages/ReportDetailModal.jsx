import React, { useEffect } from "react";
import styles from "../pages/ReportDetailModal.module.css";

export default function ReportDetailModal({ open, title, rows = [], onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const columns = rows && rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Details"}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h3>{title}</h3>
          <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className={styles.body}>
          {rows.length === 0 ? (
            <p className={styles.empty}>No records to show.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col} scope="col">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      {columns.map((col) => (
                        <td key={col + i}>
                          {row[col] === null || typeof row[col] === "undefined"
                            ? ""
                            : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.btn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

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

  // Hide id / _id columns if present
  const columns = rows && rows.length > 0
    ? Object.keys(rows[0]).filter(c => c !== "id" && c !== "_id")
    : [];

  const exportToCsv = (rowsToExport, filename = "report-detail.csv") => {
    if (!rowsToExport || rowsToExport.length === 0) {
      alert("No rows to export");
      return;
    }
    const keys = Object.keys(rowsToExport[0]);
    const csv = [
      keys.join(","),
      ...rowsToExport.map(r => keys.map(k => {
        const v = r[k];
        const safe = typeof v === "string" ? v.replace(/"/g, '""') : String(v ?? "");
        return `"${safe}"`;
      }).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // sanitize filename
    const safeFilename = filename.replace(/\s+/g, "-").toLowerCase();
    a.download = `${safeFilename}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Details"}
      onClick={onClose}
      style={{ zIndex: 1050 }} // ensure overlay sits above other UI
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h3>{title}</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className={styles.exportBtn}
              onClick={() => exportToCsv(rows, `${title || "details"}.csv`)}
              aria-label="Export CSV"
            >
              Export CSV
            </button>
            <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
          </div>
        </div>

        <div className={styles.body}>
          {rows.length === 0 ? (
            <p className={styles.empty}>No records to show.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {columns.map(col => <th key={col} scope="col">{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      {columns.map(col => (
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

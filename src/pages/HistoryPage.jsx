import React, { useEffect, useState } from "react";
import styles from "./HistoryPage.module.css";

function HistoryPage({ onBack }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(data);
  }, []);

  const deleteRequest = (id) => {
    const updated = history.filter((req) => req.id !== id);
    setHistory(updated);
    localStorage.setItem("history", JSON.stringify(updated));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Material Request History</h2>

      {history.length === 0 && (
        <p className={styles.empty}>No approved/rejected requests yet</p>
      )}

      {history.map((req) => (
        <div key={req.id} className={styles.card}>
          <strong>Request #{req.id}</strong>
          <ul>
            {req.items.map((it) => (
              <li key={it.id}>{it.name}</li>
            ))}
          </ul>
          <p>Status: {req.status}</p>
          {req.comment && <p>Comment: {req.comment}</p>}
          <button
            onClick={() => deleteRequest(req.id)}
            className={styles.deleteBtn}
          >
            🗑 Delete
          </button>
        </div>
      ))}

      <button onClick={onBack} className={styles.backBtn}>
        ⬅ Back to Requests
      </button>
    </div>
  );
}

export default HistoryPage;

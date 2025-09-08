// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import styles from './NotificationsPage.module.css';

// function NotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetchNotifications();

//     // Optional: auto-refresh every 30s
//     const intervalId = setInterval(fetchNotifications, 30000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/notifications', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Remove duplicates (same title + message + timestamp)
//       const uniqueNotifications = Array.from(
//         new Map(res.data.map(n => [n.title + n.message + n.createdAt, n])).values()
//       );

//       setNotifications(uniqueNotifications.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       ));
//     } catch (err) {
//       console.error('Error fetching notifications:', err);
//     }
//   };

//   const markAsRead = async (id) => {
//     try {
//       await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchNotifications();
//     } catch (err) {
//       console.error('Error marking notification read:', err);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h1>Notifications</h1>
//       {notifications.length === 0 ? (
//         <p className={styles.noNotifications}>No notifications.</p>
//       ) : (
//         <ul className={styles.list}>
//           {notifications.map(n => (
//             <li key={n._id} className={n.isRead ? styles.read : styles.unread}>
//               <div className={styles.message}>
//                 <strong>{n.title}</strong>: {n.message}
//                 <br />
//                 <small>{new Date(n.createdAt).toLocaleString()}</small>
//               </div>
//               {!n.isRead && (
//                 <button
//                   className={styles.markReadBtn}
//                   onClick={() => markAsRead(n._id)}
//                 >
//                   Mark as Read
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default NotificationsPage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './NotificationsPage.module.css';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');

  // ✅ Use .env API URL
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchNotifications();

    // Optional: auto-refresh every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove duplicates (same title + message + timestamp)
      const uniqueNotifications = Array.from(
        new Map(res.data.map(n => [n.title + n.message + n.createdAt, n])).values()
      );

      setNotifications(
        uniqueNotifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p className={styles.noNotifications}>No notifications.</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map(n => (
            <li key={n._id} className={n.isRead ? styles.read : styles.unread}>
              <div className={styles.message}>
                <strong>{n.title}</strong>: {n.message}
                <br />
                <small>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
              {!n.isRead && (
                <button
                  className={styles.markReadBtn}
                  onClick={() => markAsRead(n._id)}
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsPage;

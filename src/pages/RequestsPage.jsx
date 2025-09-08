// import React, { useEffect, useState } from "react";
// import styles from "./RequestsPage.module.css";

// function RequestsPage() {
//   const [requests, setRequests] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [materials, setMaterials] = useState([]);
//   const [newRequest, setNewRequest] = useState({ projectId: "", items: [] });
//   const [currentItem, setCurrentItem] = useState({ materialId: "", quantity: "", purpose: "" });
//   const [comments, setComments] = useState({}); // Inline comment per request
//   const [actedRequests, setActedRequests] = useState({}); // Tracks requests the user already acted on

//   const userRole = localStorage.getItem("role");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchRequests();
//     fetchProjects();
//     fetchMaterials();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/materialRequests", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setRequests(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchProjects = async () => {
//     const res = await fetch("http://localhost:5000/api/projects", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setProjects(await res.json());
//   };

//   const fetchMaterials = async () => {
//     const res = await fetch("http://localhost:5000/api/materials", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setMaterials(await res.json());
//   };

//   const addItem = () => {
//     if (!currentItem.materialId || !currentItem.quantity) return;
//     setNewRequest({ ...newRequest, items: [...newRequest.items, currentItem] });
//     setCurrentItem({ materialId: "", quantity: "", purpose: "" });
//     localStorage.setItem(
//       "newRequest",
//       JSON.stringify({ ...newRequest, items: [...newRequest.items, currentItem] })
//     );
//   };

//   const cancelItem = (index) => {
//     const updatedItems = newRequest.items.filter((_, i) => i !== index);
//     setNewRequest({ ...newRequest, items: updatedItems });
//     localStorage.setItem("newRequest", JSON.stringify({ ...newRequest, items: updatedItems }));
//   };

//   const submitRequest = async () => {
//     if (!newRequest.projectId || newRequest.items.length === 0) return;
//     try {
//       await fetch("http://localhost:5000/api/materialRequests", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           projectId: newRequest.projectId,
//           materials: newRequest.items,
//         }),
//       });
//       setNewRequest({ projectId: "", items: [] });
//       localStorage.removeItem("newRequest");
//       fetchRequests();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit request");
//     }
//   };

//   const approve = async (id, decision) => {
//     const comment = comments[id] || "";
//     await fetch(`http://localhost:5000/api/materialRequests/${id}/approve`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ decision, comment }),
//     });
//     setActedRequests({ ...actedRequests, [id]: true }); // Mark request as acted on
//     fetchRequests();
//   };

//   const deleteRequest = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this request?")) return;
//     await fetch(`http://localhost:5000/api/materialRequests/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchRequests();
//   };

//   const statusBadge = (status) => {
//     switch (status) {
//       case "pending_engineer": return styles.pendingEngineer;
//       case "pending_pm": return styles.pendingPM;
//       case "pending_storekeeper": return styles.pendingStorekeeper;
//       case "approved": return styles.approved;
//       case "rejected": return styles.rejected;
//       case "issued": return styles.issued;
//       default: return styles.defaultStatus;
//     }
//   };

//   const renderProgress = (status) => {
//     const steps = ["Engineer", "PM", "Storekeeper"];
//     return (
//       <div className={styles.progress}>
//         {steps.map((step, idx) => {
//           const completed =
//             (status === "approved" && idx < steps.length) ||
//             (status === "rejected" && idx === steps.length - 1) ||
//             status.toLowerCase().includes(step.toLowerCase());
//           return (
//             <div key={idx} className={styles.step}>
//               <div className={`${styles.circle} ${completed ? styles.active : ""}`}>{idx + 1}</div>
//               <div className={styles.stepLabel}>{step}</div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.heading}>Material Requests</h1>

//       {userRole === "worker" && (
//         <div className={styles.newRequestCard}>
//           <h2>Create New Request</h2>
//           <div className={styles.formRow}>
//             <select
//               className={styles.select}
//               value={newRequest.projectId}
//               onChange={(e) => setNewRequest({ ...newRequest, projectId: e.target.value })}
//             >
//               <option value="">Select Project</option>
//               {projects.map((p) => (
//                 <option key={p._id} value={p._id}>{p.name}</option>
//               ))}
//             </select>
//           </div>

//           <div className={styles.formRow}>
//             <select
//               className={styles.select}
//               value={currentItem.materialId}
//               onChange={(e) => setCurrentItem({ ...currentItem, materialId: e.target.value })}
//             >
//               <option value="">Select Material</option>
//               {materials.map((m) => (
//                 <option key={m._id} value={m._id}>{m.name}</option>
//               ))}
//             </select>
//             <input
//               className={styles.input}
//               type="number"
//               placeholder="Quantity"
//               value={currentItem.quantity}
//               onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
//             />
//             <input
//               className={styles.input}
//               type="text"
//               placeholder="Purpose"
//               value={currentItem.purpose}
//               onChange={(e) => setCurrentItem({ ...currentItem, purpose: e.target.value })}
//             />
//             <button className={styles.addButton} onClick={addItem}>Add</button>
//           </div>

//           <ul className={styles.itemList}>
//             {newRequest.items.map((item, i) => {
//               const mat = materials.find((m) => m._id === item.materialId);
//               return (
//                 <li key={i}>
//                   {mat?.name} - {item.quantity} ({item.purpose}){" "}
//                   <button className={styles.cancelBtn} onClick={() => cancelItem(i)}>❌</button>
//                 </li>
//               );
//             })}
//           </ul>

//           <button
//             className={styles.submitButton}
//             onClick={submitRequest}
//             disabled={!newRequest.projectId || newRequest.items.length === 0}
//           >
//             Submit Request
//           </button>
//         </div>
//       )}

//       <div className={styles.tableWrapper}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Project</th>
//               <th>Materials</th>
//               <th>Status</th>
//               <th>Progress</th>
//               <th>Approvals</th>
//               {userRole !== "worker" && <th>Actions</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {requests.length > 0 ? (
//               requests.map((r) => {
//                 const project = projects.find((p) => p._id === (r.projectId?._id || r.projectId));
//                 return (
//                   <tr key={r._id}>
//                     <td>{project?.name || "Unknown"}</td>
//                     <td>
//                       {r.materials.map((m, i) => {
//                         const mat = materials.find((x) => x._id === (m.materialId?._id || m.materialId));
//                         return <div key={i}>{mat?.name} - {m.quantity} ({m.purpose})</div>;
//                       })}
//                     </td>
//                     <td><span className={`${styles.status} ${statusBadge(r.status)}`}>{r.status}</span></td>
//                     <td>{renderProgress(r.status)}</td>
//                     <td>
//                       {r.approvals.map((a, i) => (
//                         <div key={i}>
//                           {a.role}: {a.decision} {a.comment ? `({a.comment})` : ""}
//                         </div>
//                       ))}

//                       {/* Comment input & action buttons for engineers/PM/storekeeper */}
//                       {["engineer","pm","storekeeper"].includes(userRole) && r.status.includes("pending") && !actedRequests[r._id] && (
//                         <input
//                           type="text"
//                           placeholder="Add comment"
//                           value={comments[r._id] || ""}
//                           onChange={(e) => setComments({ ...comments, [r._id]: e.target.value })}
//                           className={styles.commentInput}
//                         />
//                       )}
//                     </td>
//                     {userRole !== "worker" && (
//                       <td className={styles.actions}>
//                         {["engineer","pm","storekeeper"].includes(userRole) && r.status.startsWith("pending") && !actedRequests[r._id] && (
//                           <>
//                             <button className={styles.approveBtn} onClick={() => approve(r._id, "approved")}>Approve</button>
//                             <button className={styles.rejectBtn} onClick={() => approve(r._id, "rejected")}>Reject</button>
//                           </>
//                         )}
//                         {userRole === "admin" && ["approved","rejected"].includes(r.status) && (
//                           <button className={styles.deleteBtn} onClick={() => deleteRequest(r._id)}>Delete</button>
//                         )}
//                       </td>
//                     )}
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan={userRole !== "worker" ? 6 : 5} className={styles.noData}>
//                   No requests found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// // export default RequestsPage;
// import React, { useEffect, useState } from "react";
// import styles from "./RequestsPage.module.css";

// const API_URL = import.meta.env.VITE_API_URL; // Vite env variable

// function RequestsPage() {
//   const [requests, setRequests] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [materials, setMaterials] = useState([]);
//   const [newRequest, setNewRequest] = useState({ projectId: "", items: [] });
//   const [currentItem, setCurrentItem] = useState({ materialId: "", quantity: "", purpose: "" });
//   const [comments, setComments] = useState({});
//   const [actedRequests, setActedRequests] = useState({});

//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("role");

//   useEffect(() => {
//     fetchProjects();
//     fetchMaterials();
//     fetchRequests();
//   }, []);

//   // Fetch all requests
//   const fetchRequests = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/materialRequests`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setRequests(data);
//     } catch (err) {
//       console.error("Fetch requests error:", err);
//     }
//   };

//   // Fetch all projects
//   const fetchProjects = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/projects`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setProjects(data);
//     } catch (err) {
//       console.error("Fetch projects error:", err);
//     }
//   };

//   // Fetch all materials
//   const fetchMaterials = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/materials`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setMaterials(data);
//     } catch (err) {
//       console.error("Fetch materials error:", err);
//     }
//   };

//   // Add a material to the new request
//   const addItem = () => {
//     if (!currentItem.materialId || !currentItem.quantity) return;
//     const updatedItems = [...newRequest.items, currentItem];
//     setNewRequest({ ...newRequest, items: updatedItems });
//     setCurrentItem({ materialId: "", quantity: "", purpose: "" });
//     localStorage.setItem("newRequest", JSON.stringify({ ...newRequest, items: updatedItems }));
//   };

//   // Remove an item from the new request
//   const cancelItem = (index) => {
//     const updatedItems = newRequest.items.filter((_, i) => i !== index);
//     setNewRequest({ ...newRequest, items: updatedItems });
//     localStorage.setItem("newRequest", JSON.stringify({ ...newRequest, items: updatedItems }));
//   };

//   // Submit a new request
//   const submitRequest = async () => {
//     if (!newRequest.projectId || newRequest.items.length === 0) return;
//     try {
//       await fetch(`${API_URL}/api/materialRequests`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ projectId: newRequest.projectId, materials: newRequest.items }),
//       });
//       setNewRequest({ projectId: "", items: [] });
//       localStorage.removeItem("newRequest");
//       fetchRequests();
//     } catch (err) {
//       console.error("Submit request error:", err);
//       alert("Failed to submit request");
//     }
//   };

//   // Approve or reject request
//   const approve = async (id, decision) => {
//     const comment = comments[id] || "";
//     try {
//       await fetch(`${API_URL}/api/materialRequests/${id}/approve`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ decision, comment }),
//       });
//       setActedRequests({ ...actedRequests, [id]: true });
//       fetchRequests();
//     } catch (err) {
//       console.error("Approval error:", err);
//     }
//   };

//   // Delete a request
//   const deleteRequest = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this request?")) return;
//     try {
//       await fetch(`${API_URL}/api/materialRequests/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchRequests();
//     } catch (err) {
//       console.error("Delete request error:", err);
//     }
//   };

//   // Return status CSS class
//   const statusBadge = (status) => {
//     switch (status) {
//       case "pending_engineer": return styles.pendingEngineer;
//       case "pending_pm": return styles.pendingPM;
//       case "pending_storekeeper": return styles.pendingStorekeeper;
//       case "approved": return styles.approved;
//       case "rejected": return styles.rejected;
//       case "issued": return styles.issued;
//       default: return styles.defaultStatus;
//     }
//   };

//   // Render progress bar
//   const renderProgress = (status) => {
//     const steps = ["Engineer", "PM", "Storekeeper"];
//     return (
//       <div className={styles.progress}>
//         {steps.map((step, idx) => {
//           const completed =
//             (status === "approved" && idx < steps.length) ||
//             status.toLowerCase().includes(step.toLowerCase());
//           return (
//             <div key={idx} className={styles.step}>
//               <div className={`${styles.circle} ${completed ? styles.active : ""}`}>{idx + 1}</div>
//               <div className={styles.stepLabel}>{step}</div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.heading}>Material Requests</h1>

//       {/* Worker new request form */}
//       {userRole === "worker" && (
//         <div className={styles.newRequestCard}>
//           <h2>Create New Request</h2>

//           <div className={styles.formRow}>
//             <select
//               className={styles.select}
//               value={newRequest.projectId}
//               onChange={(e) => setNewRequest({ ...newRequest, projectId: e.target.value })}
//             >
//               <option value="">Select Project</option>
//               {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
//             </select>
//           </div>

//           <div className={styles.formRow}>
//             <select
//               className={styles.select}
//               value={currentItem.materialId}
//               onChange={(e) => setCurrentItem({ ...currentItem, materialId: e.target.value })}
//             >
//               <option value="">Select Material</option>
//               {materials.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
//             </select>
//             <input
//               className={styles.input}
//               type="number"
//               placeholder="Quantity"
//               value={currentItem.quantity}
//               onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
//             />
//             <input
//               className={styles.input}
//               type="text"
//               placeholder="Purpose"
//               value={currentItem.purpose}
//               onChange={(e) => setCurrentItem({ ...currentItem, purpose: e.target.value })}
//             />
//             <button className={styles.addButton} onClick={addItem}>Add</button>
//           </div>

//           <ul className={styles.itemList}>
//             {newRequest.items.map((item, i) => {
//               const mat = materials.find((m) => m._id === item.materialId);
//               return (
//                 <li key={i}>
//                   {mat?.name} - {item.quantity} ({item.purpose})
//                   <button className={styles.cancelBtn} onClick={() => cancelItem(i)}>❌</button>
//                 </li>
//               );
//             })}
//           </ul>

//           <button
//             className={styles.submitButton}
//             onClick={submitRequest}
//             disabled={!newRequest.projectId || newRequest.items.length === 0}
//           >
//             Submit Request
//           </button>
//         </div>
//       )}

//       {/* Requests table */}
//       <div className={styles.tableWrapper}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Project</th>
//               <th>Materials</th>
//               <th>Status</th>
//               <th>Progress</th>
//               <th>Approvals</th>
//               {userRole !== "worker" && <th>Actions</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {requests.length > 0 ? requests.map((r) => {
//               const project = projects.find((p) => p._id === (r.projectId?._id || r.projectId));
//               return (
//                 <tr key={r._id}>
//                   <td>{project?.name || "Unknown"}</td>
//                   <td>
//                     {r.materials.map((m, i) => {
//                       const mat = materials.find((x) => x._id === (m.materialId?._id || m.materialId));
//                       return <div key={i}>{mat?.name} - {m.quantity} ({m.purpose})</div>;
//                     })}
//                   </td>
//                   <td><span className={`${styles.status} ${statusBadge(r.status)}`}>{r.status}</span></td>
//                   <td>{renderProgress(r.status)}</td>
//                   <td>
//                     {r.approvals.map((a, i) => (
//                       <div key={i}>{a.role}: {a.decision} {a.comment ? `(${a.comment})` : ""}</div>
//                     ))}
//                     {["engineer","pm","storekeeper"].includes(userRole) && r.status.includes("pending") && !actedRequests[r._id] && (
//                       <input
//                         type="text"
//                         placeholder="Add comment"
//                         value={comments[r._id] || ""}
//                         onChange={(e) => setComments({ ...comments, [r._id]: e.target.value })}
//                         className={styles.commentInput}
//                       />
//                     )}
//                   </td>
//                   {userRole !== "worker" && (
//                     <td className={styles.actions}>
//                       {["engineer","pm","storekeeper"].includes(userRole) && r.status.startsWith("pending") && !actedRequests[r._id] && (
//                         <>
//                           <button className={styles.approveBtn} onClick={() => approve(r._id, "approved")}>Approve</button>
//                           <button className={styles.rejectBtn} onClick={() => approve(r._id, "rejected")}>Reject</button>
//                         </>
//                       )}
//                       {userRole === "admin" && ["approved","rejected"].includes(r.status) && (
//                         <button className={styles.deleteBtn} onClick={() => deleteRequest(r._id)}>Delete</button>
//                       )}
//                     </td>
//                   )}
//                 </tr>
//               );
//             }) : (
//               <tr>
//                 <td colSpan={userRole !== "worker" ? 6 : 5} className={styles.noData}>
//                   No requests found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default RequestsPage;
import React, { useEffect, useState } from "react";
import styles from "./RequestsPage.module.css";

const API_URL = import.meta.env.VITE_API_URL; // Vite env variable

function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [newRequest, setNewRequest] = useState({ projectId: "", items: [] });
  const [currentItem, setCurrentItem] = useState({ materialId: "", quantity: "", purpose: "" });
  const [comments, setComments] = useState({});
  const [actedRequests, setActedRequests] = useState({});

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchProjects();
    fetchMaterials();
    fetchRequests();
  }, []);

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/materialRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Fetch requests error:", err);
    }
  };

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Fetch projects error:", err);
    }
  };

  // Fetch all materials
  const fetchMaterials = async () => {
    try {
      const res = await fetch(`${API_URL}/materials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error("Fetch materials error:", err);
    }
  };

  // Add a material to the new request
  const addItem = () => {
    if (!currentItem.materialId || !currentItem.quantity) return;
    const updatedItems = [...newRequest.items, currentItem];
    setNewRequest({ ...newRequest, items: updatedItems });
    setCurrentItem({ materialId: "", quantity: "", purpose: "" });
    localStorage.setItem("newRequest", JSON.stringify({ ...newRequest, items: updatedItems }));
  };

  // Remove an item from the new request
  const cancelItem = (index) => {
    const updatedItems = newRequest.items.filter((_, i) => i !== index);
    setNewRequest({ ...newRequest, items: updatedItems });
    localStorage.setItem("newRequest", JSON.stringify({ ...newRequest, items: updatedItems }));
  };

  // Submit a new request
  const submitRequest = async () => {
    if (!newRequest.projectId || newRequest.items.length === 0) return;
    try {
      await fetch(`${API_URL}/materialRequests`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectId: newRequest.projectId, materials: newRequest.items }),
      });
      setNewRequest({ projectId: "", items: [] });
      localStorage.removeItem("newRequest");
      fetchRequests();
    } catch (err) {
      console.error("Submit request error:", err);
      alert("Failed to submit request");
    }
  };

  // Approve or reject request
  const approve = async (id, decision) => {
    const comment = comments[id] || "";
    try {
      await fetch(`${API_URL}/materialRequests/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ decision, comment }),
      });
      setActedRequests({ ...actedRequests, [id]: true });
      fetchRequests();
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  // Delete a request
  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await fetch(`${API_URL}/materialRequests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.error("Delete request error:", err);
    }
  };

  // Return status CSS class
  const statusBadge = (status) => {
    switch (status) {
      case "pending_engineer": return styles.pendingEngineer;
      case "pending_pm": return styles.pendingPM;
      case "pending_storekeeper": return styles.pendingStorekeeper;
      case "approved": return styles.approved;
      case "rejected": return styles.rejected;
      case "issued": return styles.issued;
      default: return styles.defaultStatus;
    }
  };

  // Render progress bar
  const renderProgress = (status) => {
    const steps = ["Engineer", "PM", "Storekeeper"];
    return (
      <div className={styles.progress}>
        {steps.map((step, idx) => {
          const completed =
            (status === "approved" && idx < steps.length) ||
            status.toLowerCase().includes(step.toLowerCase());
          return (
            <div key={idx} className={styles.step}>
              <div className={`${styles.circle} ${completed ? styles.active : ""}`}>{idx + 1}</div>
              <div className={styles.stepLabel}>{step}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Material Requests</h1>

      {/* Worker new request form */}
      {userRole === "worker" && (
        <div className={styles.newRequestCard}>
          <h2>Create New Request</h2>

          <div className={styles.formRow}>
            <select
              className={styles.select}
              value={newRequest.projectId}
              onChange={(e) => setNewRequest({ ...newRequest, projectId: e.target.value })}
            >
              <option value="">Select Project</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>

          <div className={styles.formRow}>
            <select
              className={styles.select}
              value={currentItem.materialId}
              onChange={(e) => setCurrentItem({ ...currentItem, materialId: e.target.value })}
            >
              <option value="">Select Material</option>
              {materials.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
            <input
              className={styles.input}
              type="number"
              placeholder="Quantity"
              value={currentItem.quantity}
              onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Purpose"
              value={currentItem.purpose}
              onChange={(e) => setCurrentItem({ ...currentItem, purpose: e.target.value })}
            />
            <button className={styles.addButton} onClick={addItem}>Add</button>
          </div>

          <ul className={styles.itemList}>
            {newRequest.items.map((item, i) => {
              const mat = materials.find((m) => m._id === item.materialId);
              return (
                <li key={i}>
                  {mat?.name} - {item.quantity} ({item.purpose})
                  <button className={styles.cancelBtn} onClick={() => cancelItem(i)}>❌</button>
                </li>
              );
            })}
          </ul>

          <button
            className={styles.submitButton}
            onClick={submitRequest}
            disabled={!newRequest.projectId || newRequest.items.length === 0}
          >
            Submit Request
          </button>
        </div>
      )}

      {/* Requests table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Materials</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Approvals</th>
              {userRole !== "worker" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? requests.map((r) => {
              const project = projects.find((p) => p._id === (r.projectId?._id || r.projectId));
              return (
                <tr key={r._id}>
                  <td>{project?.name || "Unknown"}</td>
                  <td>
                    {r.materials.map((m, i) => {
                      const mat = materials.find((x) => x._id === (m.materialId?._id || m.materialId));
                      return <div key={i}>{mat?.name} - {m.quantity} ({m.purpose})</div>;
                    })}
                  </td>
                  <td><span className={`${styles.status} ${statusBadge(r.status)}`}>{r.status}</span></td>
                  <td>{renderProgress(r.status)}</td>
                  <td>
                    {r.approvals.map((a, i) => (
                      <div key={i}>{a.role}: {a.decision} {a.comment ? `(${a.comment})` : ""}</div>
                    ))}
                    {["engineer","pm","storekeeper"].includes(userRole) && r.status.includes("pending") && !actedRequests[r._id] && (
                      <input
                        type="text"
                        placeholder="Add comment"
                        value={comments[r._id] || ""}
                        onChange={(e) => setComments({ ...comments, [r._id]: e.target.value })}
                        className={styles.commentInput}
                      />
                    )}
                  </td>
                  {userRole !== "worker" && (
                    <td className={styles.actions}>
                      {["engineer","pm","storekeeper"].includes(userRole) && r.status.startsWith("pending") && !actedRequests[r._id] && (
                        <>
                          <button className={styles.approveBtn} onClick={() => approve(r._id, "approved")}>Approve</button>
                          <button className={styles.rejectBtn} onClick={() => approve(r._id, "rejected")}>Reject</button>
                        </>
                      )}
                      {userRole === "admin" && ["approved","rejected"].includes(r.status) && (
                        <button className={styles.deleteBtn} onClick={() => deleteRequest(r._id)}>Delete</button>
                      )}
                    </td>
                  )}
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={userRole !== "worker" ? 6 : 5} className={styles.noData}>
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequestsPage;

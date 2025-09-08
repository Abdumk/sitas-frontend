// // src/pages/MaterialsPage.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "./MaterialsPage.module.css";

// function MaterialsPage() {
//   const [materials, setMaterials] = useState([]);
//   const [inventory, setInventory] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [search, setSearch] = useState("");
//   const [materialForm, setMaterialForm] = useState({
//     name: "",
//     brand: "",
//     type: "",
//     unit: "bag",
//   });
//   const [inventoryForm, setInventoryForm] = useState({
//     projectId: "",
//     materialId: "",
//     quantity: 0,
//     minLevel: 0,
//   });
//   const [editMaterialId, setEditMaterialId] = useState(null);
//   const [editInventoryId, setEditInventoryId] = useState(null);

//   const token = localStorage.getItem("token");

//   // Fetch all necessary data
//   useEffect(() => {
//     fetchProjects();
//     fetchMaterialsCatalog();
//     fetchInventory();
//   }, []);

//   const fetchProjects = () => {
//     axios
//       .get("http://localhost:5000/api/projects", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setProjects(res.data))
//       .catch((err) => console.error("Error fetching projects:", err));
//   };

//   const fetchMaterialsCatalog = () => {
//     axios
//       .get("http://localhost:5000/api/materials", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setMaterials(res.data))
//       .catch((err) => console.error("Error fetching materials catalog:", err));
//   };

//   const fetchInventory = () => {
//     const url = `http://localhost:5000/api/inventory?t=${Date.now()}`;
//     axios
//       .get(url, { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => setInventory(res.data))
//       .catch((err) => console.error("Error fetching inventory:", err));
//   };

//   const handleMaterialChange = (e) => {
//     setMaterialForm({ ...materialForm, [e.target.name]: e.target.value });
//   };

//   const handleInventoryChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "quantity" || name === "minLevel") {
//       const num = value === "" ? 0 : parseInt(value, 10);
//       setInventoryForm({ ...inventoryForm, [name]: isNaN(num) ? 0 : num });
//     } else {
//       setInventoryForm({ ...inventoryForm, [name]: value });
//     }
//   };

//   const resetMaterialForm = () => {
//     setMaterialForm({ name: "", brand: "", type: "", unit: "bag" });
//     setEditMaterialId(null);
//   };

//   const resetInventoryForm = () => {
//     setInventoryForm({
//       projectId: "",
//       materialId: "",
//       quantity: 0,
//       minLevel: 0,
//     });
//     setEditInventoryId(null);
//   };

//   // Handle Material Submit
//   const handleMaterialSubmit = (e) => {
//     e.preventDefault();
//     if (editMaterialId) {
//       axios
//         .put(
//           `http://localhost:5000/api/materials/${editMaterialId}`,
//           materialForm,
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         .then(() => {
//           fetchMaterialsCatalog();
//           resetMaterialForm();
//         })
//         .catch((err) => console.error("Error updating material:", err));
//     } else {
//       axios
//         .post("http://localhost:5000/api/materials", materialForm, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then(() => {
//           fetchMaterialsCatalog();
//           resetMaterialForm();
//         })
//         .catch((err) => console.error("Error adding material:", err));
//     }
//   };

//   // Handle Inventory Submit
//   const handleInventorySubmit = async (e) => {
//     e.preventDefault();

//     if (!inventoryForm.projectId) return alert("Please select a project");
//     if (!inventoryForm.materialId) return alert("Please select a material");
//     if (Number(inventoryForm.quantity) <= 0)
//       return alert("Quantity must be greater than 0");

//     try {
//       let res;
//       if (editInventoryId) {
//         res = await axios.put(
//           `http://localhost:5000/api/inventory/${editInventoryId}`,
//           {
//             quantity: Number(inventoryForm.quantity),
//             minLevel: Number(inventoryForm.minLevel),
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } else {
//         res = await axios.post(
//           "http://localhost:5000/api/inventory",
//           {
//             projectId: inventoryForm.projectId,
//             materialId: inventoryForm.materialId,
//             quantity: Number(inventoryForm.quantity),
//             minLevel: Number(inventoryForm.minLevel),
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }

//       fetchInventory();
//       resetInventoryForm();
//     } catch (err) {
//       console.error("Error saving inventory:", err);
//       alert("Save failed: " + (err.response?.data?.msg || "Check console"));
//     }
//   };

//   const handleEditMaterial = (material) => {
//     setMaterialForm({
//       name: material.name,
//       brand: material.brand,
//       type: material.type,
//       unit: material.unit,
//     });
//     setEditMaterialId(material._id);
//   };

//   const handleEditInventory = (item) => {
//     setInventoryForm({
//       projectId: item.projectId?._id || item.projectId,
//       materialId: item.materialId?._id || item.materialId,
//       quantity: item.quantity,
//       minLevel: item.minLevel,
//     });
//     setEditInventoryId(item._id);
//   };

//   const handleDeleteMaterial = (id) => {
//     if (window.confirm("Delete this material from the catalog?")) {
//       axios
//         .delete(`http://localhost:5000/api/materials/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then(() => fetchMaterialsCatalog());
//     }
//   };

//   const handleDeleteInventory = (id) => {
//     if (window.confirm("Delete this inventory record?")) {
//       axios
//         .delete(`http://localhost:5000/api/inventory/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then(() => fetchInventory());
//     }
//   };

//   // Filter inventory by search
//   const filteredInventory = inventory.filter((item) => {
//     const material =
//       typeof item.materialId === "object"
//         ? item.materialId
//         : materials.find((m) => m._id.toString() === item.materialId?.toString());

//     if (!material) return false;

//     return (
//       material.name?.toLowerCase().includes(search.toLowerCase()) ||
//       material.brand?.toLowerCase().includes(search.toLowerCase())
//     );
//   });

//   return (
//     <div className={styles.container}>
//       <h1>Material Catalog</h1>

//       {/* Form for adding new material types */}
//       <form onSubmit={handleMaterialSubmit} className={styles.form}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Material Name"
//           value={materialForm.name}
//           onChange={handleMaterialChange}
//           required
//         />
//         <input
//           type="text"
//           name="brand"
//           placeholder="Brand"
//           value={materialForm.brand}
//           onChange={handleMaterialChange}
//           required
//         />
//         <input
//           type="text"
//           name="type"
//           placeholder="Type"
//           value={materialForm.type}
//           onChange={handleMaterialChange}
//           required
//         />
//         <select
//           name="unit"
//           value={materialForm.unit}
//           onChange={handleMaterialChange}
//         >
//           <option value="bag">Bag</option>
//           <option value="kg">Kg</option>
//           <option value="ton">Ton</option>
//           <option value="Piece">Piece</option>
//           <option value="Liter">Liter</option>
//           <option value="Mcube">Mcube</option>
//         </select>
//         <button type="submit">
//           {editMaterialId ? "Update Material" : "Add New Material"}
//         </button>
//         {editMaterialId && (
//           <button type="button" onClick={resetMaterialForm}>
//             Cancel
//           </button>
//         )}
//       </form>

//       {/* Table: Materials in Catalog */}
//       <h2>Materials in Catalog</h2>
//       <table className={styles.table} id="catalog-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Brand</th>
//             <th>Type</th>
//             <th>Unit</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {materials.map((item) => (
//             <tr key={item._id}>
//               <td>{item.name}</td>
//               <td>{item.brand}</td>
//               <td>{item.type}</td>
//               <td>{item.unit}</td>
//               <td>
//                 <button onClick={() => handleEditMaterial(item)}>Edit</button>
//                 <button onClick={() => handleDeleteMaterial(item._id)}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {materials.length === 0 && (
//             <tr>
//               <td colSpan="5" style={{ textAlign: "center" }}>
//                 No materials in catalog
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Mobile Cards: Materials in Catalog */}
//       <div className={styles.cards} id="catalog-cards">
//         {materials.map((item) => (
//           <div key={item._id} className={styles.card}>
//             <h3>{item.name}</h3>
//             <div className={styles.cardInfo}>
//               <span>🏷️ Brand:</span>
//               <span>{item.brand}</span>
//             </div>
//             <div className={styles.cardInfo}>
//               <span>🔬 Type:</span>
//               <span>{item.type}</span>
//             </div>
//             <div className={styles.cardInfo}>
//               <span>📦 Unit:</span>
//               <span>{item.unit}</span>
//             </div>
//             <div className={styles.cardActions}>
//               <button onClick={() => handleEditMaterial(item)}>Edit</button>
//               <button onClick={() => handleDeleteMaterial(item._id)} className={styles.deleteBtn}>
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//         {materials.length === 0 && (
//           <p className={styles.empty}>No materials in catalog.</p>
//         )}
//       </div>

//       <hr className={styles.divider} />

//       <h1>Project Inventory</h1>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search inventory by material or brand..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className={styles.search}
//       />

//       {/* Form for adding to inventory */}
//       <form onSubmit={handleInventorySubmit} className={styles.form}>
//         <select
//           name="projectId"
//           value={inventoryForm.projectId}
//           onChange={handleInventoryChange}
//           required
//         >
//           <option value="">Select Project</option>
//           {projects.map((p) => (
//             <option key={p._id} value={p._id}>
//               {p.name}
//             </option>
//           ))}
//         </select>
//         <select
//           name="materialId"
//           value={inventoryForm.materialId}
//           onChange={handleInventoryChange}
//           required
//         >
//           <option value="">Select Material</option>
//           {materials.map((m) => (
//             <option key={m._id} value={m._id}>
//               {m.name} - {m.brand}
//             </option>
//           ))}
//         </select>
//         <input
//           type="number"
//           name="quantity"
//           placeholder="Quantity"
//           value={inventoryForm.quantity}
//           onChange={handleInventoryChange}
//           required
//         />
//         <input
//           type="number"
//           name="minLevel"
//           placeholder="Min Level"
//           value={inventoryForm.minLevel}
//           onChange={handleInventoryChange}
//           required
//         />
//         <button type="submit">
//           {editInventoryId ? "Update Inventory" : "Add to Inventory"}
//         </button>
//         {editInventoryId && (
//           <button type="button" onClick={resetInventoryForm}>
//             Cancel
//           </button>
//         )}
//       </form>

//       {/* Table: Current Project Inventory */}
//       <h2>Current Project Inventory</h2>
//       <table className={styles.table} id="inventory-table">
//         <thead>
//           <tr>
//             <th>Project</th>
//             <th>Material</th>
//             <th>Brand</th>
//             <th>Type</th>
//             <th>Unit</th>
//             <th>Quantity</th>
//             <th>Min Level</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredInventory.length > 0 ? (
//             filteredInventory.map((item) => {
//               const project =
//                 typeof item.projectId === "object"
//                   ? item.projectId
//                   : projects.find((p) => p._id.toString() === item.projectId?.toString());

//               const material =
//                 typeof item.materialId === "object"
//                   ? item.materialId
//                   : materials.find((m) => m._id.toString() === item.materialId?.toString());

//               return (
//                 <tr key={item._id}>
//                   <td>{project?.name || "Unknown Project"}</td>
//                   <td>{material?.name || "Unknown Material"}</td>
//                   <td>{material?.brand || "N/A"}</td>
//                   <td>{material?.type || "N/A"}</td>
//                   <td>{material?.unit || "N/A"}</td>
//                   <td>{item.quantity}</td>
//                   <td>{item.minLevel}</td>
//                   <td>
//                     {item.quantity < item.minLevel ? "⚠️ Low Stock" : "✅ OK"}
//                   </td>
//                   <td>
//                     <button onClick={() => handleEditInventory(item)}>Edit</button>
//                     <button onClick={() => handleDeleteInventory(item._id)}>Delete</button>
//                   </td>
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan="9" style={{ textAlign: "center" }}>
//                 No inventory found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Mobile Cards: Current Project Inventory */}
//       <div className={styles.cards} id="inventory-cards">
//         {filteredInventory.length > 0 ? (
//           filteredInventory.map((item) => {
//             const project =
//               typeof item.projectId === "object"
//                 ? item.projectId
//                 : projects.find((p) => p._id.toString() === item.projectId?.toString());

//             const material =
//               typeof item.materialId === "object"
//                 ? item.materialId
//                 : materials.find((m) => m._id.toString() === item.materialId?.toString());

//             return (
//               <div key={item._id} className={styles.card}>
//                 <h3>{material?.name || "Unknown"}</h3>
//                 <div className={styles.cardInfo}>
//                   <span>🏗️ Project:</span>
//                   <span>{project?.name || "Unknown"}</span>
//                 </div>
//                 <div className={styles.cardInfo}>
//                   <span>🏷️ Brand:</span>
//                   <span>{material?.brand || "N/A"}</span>
//                 </div>
//                 <div className={styles.cardInfo}>
//                   <span>🔬 Type:</span>
//                   <span>{material?.type || "N/A"}</span>
//                 </div>
//                 <div className={styles.cardInfo}>
//                   <span>📦 Unit:</span>
//                   <span>{material?.unit || "N/A"}</span>
//                 </div>
//                 <div className={styles.cardInfo}>
//                   <span>🔢 Quantity:</span>
//                   <span>{item.quantity}</span>
//                 </div>
//                 <div className={styles.cardInfo}>
//                   <span>⚠️ Min Level:</span>
//                   <span>{item.minLevel}</span>
//                 </div>
//                 <div className={styles.cardInfo}>
//                   <span>Status:</span>
//                   <span
//                     style={{
//                       fontWeight: "bold",
//                       color: item.quantity < item.minLevel ? "#d9534f" : "#5cb85c",
//                     }}
//                   >
//                     {item.quantity < item.minLevel ? "⚠️ Low Stock" : "✅ OK"}
//                   </span>
//                 </div>
//                 <div className={styles.cardActions}>
//                   <button onClick={() => handleEditInventory(item)}>Edit</button>
//                   <button
//                     onClick={() => handleDeleteInventory(item._id)}
//                     className={styles.deleteBtn}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <p className={styles.empty}>No inventory found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default MaterialsPage;
// src/pages/MaterialsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MaterialsPage.module.css";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Backend base URL

function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [materialForm, setMaterialForm] = useState({
    name: "",
    brand: "",
    type: "",
    unit: "bag",
  });
  const [inventoryForm, setInventoryForm] = useState({
    projectId: "",
    materialId: "",
    quantity: 0,
    minLevel: 0,
  });
  const [editMaterialId, setEditMaterialId] = useState(null);
  const [editInventoryId, setEditInventoryId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all necessary data
  useEffect(() => {
    fetchProjects();
    fetchMaterialsCatalog();
    fetchInventory();
  }, []);

  const fetchProjects = () => {
    axios
      .get(`${API_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  };

  const fetchMaterialsCatalog = () => {
    axios
      .get(`${API_URL}/materials`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMaterials(res.data))
      .catch((err) => console.error("Error fetching materials catalog:", err));
  };

  const fetchInventory = () => {
    const url = `${API_URL}/inventory?t=${Date.now()}`;
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setInventory(res.data))
      .catch((err) => console.error("Error fetching inventory:", err));
  };

  const handleMaterialChange = (e) => {
    setMaterialForm({ ...materialForm, [e.target.name]: e.target.value });
  };

  const handleInventoryChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" || name === "minLevel") {
      const num = value === "" ? 0 : parseInt(value, 10);
      setInventoryForm({ ...inventoryForm, [name]: isNaN(num) ? 0 : num });
    } else {
      setInventoryForm({ ...inventoryForm, [name]: value });
    }
  };

  const resetMaterialForm = () => {
    setMaterialForm({ name: "", brand: "", type: "", unit: "bag" });
    setEditMaterialId(null);
  };

  const resetInventoryForm = () => {
    setInventoryForm({ projectId: "", materialId: "", quantity: 0, minLevel: 0 });
    setEditInventoryId(null);
  };

  // Handle Material Submit
  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    if (editMaterialId) {
      axios
        .put(`${API_URL}/materials/${editMaterialId}`, materialForm, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          fetchMaterialsCatalog();
          resetMaterialForm();
        })
        .catch((err) => console.error("Error updating material:", err));
    } else {
      axios
        .post(`${API_URL}/materials`, materialForm, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          fetchMaterialsCatalog();
          resetMaterialForm();
        })
        .catch((err) => console.error("Error adding material:", err));
    }
  };

  // Handle Inventory Submit
  const handleInventorySubmit = async (e) => {
    e.preventDefault();

    if (!inventoryForm.projectId) return alert("Please select a project");
    if (!inventoryForm.materialId) return alert("Please select a material");
    if (Number(inventoryForm.quantity) <= 0) return alert("Quantity must be greater than 0");

    try {
      if (editInventoryId) {
        await axios.put(`${API_URL}/inventory/${editInventoryId}`, {
          quantity: Number(inventoryForm.quantity),
          minLevel: Number(inventoryForm.minLevel),
        }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API_URL}/inventory`, {
          projectId: inventoryForm.projectId,
          materialId: inventoryForm.materialId,
          quantity: Number(inventoryForm.quantity),
          minLevel: Number(inventoryForm.minLevel),
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchInventory();
      resetInventoryForm();
    } catch (err) {
      console.error("Error saving inventory:", err);
      alert("Save failed: " + (err.response?.data?.msg || "Check console"));
    }
  };

  const handleEditMaterial = (material) => {
    setMaterialForm({ name: material.name, brand: material.brand, type: material.type, unit: material.unit });
    setEditMaterialId(material._id);
  };

  const handleEditInventory = (item) => {
    setInventoryForm({
      projectId: item.projectId?._id || item.projectId,
      materialId: item.materialId?._id || item.materialId,
      quantity: item.quantity,
      minLevel: item.minLevel,
    });
    setEditInventoryId(item._id);
  };

  const handleDeleteMaterial = (id) => {
    if (window.confirm("Delete this material from the catalog?")) {
      axios.delete(`${API_URL}/materials/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => fetchMaterialsCatalog());
    }
  };

  const handleDeleteInventory = (id) => {
    if (window.confirm("Delete this inventory record?")) {
      axios.delete(`${API_URL}/inventory/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => fetchInventory());
    }
  };

  // Filter inventory by search
  const filteredInventory = inventory.filter((item) => {
    const material =
      typeof item.materialId === "object"
        ? item.materialId
        : materials.find((m) => m._id.toString() === item.materialId?.toString());

    if (!material) return false;

    return (
      material.name?.toLowerCase().includes(search.toLowerCase()) ||
      material.brand?.toLowerCase().includes(search.toLowerCase())
    );
  });
  return (
    <div className={styles.container}>
      <h1>Material Catalog</h1>

      {/* Form for adding new material types */}
      <form onSubmit={handleMaterialSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Material Name"
          value={materialForm.name}
          onChange={handleMaterialChange}
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={materialForm.brand}
          onChange={handleMaterialChange}
          required
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={materialForm.type}
          onChange={handleMaterialChange}
          required
        />
        <select
          name="unit"
          value={materialForm.unit}
          onChange={handleMaterialChange}
        >
          <option value="bag">Bag</option>
          <option value="kg">Kg</option>
          <option value="ton">Ton</option>
          <option value="Piece">Piece</option>
          <option value="Liter">Liter</option>
          <option value="Mcube">Mcube</option>
        </select>
        <button type="submit">
          {editMaterialId ? "Update Material" : "Add New Material"}
        </button>
        {editMaterialId && (
          <button type="button" onClick={resetMaterialForm}>
            Cancel
          </button>
        )}
      </form>

      {/* Table: Materials in Catalog */}
      <h2>Materials in Catalog</h2>
      <table className={styles.table} id="catalog-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Type</th>
            <th>Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.brand}</td>
              <td>{item.type}</td>
              <td>{item.unit}</td>
              <td>
                <button onClick={() => handleEditMaterial(item)}>Edit</button>
                <button onClick={() => handleDeleteMaterial(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {materials.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No materials in catalog
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Mobile Cards: Materials in Catalog */}
      <div className={styles.cards} id="catalog-cards">
        {materials.map((item) => (
          <div key={item._id} className={styles.card}>
            <h3>{item.name}</h3>
            <div className={styles.cardInfo}>
              <span>🏷️ Brand:</span>
              <span>{item.brand}</span>
            </div>
            <div className={styles.cardInfo}>
              <span>🔬 Type:</span>
              <span>{item.type}</span>
            </div>
            <div className={styles.cardInfo}>
              <span>📦 Unit:</span>
              <span>{item.unit}</span>
            </div>
            <div className={styles.cardActions}>
              <button onClick={() => handleEditMaterial(item)}>Edit</button>
              <button onClick={() => handleDeleteMaterial(item._id)} className={styles.deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {materials.length === 0 && (
          <p className={styles.empty}>No materials in catalog.</p>
        )}
      </div>

      <hr className={styles.divider} />

      <h1>Project Inventory</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search inventory by material or brand..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.search}
      />

      {/* Form for adding to inventory */}
      <form onSubmit={handleInventorySubmit} className={styles.form}>
        <select
          name="projectId"
          value={inventoryForm.projectId}
          onChange={handleInventoryChange}
          required
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          name="materialId"
          value={inventoryForm.materialId}
          onChange={handleInventoryChange}
          required
        >
          <option value="">Select Material</option>
          {materials.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name} - {m.brand}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={inventoryForm.quantity}
          onChange={handleInventoryChange}
          required
        />
        <input
          type="number"
          name="minLevel"
          placeholder="Min Level"
          value={inventoryForm.minLevel}
          onChange={handleInventoryChange}
          required
        />
        <button type="submit">
          {editInventoryId ? "Update Inventory" : "Add to Inventory"}
        </button>
        {editInventoryId && (
          <button type="button" onClick={resetInventoryForm}>
            Cancel
          </button>
        )}
      </form>

      {/* Table: Current Project Inventory */}
      <h2>Current Project Inventory</h2>
      <table className={styles.table} id="inventory-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Material</th>
            <th>Brand</th>
            <th>Type</th>
            <th>Unit</th>
            <th>Quantity</th>
            <th>Min Level</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item) => {
              const project =
                typeof item.projectId === "object"
                  ? item.projectId
                  : projects.find((p) => p._id.toString() === item.projectId?.toString());

              const material =
                typeof item.materialId === "object"
                  ? item.materialId
                  : materials.find((m) => m._id.toString() === item.materialId?.toString());

              return (
                <tr key={item._id}>
                  <td>{project?.name || "Unknown Project"}</td>
                  <td>{material?.name || "Unknown Material"}</td>
                  <td>{material?.brand || "N/A"}</td>
                  <td>{material?.type || "N/A"}</td>
                  <td>{material?.unit || "N/A"}</td>
                  <td>{item.quantity}</td>
                  <td>{item.minLevel}</td>
                  <td>
                    {item.quantity < item.minLevel ? "⚠️ Low Stock" : "✅ OK"}
                  </td>
                  <td>
                    <button onClick={() => handleEditInventory(item)}>Edit</button>
                    <button onClick={() => handleDeleteInventory(item._id)}>Delete</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No inventory found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Mobile Cards: Current Project Inventory */}
      <div className={styles.cards} id="inventory-cards">
        {filteredInventory.length > 0 ? (
          filteredInventory.map((item) => {
            const project =
              typeof item.projectId === "object"
                ? item.projectId
                : projects.find((p) => p._id.toString() === item.projectId?.toString());

            const material =
              typeof item.materialId === "object"
                ? item.materialId
                : materials.find((m) => m._id.toString() === item.materialId?.toString());

            return (
              <div key={item._id} className={styles.card}>
                <h3>{material?.name || "Unknown"}</h3>
                <div className={styles.cardInfo}>
                  <span>🏗️ Project:</span>
                  <span>{project?.name || "Unknown"}</span>
                </div>
                <div className={styles.cardInfo}>
                  <span>🏷️ Brand:</span>
                  <span>{material?.brand || "N/A"}</span>
                </div>
                <div className={styles.cardInfo}>
                  <span>🔬 Type:</span>
                  <span>{material?.type || "N/A"}</span>
                </div>
                <div className={styles.cardInfo}>
                  <span>📦 Unit:</span>
                  <span>{material?.unit || "N/A"}</span>
                </div>
                <div className={styles.cardInfo}>
                  <span>🔢 Quantity:</span>
                  <span>{item.quantity}</span>
                </div>
                <div className={styles.cardInfo}>
                  <span>⚠️ Min Level:</span>
                  <span>{item.minLevel}</span>
                </div>
                <div className={styles.cardInfo}>
                  <span>Status:</span>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: item.quantity < item.minLevel ? "#d9534f" : "#5cb85c",
                    }}
                  >
                    {item.quantity < item.minLevel ? "⚠️ Low Stock" : "✅ OK"}
                  </span>
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => handleEditInventory(item)}>Edit</button>
                  <button
                    onClick={() => handleDeleteInventory(item._id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className={styles.empty}>No inventory found.</p>
        )}
      </div>
    </div>
  );
}

export default MaterialsPage;
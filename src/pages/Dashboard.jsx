import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    axios
      .get('http://localhost:5000/api/inventory', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setInventory(res.data);
      })
      .catch((err) => {
        console.error('Error fetching inventory:', err);
        alert('Failed to load inventory. Please try again.');
      });
  }, []);

  // Filter and search
  const filteredInventory = inventory.filter((item) => {
    const materialName = item.materialId?.name?.toLowerCase() || '';
    const materialBrand = item.materialId?.brand?.toLowerCase() || '';
    const materialType = item.materialId?.type?.toLowerCase() || '';
    const projectName = item.projectId?.name?.toLowerCase() || '';

    const matchSearch =
      materialName.includes(search.toLowerCase()) ||
      materialBrand.includes(search.toLowerCase()) ||
      materialType.includes(search.toLowerCase()) ||
      projectName.includes(search.toLowerCase());

    const matchLowStock = filterLowStock ? item.quantity < item.minLevel : true;

    return matchSearch && matchLowStock;
  });

  return (
    <div className={styles.container}>
      <h1>Admin Dashboard</h1>

      {/* Search & Filter */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by material, brand, project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={filterLowStock}
            onChange={(e) => setFilterLowStock(e.target.checked)}
          />
          Show Low Stock Only
        </label>
      </div>

      {/* Inventory Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Material</th>
            <th>Project</th>
            <th>Quantity</th>
            <th>Min Level</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item) => (
            <tr key={item._id}>
              <td>
                {item.materialId
                  ? `${item.materialId.name} – ${item.materialId.brand} – ${item.materialId.type}`
                  : 'Unknown Material'}
              </td>
              <td>{item.projectId?.name || 'Unknown Project'}</td>
              <td>{item.quantity}</td>
              <td>{item.minLevel}</td>
              <td
                data-status={item.quantity < item.minLevel ? 'low' : 'ok'}
              >
                {item.quantity < item.minLevel ? '⚠️ Low Stock' : '✅ OK'}
              </td>
            </tr>
          ))}
          {filteredInventory.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>
                No inventory found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
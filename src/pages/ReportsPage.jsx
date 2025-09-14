import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";

import ReportDetailModal from "./ReportDetailModal";
import styles from "./ReportsPage.module.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReportsPage() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role") || "worker";

  const [dailyReports, setDailyReports] = useState(null);
  const [weeklyReports, setWeeklyReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [filter, setFilter] = useState({
    range: "Weekly", // Weekly | LastWeek | Daily | LastDay
    category: "All",
    role: "All"
  });

  // modal / detail state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalRows, setModalRows] = useState([]);

  // table pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Recharts colors
  const COLORS = ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#8e44ad'];

  const authHeaders = useMemo(() => ({
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  }), [token]);

  // Fetch daily & weekly once
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError("");
      try {
        const [dailyRes, weeklyRes] = await Promise.all([
          axios.get(`${API_URL}/reports/daily`, authHeaders),
          axios.get(`${API_URL}/reports/weekly`, authHeaders),
        ]);
        setDailyReports(dailyRes.data);
        setWeeklyReports(weeklyRes.data);
      } catch (err) {
        console.error("fetchReports error:", err);
        setError(err.response?.data?.msg || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL, token]);

  // select dataset to use in charts/tables
  const selected = useMemo(() => {
    if (filter.range === "Daily") return dailyReports;
    if (filter.range === "LastDay") {
      // backend doesn't currently provide a 'yesterday' endpoint;
      // this tries to reuse dailyReports and will be empty unless you fetch yesterday server-side.
      return dailyReports ? { ...dailyReports, date: "Yesterday", requests: [], transactions: [], stock: dailyReports.stock } : null;
    }
    if (filter.range === "Weekly") return weeklyReports;
    if (filter.range === "LastWeek") {
      // similar note: frontend-only placeholder
      return weeklyReports ? { ...weeklyReports, start: "Last Week", end: "Last Week", requests: [], transactions: [], stock: weeklyReports.stock } : null;
    }
    return null;
  }, [filter.range, dailyReports, weeklyReports]);

  // helper to flatten/display rows consistently in modal
  const normalizeRowsForModal = useCallback((rows) => {
    if (!Array.isArray(rows)) return [];
    return rows.map((r) => {
      const flat = {};
      // if r is primitive, return as single column row
      if (typeof r !== "object" || r === null) {
        return { value: String(r) };
      }
      Object.keys(r).forEach((k) => {
        if (k === "id" || k === "_id") return; // hide raw ids
        const v = r[k];
        if (typeof v === "object" && v !== null) {
          // prefer a friendly name if available
          flat[k] = v.name ?? v.project ?? v._id ?? JSON.stringify(v);
        } else {
          flat[k] = v;
        }
      });
      return flat;
    });
  }, []);

  // ===== Derived Data for charts =====
  const lowStockData = useMemo(() => {
    const arr = (selected?.stock || []).map(item => ({
      project: item.projectId?.name || 'Unknown',
      projectId: item.projectId?._id || item.projectId,
      material: item.materialId?.name || 'Unknown',
      quantity: Number(item.quantity || 0),
      minLevel: item.minLevel ?? item.materialId?.defaultMinLevel ?? 0,
    }));
    const grouped = {};
    arr.forEach(i => {
      grouped[i.project] = grouped[i.project] || { project: i.project, quantity: 0 };
      grouped[i.project].quantity += Number(i.quantity || 0);
    });
    return Object.values(grouped);
  }, [selected]);

  const issuedMaterialsData = useMemo(() => {
    const txs = selected?.transactions || [];
    const grouped = {};
    txs.forEach(t => {
      const name = t.projectId?.name || "Unknown";
      grouped[name] = grouped[name] || { project: name, issued: 0 };
      if (t.type === "out" || t.type === "issue") grouped[name].issued += Number(t.quantity || 0);
    });
    return Object.values(grouped);
  }, [selected]);

  const approvalData = useMemo(() => {
    const reqs = selected?.requests || [];
    const approved = reqs.filter(r => r.status === 'approved').length || 0;
    const rejected = reqs.filter(r => r.status === 'rejected').length || 0;
    return [
      { name: 'Approved', value: approved },
      { name: 'Rejected', value: rejected },
    ];
  }, [selected]);

  // ===== Table rows =====
  const rawRows = useMemo(() => {
    const reqRows = (selected?.requests || []).map(r => ({
      id: r._id,
      type: "Request",
      project: r.projectId?.name || "",
      requestedBy: r.requestedById?.name || "",
      status: r.status,
      date: new Date(r.createdAt).toLocaleString(),
      details: r
    }));

    const txRows = (selected?.transactions || []).map(t => ({
      id: t._id,
      type: "Transaction",
      project: t.projectId?.name || "",
      material: t.materialId?.name || "",
      txType: t.type,
      quantity: t.quantity,
      date: new Date(t.createdAt).toLocaleString(),
      details: t
    }));

    const stockRows = (selected?.stock || []).map(s => ({
      id: `${s.projectId?._id || s.projectId}_${s.materialId?._id || s.materialId}`,
      type: "Inventory",
      project: s.projectId?.name || "",
      material: s.materialId?.name || "",
      quantity: s.quantity,
      minLevel: s.minLevel || s.materialId?.defaultMinLevel || 0,
      details: s
    }));

    let combined = [...reqRows, ...txRows, ...stockRows];

    // Apply category filter
    if (filter.category !== "All") {
      if (filter.category === "Requests") combined = combined.filter(r => r.type === "Request");
      if (filter.category === "Materials") combined = combined.filter(r => r.type === "Inventory" || r.type === "Transaction");
    }

    // Apply role filter
    if (filter.role !== "All") {
      const fr = filter.role.toLowerCase();
      combined = combined.filter(r => {
        if (fr === "storekeeper") return r.type === "Inventory" || r.type === "Transaction";
        if (fr === "worker" || fr === "engineer" || fr === "pm") return r.type === "Request";
        if (fr === "admin") return true;
        return true;
      });
    }

    // Auth restrictions (client-side)
    if (userRole !== "admin" && userRole !== "storekeeper") {
      combined = combined.filter(r => r.type === "Request");
    }

    // sort by date desc
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return combined;
  }, [selected, filter.category, filter.role, userRole]);

  const totalPages = Math.max(1, Math.ceil(rawRows.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const visibleRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rawRows.slice(start, start + pageSize);
  }, [rawRows, page]);

  // ===== Modal open helper (normalize rows) =====
  const openDetailModal = useCallback((title, rows) => {
    console.log("openDetailModal called:", title, rows?.length ?? 0);
    const normalized = normalizeRowsForModal(rows || []);
    setModalTitle(title || "Details");
    setModalRows(normalized);
    setModalOpen(true);
  }, [normalizeRowsForModal]);

  const closeModal = () => {
    setModalOpen(false);
    setModalRows([]);
    setModalTitle("");
  };

  // ===== Chart click handlers (robust payload handling) =====
  const handleLowStockBarClick = useCallback((data, index) => {
    // Recharts may pass an entry object or object with .payload
    console.log("lowStock bar click:", data, index);
    const entry = data?.payload ?? data;
    const project = entry?.project ?? entry;
    if (!project) return;
    const rows = (selected?.stock || [])
      .filter(s => (s.projectId?.name || s.projectId) === project)
      .map(s => ({
        project: s.projectId?.name || "",
        material: s.materialId?.name || "",
        quantity: s.quantity,
        minLevel: s.minLevel ?? s.materialId?.defaultMinLevel ?? 0
      }));
    openDetailModal(`Low stock — ${project}`, rows);
  }, [openDetailModal, selected]);

  const handleIssuedDotClick = useCallback((data) => {
    // data might be { payload: {...} } or the payload directly
    console.log("issued dot click:", data);
    const payload = data?.payload ?? data;
    const project = payload?.project ?? payload;
    if (!project) return;
    const rows = (selected?.transactions || [])
      .filter(t => (t.projectId?.name || t.projectId) === project)
      .map(t => ({
        id: t._id,
        material: t.materialId?.name,
        type: t.type,
        quantity: t.quantity,
        date: new Date(t.createdAt).toLocaleString(),
        by: t.issuedById?.name || ""
      }));
    openDetailModal(`Issued Materials — ${project}`, rows);
  }, [openDetailModal, selected]);

  const handlePieClick = useCallback((entry) => {
    console.log("pie click:", entry);
    const name = entry?.name ?? entry?.payload?.name ?? entry?.payload?.payload?.name;
    if (!name) return;
    const key = name.toLowerCase() === "approved" ? "approved" : "rejected";
    const rows = (selected?.requests || []).filter(r => r.status === key).map(r => ({
      id: r._id,
      project: r.projectId?.name,
      requestedBy: r.requestedById?.name,
      status: r.status,
      date: new Date(r.createdAt).toLocaleString()
    }));
    openDetailModal(`${name} Requests`, rows);
  }, [openDetailModal, selected]);

  // Card clicks (summary cards)
  const onCardClick = (cardKey) => {
    if (!selected) return;
    if (cardKey === "requests") {
      const rows = (selected.requests || []).map(r => ({
        id: r._id,
        project: r.projectId?.name,
        requestedBy: r.requestedById?.name,
        status: r.status,
        date: new Date(r.createdAt).toLocaleString()
      }));
      openDetailModal(`Requests (${filter.range})`, rows);
    } else if (cardKey === "transactions") {
      const rows = (selected.transactions || []).map(t => ({
        id: t._id,
        project: t.projectId?.name,
        material: t.materialId?.name,
        type: t.type,
        quantity: t.quantity,
        date: new Date(t.createdAt).toLocaleString()
      }));
      openDetailModal(`Transactions (${filter.range})`, rows);
    } else if (cardKey === "stock") {
      const rows = (selected.stock || []).map(s => ({
        project: s.projectId?.name,
        material: s.materialId?.name,
        quantity: s.quantity,
        minLevel: s.minLevel
      }));
      openDetailModal(`Inventory (${filter.range})`, rows);
    }
  };

  // Row click => show details
  const handleRowClick = (row) => {
    console.log("row clicked:", row);
    const r = row.details || row;
    if (row.type === "Request" || r.materials) {
      const rows = [{
        id: r._id,
        project: r.projectId?.name,
        requestedBy: r.requestedById?.name,
        status: r.status,
        materials: (r.materials || []).map(m => `${m.materialId?.name || m.materialId} (x${m.quantity})`).join("; "),
        approvals: (r.approvals || []).map(a => `${a.role}:${a.decision}`).join("; "),
        date: new Date(r.createdAt).toLocaleString()
      }];
      openDetailModal("Request detail", rows);
    } else if (row.type === "Transaction") {
      const rows = [{
        id: r._id,
        project: r.projectId?.name,
        material: r.materialId?.name,
        type: r.type,
        quantity: r.quantity,
        issuedBy: r.issuedById?.name,
        date: new Date(r.createdAt).toLocaleString()
      }];
      openDetailModal("Transaction detail", rows);
    } else if (row.type === "Inventory") {
      const rows = [{
        project: r.projectId?.name,
        material: r.materialId?.name,
        quantity: r.quantity,
        minLevel: r.minLevel
      }];
      openDetailModal("Inventory detail", rows);
    } else {
      openDetailModal("Detail", [row]);
    }
  };

  // CSV export (for entire table view)
  const exportToCsv = (rows, filename = "reports.csv") => {
    if (!rows || !rows.length) {
      alert("No rows to export");
      return;
    }
    const keys = Object.keys(rows[0]);
    const csv = [
      keys.join(","),
      ...rows.map(r => keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className={styles.container}><p className={styles.loading}>Loading reports...</p></div>;
  if (error) return <div className={styles.container}><p className={styles.error}>{error}</p></div>;

  // friendly totals
  const totals = {
    requests: selected?.requests?.length || 0,
    transactions: selected?.transactions?.length || 0,
    stockItems: selected?.stock?.length || 0
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📊 Reports</h1>
        <div className={styles.controls}>
          <select value={filter.range} onChange={(e) => setFilter({ ...filter, range: e.target.value })}>
            <option value="Weekly">This Week</option>
            <option value="LastWeek">Last Week</option>
            <option value="Daily">Today</option>
            <option value="LastDay">Yesterday</option>
          </select>

          <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
            <option>All</option>
            <option>Projects</option>
            <option>Requests</option>
            <option>Materials</option>
          </select>

          <select value={filter.role} onChange={(e) => setFilter({ ...filter, role: e.target.value })}>
            <option>All</option>
            <option>Admin</option>
            <option>Worker</option>
            <option>Engineer</option>
            <option>PM</option>
            <option>Storekeeper</option>
          </select>

          <button className={styles.exportBtn} onClick={() => exportToCsv(rawRows, `reports-${filter.range.toLowerCase()}.csv`)}>
            Export CSV
          </button>
        </div>
      </div>

      {/* summary cards */}
      <div className={styles.cards}>
        <div className={styles.card} onClick={() => onCardClick("requests")} role="button" tabIndex={0}>
          <h3>Total Requests</h3>
          <p className={styles.big}>{totals.requests}</p>
          <small>Requests in {filter.range.toLowerCase()}</small>
        </div>
        <div className={styles.card} onClick={() => onCardClick("transactions")} role="button" tabIndex={0}>
          <h3>Total Transactions</h3>
          <p className={styles.big}>{totals.transactions}</p>
          <small>Stock issued/returned</small>
        </div>
        <div className={styles.card} onClick={() => onCardClick("stock")} role="button" tabIndex={0}>
          <h3>Inventory Items</h3>
          <p className={styles.big}>{totals.stockItems}</p>
          <small>Unique items across projects</small>
        </div>
      </div>

      {/* charts */}
      <section className={styles.charts}>
        <div className={styles.chartCard}>
          <h4>Low-stock per Project</h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={lowStockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="project" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" onClick={(data, idx) => handleLowStockBarClick(data, idx)}>
                {lowStockData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h4>Issued Materials per Project</h4>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={issuedMaterialsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="project" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* activeDot onClick may pass a payload; use our robust handler */}
              <Line
                type="monotone"
                dataKey="issued"
                stroke="#2196f3"
                strokeWidth={2}
                activeDot={{ onClick: (e) => handleIssuedDotClick(e) }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h4>Request Approval vs Rejection</h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={approvalData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                onClick={(entry, index) => handlePieClick(entry)}
              >
                {approvalData.map((entry, idx) => (
                  <Cell key={`cell-ap-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* table / detailed list */}
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h2>Detailed Reports</h2>
          <div className={styles.pagination}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
            <span>Page {page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Project</th>
              <th>Summary</th>
              <th>Status / Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 && (
              <tr><td colSpan="5" className={styles.emptyRow}>No records available</td></tr>
            )}
            {visibleRows.map((r) => (
              <tr
                key={r.id}
                onClick={() => handleRowClick(r)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleRowClick(r); }}
                tabIndex={0}
                role="button"
                className={styles.row}
                aria-label={`Open ${r.type}`}
              >
                <td>{r.type}</td>
                <td>{r.project}</td>
                <td>{r.type === "Request" ? (r.requestedBy || "") : (r.material || "")}</td>
                <td>
                  {r.type === "Request" ? <span className={styles.badge}>{r.status}</span> : r.quantity || r.txType || "-"}
                </td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ReportDetailModal open={modalOpen} title={modalTitle} rows={modalRows} onClose={closeModal} />
    </div>
  );
}

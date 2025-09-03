import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import styles from './ReportsPage.module.css';

function ReportsPage() {
  const [dailyReports, setDailyReports] = useState(null);
  const [weeklyReports, setWeeklyReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [daily, weekly] = await Promise.all([
          axios.get('http://localhost:5000/api/reports/daily', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/reports/weekly', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDailyReports(daily.data);
        setWeeklyReports(weekly.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch reports.');
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  if (loading) return <p className={styles.loading}>Loading reports...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  // Sample chart data
  const lowStockData = weeklyReports?.stock?.map(item => ({
    project: item.projectId?.name || 'Unknown',
    quantity: item.quantity,
  })) || [];

  const issuedMaterialsData = weeklyReports?.transactions?.map(tx => ({
    project: tx.projectId?.name || 'Unknown',
    issued: tx.type === 'issue' ? tx.quantity : 0,
  })) || [];

  const approvalData = [
    { name: 'Approved', value: weeklyReports?.requests.filter(r => r.status === 'approved').length || 0 },
    { name: 'Rejected', value: weeklyReports?.requests.filter(r => r.status === 'rejected').length || 0 },
  ];

  const COLORS = ['#4caf50', '#f44336'];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📊 Reports Dashboard</h1>

      {/* Daily Report Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📅 Daily Report ({dailyReports?.date || 'N/A'})</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Total Requests</h3>
            <p>{dailyReports?.requests?.length || 0}</p>
            <small>Requests submitted today</small>
          </div>
          <div className={styles.card}>
            <h3>Total Transactions</h3>
            <p>{dailyReports?.transactions?.length || 0}</p>
            <small>Stock issued/returned today</small>
          </div>
          <div className={styles.card}>
            <h3>Total Inventory Items</h3>
            <p>{dailyReports?.stock?.length || 0}</p>
            <small>Unique materials available</small>
          </div>
        </div>
      </section>

      {/* Weekly Report Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🗓 Weekly Report ({weeklyReports?.start} - {weeklyReports?.end})</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Total Requests</h3>
            <p>{weeklyReports?.requests?.length || 0}</p>
            <small>Requests submitted this week</small>
          </div>
          <div className={styles.card}>
            <h3>Total Transactions</h3>
            <p>{weeklyReports?.transactions?.length || 0}</p>
            <small>Stock issued/returned this week</small>
          </div>
          <div className={styles.card}>
            <h3>Total Inventory Items</h3>
            <p>{weeklyReports?.stock?.length || 0}</p>
            <small>Unique materials available across projects</small>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📈 Charts</h2>
        <div className={styles.charts}>
          {/* Low-stock per project */}
          <div className={styles.chartCard}>
            <h4>Low-stock Items per Project</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={lowStockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="project" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Issued materials per project */}
          <div className={styles.chartCard}>
            <h4>Total Issued Materials per Project</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={issuedMaterialsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="project" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="issued" stroke="#2196f3" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Approval vs Rejection */}
          <div className={styles.chartCard}>
            <h4>Request Approval vs Rejection</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={approvalData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {approvalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReportsPage;

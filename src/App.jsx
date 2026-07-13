import React, { useEffect, useState, useMemo } from 'react';
import api from './api/api';
import Header from './components/Header';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';

const FIELDS = [
    { name: 'medicineName', label: 'Medicine Name', input: 'text', required: true, placeholder: "e.g. Paracetamol" },
    { name: 'dosage', label: 'Dosage', input: 'text', placeholder: "e.g. 500mg" },
    { name: 'time', label: 'Time', input: 'text', placeholder: "e.g. 8:00 AM" },
    { name: 'startDate', label: 'Start Date', input: 'date' },
    { name: 'endDate', label: 'End Date', input: 'date' },
  ];

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [query, setQuery] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/medicines');
      setItems(res.data);
      setError('');
    } catch (err) {
      setError('Could not load data. Make sure the backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (data) => {
    let payload = { ...data };
    const res = await api.post('/medicines', payload);
    setItems((prev) => [res.data, ...prev]);
  };

  const handleUpdate = async (id, data) => {
    let payload = { ...data };
    const res = await api.put(`/medicines/${id}`, payload);
    setItems((prev) => prev.map((it) => (it._id === id ? res.data : it)));
    setEditingItem(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medicine?')) return;
    await api.delete(`/medicines/${id}`);
    setItems((prev) => prev.filter((it) => it._id !== id));
  };

  const visibleItems = useMemo(() => {
    let result = items;
    if (query.trim()) result = result.filter((it) => (it.medicineName || '').toString().toLowerCase().includes(query.toLowerCase()));
    return result;
  }, [items, query]);

  return (
    <div className="app-shell">
      <Header icon="💊" title="Medicine Reminder" subtitle="Keep track of your daily medicine schedule" />

      <div className="card">
        <div className="card-title">➕ Add Medicine</div>
        <ItemForm fields={FIELDS} onSubmit={handleAdd} submitLabel="Add Medicine" />
      </div>

      <div className="card">
        <div className="card-title">📋 Medicines <span className="badge">{items.length}</span></div>
        <div className="toolbar">
          <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-msg">{error}</div>}
        {!loading && !error && (
          <ItemList
            items={visibleItems}
            primaryField="medicineName"
            metaFields={[
{ name: 'dosage', label: 'Dosage' },
{ name: 'time', label: 'Time' },
{ name: 'startDate', label: 'Start' },
{ name: 'endDate', label: 'End' },
  ]}
            onEdit={setEditingItem}
            onDelete={handleDelete}
            emptyIcon="💊"
          />
        )}
      </div>

      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Medicine</h3>
              <button className="close-x" onClick={() => setEditingItem(null)}>✕</button>
            </div>
            <ItemForm
              fields={FIELDS}
              initialData={editingItem}
              submitLabel="Save Changes"
              onSubmit={(data) => handleUpdate(editingItem._id, data)}
            />
          </div>
        </div>
      )}

      <p className="footer-note">Built with the MERN stack · React + Express + MongoDB</p>
    </div>
  );
}

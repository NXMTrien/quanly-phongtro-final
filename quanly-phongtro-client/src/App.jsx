import { useEffect, useState } from 'react';
import { api } from './api';
import RoomForm from './components/RoomForm';
import RoomList from './components/RoomList';

const currency = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = async (q = '') => {
    setLoading(true);
    setError('');
    try {
      setRooms(await api.list(q));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      if (editing) {
        await api.update(editing._id, formData);
      } else {
        await api.create(formData);
      }
      setEditing(null);
      await load(search);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (room) => {
    if (!window.confirm(`Xóa phòng ${room.roomNumber}?`)) return;
    try {
      await api.remove(room._id);
      if (editing && editing._id === room._id) setEditing(null);
      await load(search);
    } catch (e) {
      setError(e.message);
    }
  };

  const totalMonthlyRent = rooms.reduce((sum, room) => sum + Number(room.monthlyRent || 0), 0);

  return (
    <div className="app">
      <header>
        <h1>🏠 Quản lý phòng trọ / căn hộ</h1>
        <p className="subtitle">Phòng, khách thuê, hoá đơn điện nước hằng tháng 1212</p>
      </header>

      {error && <div className="alert">{error}</div>}

      <div className="summary-row">
        <div className="summary-card">
          <span>Số phòng</span>
          <strong>{rooms.length}</strong>
        </div>
        <div className="summary-card">
          <span>Tổng tiền nhà / tháng</span>
          <strong>{currency(totalMonthlyRent)}</strong>
        </div>
      </div>

      <div className="layout">
        <aside>
          <RoomForm
            editing={editing}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitting={submitting}
          />
        </aside>

        <main>
          <div className="toolbar">
            <input
              className="search"
              placeholder="🔍 Tìm theo phòng, khách thuê, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="count">{rooms.length} phòng</span>
          </div>

          {loading ? (
            <p className="empty">Đang tải...</p>
          ) : (
            <RoomList rooms={rooms} onEdit={setEditing} onDelete={handleDelete} />
          )}
        </main>
      </div>
    </div>
  );
}

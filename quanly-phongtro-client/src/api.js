// API host. Empty in dev -> requests go through the Vite proxy (relative /api).
// In production set VITE_API_URL=https://server-shop-web.trongpham.vn
const API_HOST = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const BASE = `${API_HOST}/api/rooms`;

// Build absolute URL for an uploaded image path (/uploads/xxx)
export const imageUrl = (path) => (path ? `${API_HOST}${path}` : '');

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Có lỗi xảy ra');
  return data;
}

export const api = {
  list: (search = '') =>
    fetch(`${BASE}${search ? `?search=${encodeURIComponent(search)}` : ''}`).then(handle),

  create: (formData) =>
    fetch(BASE, { method: 'POST', body: formData }).then(handle),

  update: (id, formData) =>
    fetch(`${BASE}/${id}`, { method: 'PUT', body: formData }).then(handle),

  remove: (id) =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(handle),
};

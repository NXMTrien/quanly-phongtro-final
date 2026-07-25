import { useEffect, useRef, useState } from 'react';

const emptyRoom = {
  roomNumber: '',
  roomType: 'Phòng trọ',
  monthlyRent: '',
  status: 'Trống',
  tenantName: '',
  tenantPhone: '',
  electricityUsage: '',
  waterUsage: '',
  note: '',
};

export default function RoomForm({ editing, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(emptyRoom);
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setForm({
        roomNumber: editing.roomNumber || '',
        roomType: editing.roomType || 'Phòng trọ',
        monthlyRent: editing.monthlyRent ?? '',
        status: editing.status || 'Trống',
        tenantName: editing.tenantName || '',
        tenantPhone: editing.tenantPhone || '',
        electricityUsage: editing.electricityUsage ?? '',
        waterUsage: editing.waterUsage ?? '',
        note: editing.note || '',
      });
      setPreview(editing.image || '');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } else {
      setForm(emptyRoom);
      setPreview('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [editing]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pickFile = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('roomNumber', form.roomNumber);
    fd.append('roomType', form.roomType);
    fd.append('monthlyRent', form.monthlyRent || 0);
    fd.append('status', form.status);
    fd.append('tenantName', form.tenantName);
    fd.append('tenantPhone', form.tenantPhone);
    fd.append('electricityUsage', form.electricityUsage || 0);
    fd.append('waterUsage', form.waterUsage || 0);
    fd.append('note', form.note);
    if (file) fd.append('image', file);
    onSubmit(fd);
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>{editing ? '✏️ Sửa thông tin phòng' : '➕ Thêm phòng mới'}</h2>

      <label>Số phòng *</label>
      <input name="roomNumber" value={form.roomNumber} onChange={change} required placeholder="VD: P101" />

      <div className="row">
        <div>
          <label>Loại phòng *</label>
          <select name="roomType" value={form.roomType} onChange={change}>
            <option value="Phòng trọ">Phòng trọ</option>
            <option value="Căn hộ">Căn hộ</option>
          </select>
        </div>
        <div>
          <label>Trạng thái</label>
          <select name="status" value={form.status} onChange={change}>
            <option value="Trống">Trống</option>
            <option value="Đã thuê">Đã thuê</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div>
          <label>Tiền nhà / tháng *</label>
          <input name="monthlyRent" type="number" min="0" value={form.monthlyRent} onChange={change} required />
        </div>
        <div>
          <label>Khách thuê</label>
          <input name="tenantName" value={form.tenantName} onChange={change} placeholder="Tên khách thuê" />
        </div>
      </div>

      <div className="row">
        <div>
          <label>Số điện thoại</label>
          <input name="tenantPhone" value={form.tenantPhone} onChange={change} placeholder="0988..." />
        </div>
        <div>
          <label>Ghi chú</label>
          <input name="note" value={form.note} onChange={change} placeholder="Lưu ý thuê phòng" />
        </div>
      </div>

      <div className="row">
        <div>
          <label>Điện (kWh)</label>
          <input name="electricityUsage" type="number" min="0" value={form.electricityUsage} onChange={change} />
        </div>
        <div>
          <label>Nước (người)</label>
          <input name="waterUsage" type="number" min="0" value={form.waterUsage} onChange={change} />
        </div>
      </div>

      <label>Hình ảnh phòng</label>
      <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} />
      {preview && <img className="preview" src={preview} alt="preview" />}

      <div className="actions">
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {editing && (
          <button type="button" className="btn" onClick={onCancel}>
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

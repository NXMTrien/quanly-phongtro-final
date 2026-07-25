import { imageUrl } from '../api';

const formatVND = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';
const getMonthlyBill = (room) => {
  const electricityCharge = Number(room.electricityUsage || 0) * 3500;
  const waterCharge = Number(room.waterUsage || 0) * 15000;
  return Number(room.monthlyRent || 0) + electricityCharge + waterCharge;
};

export default function RoomList({ rooms, onEdit, onDelete }) {
  if (!rooms.length) {
    return <p className="empty">Chưa có phòng nào.</p>;
  }

  return (
    <div className="grid">
      {rooms.map((room) => (
        <div className="card room" key={room._id}>
          <div className="thumb">
            {room.image ? (
              <img src={imageUrl(room.image)} alt={room.roomNumber} />
            ) : (
              <div className="no-img">Không có ảnh</div>
            )}
          </div>
          <div className="room-body">
            <div className="title-row">
              <h3>{room.roomNumber}</h3>
              <span className={`badge ${room.status === 'Đã thuê' ? 'occupied' : 'empty'}`}>{room.status}</span>
            </div>
            <p className="desc">{room.roomType}</p>
            <p className="tenant">Khách thuê: {room.tenantName || 'Chưa có'}</p>
            <p className="tenant">SĐT: {room.tenantPhone || '—'}</p>
            <div className="meta">
              <span className="price">Tiền nhà: {formatVND(room.monthlyRent)}</span>
              <span className="stock">HĐ tháng: {formatVND(getMonthlyBill(room))}</span>
            </div>
            <div className="meta small">
              <span>Điện: {room.electricityUsage || 0} kWh</span>
              <span>Nước: {room.waterUsage || 0} người</span>
            </div>
            {room.note && <p className="desc">{room.note}</p>}
            <div className="actions">
              <button className="btn small" onClick={() => onEdit(room)}>Sửa</button>
              <button className="btn small danger" onClick={() => onDelete(room)}>Xóa</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

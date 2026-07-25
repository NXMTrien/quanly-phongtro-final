require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');

const roomRoutes = require('./src/routes/roomRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rental_manager';

const allowedOrigins = (process.env.CLIENT_URL || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Cho phép request không có origin (curl, mobile app) hoặc khi cấu hình '*'
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      cb(new Error(`CORS: origin ${origin} không được phép`));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', module: 'rental-manager' }));
app.use('/api/rooms', roomRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Route không tồn tại' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Lỗi upload: ${err.message}` });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  res.status(500).json({ message: err.message || 'Lỗi máy chủ' });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Đã kết nối MongoDB:', MONGODB_URI);
    app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Không kết nối được MongoDB:', err.message);
    process.exit(1);
  });

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, trim: true },
    roomType: {
      type: String,
      required: true,
      enum: ['Phòng trọ', 'Căn hộ'],
      default: 'Phòng trọ',
    },
    monthlyRent: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ['Trống', 'Đã thuê'],
      default: 'Trống',
    },
    tenantName: { type: String, default: '', trim: true },
    tenantPhone: { type: String, default: '', trim: true },
    electricityUsage: { type: Number, default: 0, min: 0 },
    waterUsage: { type: Number, default: 0, min: 0 },
    note: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);

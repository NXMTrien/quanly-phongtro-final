const fs = require('fs');
const path = require('path');
const Room = require('../models/Room');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');

function removeImageFile(imagePath) {
  if (!imagePath) return;
  const filename = path.basename(imagePath);
  const filePath = path.join(uploadDir, filename);
  fs.promises.unlink(filePath).catch(() => {});
}

exports.getRooms = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = search
      ? {
          $or: [
            { roomNumber: { $regex: search, $options: 'i' } },
            { roomType: { $regex: search, $options: 'i' } },
            { tenantName: { $regex: search, $options: 'i' } },
            { tenantPhone: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    const rooms = await Room.find(filter).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const {
      roomNumber,
      roomType,
      monthlyRent,
      status,
      tenantName,
      tenantPhone,
      electricityUsage,
      waterUsage,
      note,
    } = req.body;

    const room = await Room.create({
      roomNumber,
      roomType,
      monthlyRent,
      status,
      tenantName,
      tenantPhone,
      electricityUsage,
      waterUsage,
      note,
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });
    res.status(201).json(room);
  } catch (err) {
    if (req.file) removeImageFile(`/uploads/${req.file.filename}`);
    next(err);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      if (req.file) removeImageFile(`/uploads/${req.file.filename}`);
      return res.status(404).json({ message: 'Không tìm thấy phòng' });
    }

    const {
      roomNumber,
      roomType,
      monthlyRent,
      status,
      tenantName,
      tenantPhone,
      electricityUsage,
      waterUsage,
      note,
    } = req.body;

    if (roomNumber !== undefined) room.roomNumber = roomNumber;
    if (roomType !== undefined) room.roomType = roomType;
    if (monthlyRent !== undefined) room.monthlyRent = monthlyRent;
    if (status !== undefined) room.status = status;
    if (tenantName !== undefined) room.tenantName = tenantName;
    if (tenantPhone !== undefined) room.tenantPhone = tenantPhone;
    if (electricityUsage !== undefined) room.electricityUsage = electricityUsage;
    if (waterUsage !== undefined) room.waterUsage = waterUsage;
    if (note !== undefined) room.note = note;

    if (req.file) {
      const oldImage = room.image;
      room.image = `/uploads/${req.file.filename}`;
      removeImageFile(oldImage);
    }

    await room.save();
    res.json(room);
  } catch (err) {
    if (req.file) removeImageFile(`/uploads/${req.file.filename}`);
    next(err);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    removeImageFile(room.image);
    res.json({ message: 'Đã xóa phòng', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

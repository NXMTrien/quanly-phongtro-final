const express = require('express');
const { upload } = require('../middleware/upload');
const ctrl = require('../controllers/roomController');

const router = express.Router();

router.get('/', ctrl.getRooms);
router.get('/:id', ctrl.getRoom);
router.post('/', upload.single('image'), ctrl.createRoom);
router.put('/:id', upload.single('image'), ctrl.updateRoom);
router.delete('/:id', ctrl.deleteRoom);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getUserById,createUser,updateUser,deleteUser } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

router.delete('/user/:id', authenticateToken, deleteUser);
router.put('/user/:id', authenticateToken, updateUser);
router.get('/user/:id', getUserById);
router.post('/user', createUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const { generateToken } = require('../controllers/authController');

router.post('/user/token', generateToken);

module.exports = router;

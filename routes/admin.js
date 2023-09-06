const express = require('express');
const router = express.Router();
const controller = require('../controller/admin');

router.get('/chat', controller.chat);

module.exports = router;
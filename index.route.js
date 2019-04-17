const express = require('express');
const authRoutes = require('./server/auth/auth.route');
const chatRoutes = require('./server/chat/chat.route');

const router = express.Router(); // eslint-disable-line new-cap

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount chat routes at /chat
router.use('/chat', chatRoutes);

module.exports = router;

const express = require('express');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
const chatRoutes = require('./server/chat/chat.route');

const router = express.Router(); // eslint-disable-line new-cap

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount chat routes at /chat
router.use('/chat', chatRoutes);

module.exports = router;

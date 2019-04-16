const express = require('express');
const chatCtrl = require('./chat.controller');
const authCheck = require('../helpers/auth.middleware');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    /** GET /api/chat - Get chat history */
    .get(authCheck, chatCtrl.getChatHistory)
    /** POST /api/chat - Send new message */
    .post(authCheck, chatCtrl.sendMessage);

module.exports = router;
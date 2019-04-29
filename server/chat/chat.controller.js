const Chat = require('../models/chat.model');
const socketApi = require('../socket/socket');

/**
 * Get chat history
 */
function getChatHistory(req, res, next) {
	Chat.find({ user: req.user._id })
		.populate('user', 'name')
		.then(chats => {
			res.json(chats)
		})
		.catch(e => next(e));
}

/**
 * Send new message
 */
function sendMessage(req, res, next) {
	const chat = new Chat({
		user: req.user._id,
		message: req.body.message,
		isReceived: false
	});
	var messageId;
	chat.save()
		.then(newChat => {
			messageId = newChat._id;
			res.json('New message received');
			const serverReply = new Chat({
				user: newChat.user,
				message: 'Your last message received successfully at ' + newChat.createdAt + '.',
				isReceived: true
			})
			return serverReply.save()
		})
		.then(savedServerReply => {
			Chat.checkLastMessage(savedServerReply.user, messageId);
			// Send server reply to user via socket
			socketApi.emitMessage(savedServerReply);
		})
		.catch(e => next(e));
}

module.exports = { getChatHistory, sendMessage };

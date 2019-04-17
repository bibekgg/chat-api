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
	var message;
	chat.save()
		.then(newChat => {
			message = newChat.message;
			res.json('New message received');
			const serverReply = new Chat({
				user: newChat.user,
				message: 'Your last message received successfully at ' + newChat.createdAt + '.',
				isReceived: true
			})
			return serverReply.save()
		})
		.then(savedServerReply => {
			// Send server reply to user via socket
			socketApi.emitMessage(savedServerReply);
			Chat.checkLastMessage(savedServerReply.user, message);
		})
		.catch(e => next(e));
}

module.exports = { getChatHistory, sendMessage };

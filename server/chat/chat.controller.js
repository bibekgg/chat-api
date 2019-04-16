const Chat = require('../models/chat.model');

/**
 * Get chat history
 */
function getChatHistory(req, res, next) {
	Chat.find({ user: req.user._id })
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

	chat.save()
		.then(newChat => {
			res.json('New message received');
			const serverReply = new Chat({
				user: newChat.user,
				message: 'Your last message received successfully at ' + newChat.createdAt + '.',
				isReceived: true
			})
			serverReply.save()
				.then(savedServerReply => {
					console.log(savedServerReply)
				})
		})
		.catch(e => next(e));
}

module.exports = { getChatHistory, sendMessage };

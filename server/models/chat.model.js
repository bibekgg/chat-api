const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sendgrid = require('../../config/sendgrid');
const User = require('./user.model');
const socketApi = require('../socket/socket');

/**
 * Chat Schema
 */
const ChatSchema = new mongoose.Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	message: String,
	isReceived: {
		type: Boolean,
		default: false
	}
}, {
		timestamps: true
	});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
ChatSchema.method({
});

/**
 * Statics
 */
ChatSchema.statics = {

	/**
	 * Check last message was send within last 2 min
	 * @param {string} user _id of user
	 * @param {string} message User's last message
	 */
	checkLastMessage(user, messageId) {
		let timer = setTimeout(() => {
			this.findOne({ user: user, isReceived: false })
				.sort({ createdAt: -1 })
				.then(lastMsg => {
					if (lastMsg && lastMsg._id.toString() == messageId.toString()) {
						this.sendMail(user, lastMsg.message);
					}
				})
			clearTimeout(timer);
		}, 1000 * 30)
	},

	/**
	 * Send email to user for new message
	 * @param {string} userId _id of user
	 * @param {string} message User's last message
	 */
	sendMail(userId, message) {
		console.log('Email sent', message, new Date());
		const serverReply = {
			user: userId,
			message: 'Since you were idle for 30 sec, we have sent you an email. Please check your inbox.',
			isReceived: true
		};
		socketApi.emitMessage(serverReply);
		
		// User.get(userId)
		// 	.then(user => {
		// 		let emailData = {
		// 			from: 'Chat Application<chat@chatapplication.com>',
		// 			to: user.email,
		// 			subject: 'New Message',
		// 			html: 'Your last message was: ' + message
		// 		}
		// 		return sendgrid.send(emailData);
		// 	})
		// 	.then(response => console.log("Email successfully sent"))
		// 	.catch(e => console.error(e));
	}
};

/**
 * @typedef Chat
 */
module.exports = mongoose.model('Chat', ChatSchema);

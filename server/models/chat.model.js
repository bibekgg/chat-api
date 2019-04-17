const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sendgrid = require('../../config/sendgrid');
const User = require('./user.model');

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
	checkLastMessage(user, message) {
		this.find({ user: user, isReceived: true })
			.sort({ createdAt: -1 })
			.limit(2)
			.then(lastServerMsgs => {
				if (lastServerMsgs && lastServerMsgs.length == 2) {
					let difference = new Date(lastServerMsgs[0].createdAt).getTime() - new Date(lastServerMsgs[1].createdAt).getTime();
					// if the minute difference is more than 2min send email
					if (difference / 1000 > 120) {
						this.sendMail(user, message);
					}
				}
			})
	},

	/**
	 * Send email to user for new message
	 * @param {string} userId _id of user
	 * @param {string} message User's last message
	 */
	sendMail(userId, message) {
		User.get(userId)
			.then(user => {
				let emailData = {
					from: 'Chat Application<chat@chatapplication.com>',
					to: user.email,
					subject: 'New Message',
					html: 'Your last message was: ' + message
				}
				return sendgrid.send(emailData);
			})
			.then(response => console.log("Email successfully sent"))
			.catch(e => console.error(e));
	}
};

/**
 * @typedef Chat
 */
module.exports = mongoose.model('Chat', ChatSchema);

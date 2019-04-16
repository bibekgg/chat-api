const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
};

/**
 * @typedef Chat
 */
module.exports = mongoose.model('Chat', ChatSchema);

const User = require('../models/user.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
	User.get(id)
		.then((user) => {
			req.myUser = user; // eslint-disable-line no-param-reassign
			return next();
		})
		.catch(e => next(e));
}

module.exports = { load };

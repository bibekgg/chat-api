const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const User = require('../models/user.model');
const passwordHash = require('password-hash');

/**
 * Returns jwt token and user data if valid username and password is provided
 */
function login(req, res, next) {
	User.findOne({
		email: req.body.email
	})
		.select('+password')
		.then((user) => {
			if (!user) {
				const err = new APIError('Authentication Failed. User could not be found', httpStatus.UNAUTHORIZED, true);
				return Promise.reject(err);
			};

			if (!passwordHash.verify(req.body.password, user.password)) {
				const err = new APIError('Authentication Failed. Invalid password', httpStatus.UNAUTHORIZED, true);
				return Promise.reject(err);
			};

			const token = jwt.sign({
				_id: user._id,
				email: user.email,
				name: user.name,
			}, config.jwtSecret);

			res.json({ token, user: user });
		})
		.catch(e => next(e));
}

/**
 * Register new user.
 */
function signup(req, res, next) {
	if (req.body.confirmPassword != req.body.password) {
		let err = new APIError('Password and confirmed password not matched', httpStatus.INTERNAL_SERVER_ERROR, true);
		return next(err);
	}
	let user = new User({
		email: req.body.email,
		name: req.body.name,
		password: passwordHash.generate(req.body.password),
	});
	user.save()
		.then(savedUser => {
			res.json('Sucessfully registered');
		})
		.catch(e => {
			if (e.errmsg && e.errmsg.indexOf('duplicate key error') != -1) {
				e = new APIError('Email already registerd', httpStatus.INTERNAL_SERVER_ERROR, true);
			}
			return next(e);
		});
}

module.exports = { login, signup };

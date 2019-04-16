const Joi = require('joi');

module.exports = {
   // POST /api/auth/login
  login: {
    body: {
			email: Joi.string().regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i).required(),
      password: Joi.string().required()
    }
  },

  // POST /api/auth/signup
	signup: {
		body: {
			name: Joi.string().required(),
			email: Joi.string().regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i).required(),
      password: Joi.string().required(),
			confirmPassword: Joi.string().required(),      
		}
	},
};

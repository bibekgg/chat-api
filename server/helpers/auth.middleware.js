const expressJwt = require('express-jwt');
const config = require('../../config/config');

const authCheck = expressJwt({ secret: config.jwtSecret });

// Returns configured expressJwt token.
module.exports = authCheck;
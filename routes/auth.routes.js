const { verifySignUp } = require('../middleware');
const auth = require('../controllers').auth;
const token = require('../controllers').token;

module.exports = function (app) {
	app.post('/api/auth/register', [verifySignUp.checkDuplicateEmail, verifySignUp.checkPassword], auth.register);
	app.post('/api/auth/login', auth.login);
	app.get('/api/auth/logout', auth.logout);
	app.post('/api/auth/changePassword', auth.changePassword);
	app.post('/api/auth/verifyToken', token.methods().verifyTokenChangePassword);
};

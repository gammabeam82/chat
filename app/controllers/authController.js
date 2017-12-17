const AuthService = require('../service/authService');

const authController = {
  getRegisterForm: (req, res) => res.render('auth/register'),
  getLoginForm: (req, res) => res.render('auth/login'),
  register: (req, res) => AuthService.register(req, res),
  login: (req, res) => AuthService.login(req, res),
  logout: (req, res) => {
    req.logout();
    res.redirect('/');
  }
};

module.exports = authController;

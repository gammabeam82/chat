const passport = require("passport");
const User = require("../models/user");

const options = {
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: 'Welcome!'
};

const AuthService = {
  register: (req, res) => {
    if (req.body.password !== req.body.rpassword) {
      req.flash('error', 'Passwords not equal.');
      return res.render('auth/register', {});
    }
    User.register(new User({
      username: req.body.username,
      name: req.body.name
    }), req.body.password, (err, user) => {
      if (err) {
        req.flash('error', err.message);
        return res.render('auth/register', {});
      }
      passport.authenticate('local')(req, res, () => res.redirect('/'));
    });
  },
  login: (req, res) => passport.authenticate('local', options)(req, res, () => res.redirect('/'))
};

module.exports = AuthService;

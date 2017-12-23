const checkUser = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    req.flash('error', 'Allowed authenticated users only.');
    return res.redirect('/login');
  }
};

module.exports = checkUser;

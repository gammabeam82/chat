const IndexController = {
  getIndex: (req, res, next) => {
    res.render('index/index', {
      user: req.user
    });
  }
};

module.exports = IndexController;

const IndexController = {
  getIndex: (req, res, next) => {
    res.render('index/index', {});
  }
};

module.exports = IndexController;

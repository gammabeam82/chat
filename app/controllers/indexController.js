const IndexController = {
  getIndex: (req, res) => {
    res.render('index/index', {});
  }
};

module.exports = IndexController;

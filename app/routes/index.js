const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/indexController');

router.get('/', IndexController.getIndex);

module.exports = router;

var express = require('express');

var router = express.Router();


router.get('/list', (req, res)=>res.render('index/index', {
  appName: 'company', nav: 'company', type: 'company'
}));


module.exports = router;
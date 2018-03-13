var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('Index', {
    appName: 'IndexMain', nav: 'index'
  })
});


module.exports = router;
var express = require('express');

var router = express.Router();

router.get('/', (req, res)=>res.render('login/index', {
  appName: 'login', type: 'login', nav: 'login'
}));

router.get('/register', (req, res)=>res.render('login/index', {
  appName: 'login', type: 'register', nav: 'register'
}));

router.get('/register/success', (req, res)=>res.render('login/index', {
  appName: 'login', type: 'register-success', nav: 'register-success', companyNo: req.query.companyNo || ''
}));

router.get('/password', (req, res)=>res.render('login/index', {
  appName: 'login', type: 'password', nav: 'password'
}));

router.get('/reset', (req, res)=>res.render('login/index', {
  appName: 'login', type: 'reset', nav: 'reset', mobile: req.query.mobile || "", authCode: req.query.authCode
}));
module.exports = router;
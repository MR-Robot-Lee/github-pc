var express = require('express');

var router = express.Router();

router.get('/attention', (req, res) => res.render('localeManager/index', {
  appName: 'locale', nav: 'locale-attention', type: 'locale-attention'
}));


router.get('/', (req, res) => {
    res.render('localeManager/index', {
    appName: 'locale', nav: 'locale-all', type: 'locale-all', time: req.query.time || "", navType: ''
  })
});
router.get('/manager', (req, res) => {
    res.render('localeManager/index', {
    appName: 'locale', nav: 'locale-manager', type: 'locale-manager', time: req.query.time || "", navType: ''
  })
});
router.get('/schedule', (req, res) => res.render('localeManager/index', {
  appName: 'locale', nav: 'locale-schedule', type: 'locale-schedule', time: req.query.time || "", navType: ''
}));

router.get('/manager/detail', (req, res) => res.render('localeManager/index', {
  appName: 'locale', nav: 'locale-detail', type: 'locale-detail', id: req.query.id || "",
  navType: req.query.type || '', time: req.query.time || "", navLocal: req.query.nav
}));

module.exports = router;
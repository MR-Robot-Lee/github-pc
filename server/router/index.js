var express = require('express');
var request = require('request');
var router = express.Router();

var projectManager = require('./projectManager');
var constructReport = require('./constructReport');
var employee = require('./employee');
var contract = require('./contract');
var enterpriseLibrary = require('./enterpriseLibrary');
var knowledge = require('./knowledge');
var dashbord = require('./dashbord');
var fileCabinet = require('./fileCabinet');
var communique = require('./communique');
var approval = require('./approval');
var upload = require('./upload');
var system = require('./system');
var main = require('./main');
var localeManager = require('./localeManager');
var login = require('./login');
var company = require('./company');
var bids = require('./bids');
router.use('/index', main);
router.use('/login', login);
router.use('/company', company);
router.use('/dashbord', dashbord);
router.use('/project', projectManager);
router.use('/report', constructReport);
router.use('/employee', employee);
router.use('/document', fileCabinet);
router.use('/contract', contract);
router.use('/enterprise', enterpriseLibrary);
router.use('/knowledge', knowledge);
router.use('/communique', communique);
router.use('/approval', approval);
router.use('/upload', upload);
router.use('/system', system);
router.use('/bids', bids);
router.use('/locale', localeManager);
router.use('/', (req, res) => {
  res.redirect('/index')
});
router.all('/api/*', function (req, res) {
  req.pipe(request(req.url.replace('/api', 'https://gc.azhu.co'))).pipe(res);
});
router.get('*', (req, res) => res.render('NotFound', {
  appName: 'NotFound', nav: 'NotFound'
}));

module.exports = router;

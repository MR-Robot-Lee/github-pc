var express = require('express');

var router = express.Router();

router.get('/', (req, res) => res.render('employee/index', {
  appName: 'employee', nav: 'all'
}));
router.get('/setting', (req, res)=>res.render('employee/setting', {
  appName: 'employee', nav: 'setting'
}));
router.get('/state', (req, res)=>res.render('employee/employeeState', {
  appName: 'employee', nav: 'all'
}));
router.get('/modal', (req, res)=>res.render('systemSetting/organization/modal/importEmployee', {
  appName: 'employee', nav: 'setting'
}));
router.get('/:proDepNo/:proNo', (req, res)=>res.render('employee/projectDetail', {
  appName: 'employee', nav: 'detail', proNo: req.params.proNo, proDepNo: req.params.proDepNo
}));
router.get('/test', (req, res)=> {
  res.render('Test')
});

module.exports = router;
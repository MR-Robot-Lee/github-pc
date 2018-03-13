var express = require('express');
var router = express.Router();

router.get('/', (req, res)=>res.render('systemSetting/companySetting/index', {
  appName: 'system', type: 'system-index', nav: 'system-index'
}));

router.get('/contact', (req, res)=>res.render('systemSetting/companySetting/index', {
  appName: 'system', type: 'contact', nav: 'contact'
}));

router.get('/billboard', (req, res)=>res.render('systemSetting/companySetting/index', {
  appName: 'system', type: 'billboard', nav: 'billboard'
}));

router.get('/organization', (req, res)=>res.render('systemSetting/organization/index', {
  appName: 'system', type: 'organization-index', nav: 'organization-index'
}));

router.get('/role', (req, res)=>res.render('systemSetting/role/index', {
  appName: 'system', type: 'role-index', nav: 'role-index'
}));

router.get('/role/add', (req, res)=>res.render('systemSetting/role/index', {
  appName: 'system', type: 'role-add', nav: 'role-add', posId: req.query.posId || ""
}));

router.get('/role/department', (req, res)=>res.render('systemSetting/role/index', {
  appName: 'system', type: 'role-department', nav: 'role-department'
}));

router.get('/account/info', (req, res)=>res.render('systemSetting/accountManager/index', {
  appName: 'system', type: 'account-info', nav: 'account-info'
}));

router.get('/account/manager', (req, res)=>res.render('systemSetting/accountManager/index', {
  appName: 'system', type: 'account-manager', nav: 'account-manager'
}));
module.exports = router;
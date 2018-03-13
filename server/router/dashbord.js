const express = require('express');
const router = express.Router();


router.get('/', (req, res) => res.render('dashbord/Index', {
  appName: 'DashbordIndex', nav: 'dashbord-index', type: 'dashbord-index'
}));
/**
 * 提醒
 */
router.get('/remind', (req, res) => res.render('dashbord/Index', {
  appName: 'DashbordIndex', nav: 'dashbord-remind', type: 'dashbord-remind'
}));
/**
 * 个人设置
 */
router.get('/setting', (req, res) => res.render('dashbord/Index', {
  appName: 'DashbordIndex', nav: 'dashbord-setting', type: 'dashbord-setting'
}));

router.get('/organization', (req, res) => res.render('dashbord/Index', {
  appName: 'DashbordIndex', nav: 'dashbord-organization', type: 'dashbord-organization'
}));

router.get('/financial', (req, res) => res.render('dashbord/Index', {
  appName: 'DashbordIndex', nav: 'dashbord-financial', type: 'dashbord-financial'
}));

router.get('/calendar', (req, res)=>res.render('dashbord/Index', {
  appName: 'DashbordIndex', nav: 'dashbord-calendar', type: 'dashbord-calendar'
}));
module.exports = router;
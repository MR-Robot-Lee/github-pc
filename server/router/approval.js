var express = require('express');

var router = express.Router();

/**
 * 我的申请
 */
router.get('/', (req, res)=>res.render('approvalManager/index', {
  appName: 'approval', nav: 'approval-apply', type: 'approval-apply'
}));
/**
 * 添加申请
 */
router.get('/add', (req, res)=>res.render('approvalManager/index', {
  appName: 'approval', nav: 'approval-add', type: 'approval-add'
}));

/**
 * 我的审批
 */
router.get('/me/approval', (req, res)=>res.render('approvalManager/index', {
  appName: 'approval', nav: 'approval-me', type: 'approval-me'
}));
/**
 * 抄送给我的
 */
router.get('/me/copy', (req, res)=>res.render('approvalManager/index', {
  appName: 'approval', nav: 'approval-copy', type: 'approval-copy'
}));
/**
 * 审批管理
 */
router.get('/manager', (req, res)=>res.render('approvalManager/index', {
  appName: 'approval', nav: 'approval-manager', type: 'approval-manager'
}));
/**
 * 审批管理详情
 */
router.get('/manager/detail', (req, res)=>res.render('approvalManager/index', {
  appName: 'approval', nav: 'approval-manager-detail', type: 'approval-manager-detail',
  id: req.query.id, tmplId: req.query.tmplId
}));
/**
 * 流程设置
 */
router.get('/setting', (req, res)=>res.render('approvalManager/index', {
  appName: 'approval', nav: 'approval-setting', type: 'approval-setting'
}));

router.get('/setting/type', (req, res)=>res.render('approvalManager/index', {
  appName: 'approval', nav: 'approval-type', type: 'approval-type'
}));

router.get('/setting/add', (req, res)=>res.render('approvalManager/index', {
  appName: 'approval', nav: 'approval-setting-add', type: 'approval-setting-add', id: req.query.id || ''
}));

module.exports = router;

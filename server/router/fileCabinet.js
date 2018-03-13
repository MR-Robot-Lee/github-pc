var express = require('express');
var router = express.Router();

/**
 * 企业库文件柜
 */
router.get('/', (req, res) => res.render('documentManager/index', {
  appName: 'document', nav: 'document-company', type: 'document-company', NavName: '企业文件柜'
}));
/**
 * 新建文件柜
 */
router.get('/add', (req, res) => res.render('documentManager/index', {
  appName: 'document', nav: 'document-add', type: 'document-add'
}));
/**
 * 我的文件柜
 */
router.get('/me', (req, res) => res.render('documentManager/index', {
  appName: 'document', nav: 'document-me', type: 'document-me'
}));
/**
 * 文件柜管理
 */
router.get('/manager', (req, res) => res.render('documentManager/index', {
  appName: 'document', nav: 'document-manager', type: 'document-manager'
}));

router.get('/admin', (req, res) => res.render('documentManager/index', {
  appName: 'document', nav: req.query.type, type: 'document-admin',
  id: req.query.id, name: req.query.name, NavName: req.query.navName, typeNo: req.query.typeNo
}));

/**
 * 返回上一级
 */
router.get('/callback', (req, res) => res.render('documentManager/index', {
  appName: 'document', nav: req.query.type, type: 'document-admin',
  id: req.query.id, name: req.query.name, NavName: req.query.navName, typeNo: req.query.typeNo
}));

module.exports = router;
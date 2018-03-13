var express = require('express');

var router = express.Router();


router.get('/', (req, res)=>res.render('contractManager/index', {
  appName: 'contract', nav: 'all'
}));

/**
 * 添加合同工程分包合同
 */
router.get('/add', (req, res)=>res.render('contractManager/addContractIndex', {
  appName: 'contract', nav: 'contract', type: 'add'
}));
/**
 * 材料供应合同
 */
router.get('/material', (req, res)=>res.render('contractManager/addContractIndex', {
  appName: 'contract', nav: 'contract', type: 'contract-material'
}));
/**
 * 合同分类配置
 */
router.get('/setting/classify', (req, res)=>res.render('contractManager/contractSettingIndex', {
  appName: 'contract', nav: 'classify', type: 'classify'
}));
/**
 * 合同方属性配置
 */
router.get('/setting/attr', (req, res)=>res.render('contractManager/contractSettingIndex', {
  appName: 'contract', nav: 'attr', type: 'attr'
}));

module.exports = router;
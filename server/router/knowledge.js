var express = require('express');

var router = express.Router();
/**
 * 新建知识
 */
router.get('/add', (req, res) => {
  res.render('knowledgeManager/index', {
    appName: 'knowledge', nav: 'knowledge-add', type: 'knowledge-add',
    id: req.query.id || ''
  })
});
/**
 * 知识类型
 */
router.get('/type', (req, res) => res.render('knowledgeManager/index', {
  appName: 'knowledge', nav: 'knowledge-type', type: 'knowledge-type'
}));

/**
 * 知识类型
 */
router.get('/', (req, res) => {
  if (req.query.type) {
    res.render('knowledgeManager/index', {
      appName: 'knowledge', nav: 'knowledge-detail', type: 'knowledge-detail',
      id: req.query.id || '', Type: req.query.type
    })
  } else {
    res.render('knowledgeManager/index', {
      appName: 'knowledge', nav: 'knowledge-all', type: 'knowledge-all', id: req.query.id || ''
    })
  }
});
module.exports = router;
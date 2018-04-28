var express = require('express');

var router = express.Router();
/**
 * 新建公告
 */
router.get('/add', (req, res) => {
    if (req.query.type) {
        res.render('communiqueManager/index', {
            appName: 'communique', nav: 'communique-detail', type: 'communique-detail',
            id: req.query.id, Type: req.query.type, title: '公告'
        })
    } else {
        res.render('communiqueManager/index', {
            appName: 'communique', nav: 'communique-add', type: 'communique-add',
            id: req.query.id || '', title: '公告'
        })
    }
});
/**
 * 功能设置
 */
router.get('/setting', (req, res) => res.render('communiqueManager/index', {
    appName: 'communique', nav: 'communique-setting', type: 'communique-setting', title: '公告'
}));
/**
 * 所有公告
 */
router.get('/', (req, res) => {
    if (req.query.type) {
        res.render('communiqueManager/index', {
            appName: 'communique', nav: 'communique-detail', type: 'communique-detail',
            id: req.query.id, Type: req.query.type, title: '公告'
        })
    } else {
        res.render('communiqueManager/index', {
            appName: 'communique', nav: 'communique-all', type: 'communique-all', id: req.query.id || '', title: '公告'
        })
    }
});

router.get('/detail', (req, res) => res.render('communiqueManager/index', {
    appName: 'communique', nav: 'communique-detail', type: 'communique-detail',
    id: req.query.id, Type: req.query.type, title: '公告'
}));

module.exports = router;
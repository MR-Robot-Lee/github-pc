var express = require('express');
var router = express.Router();
/**
 * 新建招标
 */
router.get('/add', (req, res) => {
    res.render('bidsPlatform/index', {
        appName: 'bids', nav: 'bids-add', type: 'bids-add',
        id: req.query.id || ''
    })
});
/**
 * 招标公告
 */
router.get('/', (req, res) => {
    res.render('bidsPlatform/index', {
        appName: 'bids', nav: 'bids-all', type: 'bids-all', id: req.query.id || ''
    })
});
/**
 * 中标公示
 */
router.get('/notice', (req, res) => res.render('bidsPlatform/index', {
    appName: 'bids', nav: 'bids-notice', type: 'bids-notice'
}));

/**
 * 设置
 */
router.get('/setting', (req, res) => res.render('bidsPlatform/index', {
    appName: 'bids', nav: 'bids-setting', type: 'bids-setting'
}));

module.exports = router;
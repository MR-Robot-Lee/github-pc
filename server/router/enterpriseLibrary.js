var express = require('express');

var router = express.Router();

/**
 * 材料库
 */
router.get('/', (req, res) => {
    var render = req.query.render;
    if (render === 'library') {
        res.render('enterpriseLibrary/index', {
            appName: 'enterprise', nav: 'library', type: 'library'
        })
    } else if (render === 'supplier') {
        res.render('enterpriseLibrary/index', {
            appName: 'enterprise', nav: 'supplier', type: 'supplier'
        })
    } else {
        res.render('enterpriseLibrary/index', {
            appName: 'enterprise', nav: 'enterprise', type: 'index'
        })
    }
});
/**
 * 材料库详情
 */
router.get('/material/detail', (req, res) => res.render('enterpriseLibrary/historyIndex', {
    appName: 'enterprise',
    nav: 'enterprise-material-index',
    type: 'enterprise-material-index',
    id: req.query.id || '',
}));
/**
 * 人工费
 */
router.get('/charge', (req, res) => res.render('enterpriseLibrary/index', {
    appName: 'enterprise', nav: 'charge', type: 'charge'
}));

/**
 * 人工费详情
 */
router.get('/charge/detail', (req, res) => res.render('enterpriseLibrary/historyIndex', {
    appName: 'enterprise', nav: 'enterprise-charge-index', type: 'enterprise-charge-index', id: req.query.id || ''
}));
/**
 * 措施费
 */
router.get('/step', (req, res) => res.render('enterpriseLibrary/index', {
    appName: 'enterprise', nav: 'step', type: 'step'
}));
/**
 * 措施费详情
 */
router.get('/step/detail', (req, res) => res.render('enterpriseLibrary/historyIndex', {
    appName: 'enterprise', nav: 'enterprise-step-index', type: 'enterprise-step-index', id: req.query.id || ''
}));
/**
 * 分包库
 */
router.get('/subpackage', (req, res) => res.render('enterpriseLibrary/index', {
    appName: 'enterprise', nav: 'subpackage', type: 'subpackage'
}));

/**
 * 分包库详情
 */
router.get('/subpackage/detail', (req, res) => res.render('enterpriseLibrary/historyIndex', {
    appName: 'enterprise', nav: 'enterprise-subpackage-index', type: 'enterprise-subpackage-index', id: req.query.id || ''
}));
/**
 * 供应商
 */
router.get('/supplier', (req, res) => res.render('enterpriseLibrary/index', {
    appName: 'enterprise', nav: 'supplier', type: 'supplier'
}));
/**
 * 供应商详情
 */
router.get('/supplier/detail', (req, res) => res.render('enterpriseLibrary/historyIndex', {
    appName: 'enterprise', nav: 'enterprise-supplier-index', type: 'enterprise-supplier-index', id: req.query.id || ''
}));
/**
 * 项目库
 */
router.get('/library', (req, res) => res.render('enterpriseLibrary/index', {
    appName: 'enterprise', nav: 'library', type: 'library'
}));
/**
 * 人力资源库
 */
router.get('/hr', (req, res) => res.render('enterpriseLibrary/index', {
    appName: 'enterprise', nav: 'hr', type: 'hr'
}));
/**
 * 人力资源库详情
 */
router.get('/hr/detail', (req, res) => res.render('enterpriseLibrary/historyIndex', {
    appName: 'enterprise', nav: 'enterprise-hr-index', type: 'enterprise-hr-index', id: req.query.id || '', workerNo: req.query.workerNo || ''
}));


/**
 * 企业标准库
 */
router.get('/standard', (req, res) => res.render('enterpriseLibrary/index', {
    appName: 'enterprise', nav: 'standard', type: 'standard'
}));

module.exports = router;
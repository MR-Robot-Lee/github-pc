var express = require('express');
var router = express.Router();


/**
 * 施工快报
 */
router.get('', (req, res) => {
  if (req.query.type) {
    res.render('constructReport/reportDetail', {
      appName: 'report', nav: 'detail', id: req.query.id
    })
  } else {
    res.render('constructReport/index', {
      appName: 'report', nav: 'report'
    })
  }
});
router.get('/add', (req, res) => {
  res.render('constructReport/addOrUpdateReport', {
    appName: 'report', nav: 'add', title: !req.query.id? '添加快报' : '修改快报', data: req.query.data,
    id: req.query.id || ""
  });
});
router.get('/detail', (req, res) => res.render('constructReport/reportDetail', {
  appName: 'report', nav: 'detail', id: req.query.id
}));
router.get('/section', (req, res) => res.render('constructReport/sectionType', {
  appName: 'report', nav: 'section'
}));
router.get('/already', (req, res) => res.render('constructReport/reported', {
  appName: 'report', nav: 'already'
}));
router.get('/unexecuted', (req, res) => res.render('constructReport/unReported', {
  appName: 'report', nav: 'unexecuted'
}));
router.get('/review', (req, res) => {
  res.render('constructReport/reportReview', {
    appName: 'report', nav: 'review', data: req.query.data, id: req.query.id || ''
  })
})
module.exports = router;
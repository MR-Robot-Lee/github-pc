var express = require('express');
var router = express.Router();
/**
 * 所有项目
 */
router.get('/', (req, res) => res.render('projectManager/projectMain/projectIndex', {
  appName: 'project', nav: 'participate', type: 'participate'
}));

/**
 * 我参与的项目
 */
router.get('/participate', (req, res) => res.render('projectManager/projectMain/projectIndex', {
  appName: 'project', nav: 'index', type: 'index'
}));

/**
 * 智能硬件
 */
router.get('/hardware', (req, res) => res.render('projectManager/projectMain/projectIndex', {
    appName: 'project', nav: 'hardware', type: 'hardware'
}));

/**
 * 我负责的项目
 */
router.get('/charged', (req, res) => res.render('projectManager/projectMain/projectIndex', {
  appName: 'project', nav: 'charged', type: 'charged'
}));

/**
 * 项目详情
 */
router.get('/detail/:id', (req, res) => res.render('projectManager/projectDetailManager/index', {
  appName: 'project', nav: 'detail', type: 'detail', id: req.params.id, name: req.query.name
}));
/**
 * 主页 安全进度管理
 */
router.get('/safe/:id', (req, res) => res.render('projectManager/projectDetailManager/index', {
  appName: 'project',
  nav: 'safe-civilize',
  type: 'safe-civilize',
  id: req.params.id,
  name: req.query.name,
  mainName: req.query.mainName
}));
/**
 * 主页设置
 */
router.get('/setting/:id', (req, res) => res.render('projectManager/projectDetailManager/index', {
  appName: 'project', nav: 'main-setting', type: 'main-setting', id: req.params.id, name: req.query.name
}));
/**
 * 设置列表
 */
router.get('/setting/list/:id', (req, res) => res.render('projectManager/projectDetailManager/index', {
  appName: 'project', nav: 'main-setting-list', type: 'main-setting-list', id: req.params.id, name: req.query.name
}));


/**
 * 进度管理
 */
router.get('/schedule/:id', (req, res) => res.render('projectManager/scheduleManager/index', {
  appName: 'project', nav: 'schedule-main', type: 'schedule', id: req.params.id, sType: 1, name: req.query.name
}));
/**
 *次进度管理
 */
router.get('/schedule/child/:id', (req, res) => res.render('projectManager/scheduleManager/index', {
  appName: 'project', nav: 'schedule-secondary', type: 'schedule', id: req.params.id, sType: 2, name: req.query.name
}));
/**
 * 异常备忘
 */
router.get('/exception/:id', (req, res) => res.render('projectManager/exceptionMemorandum/index', {
  appName: 'project', nav: 'exception', type: 'exception', id: req.params.id, name: req.query.name
}));
/**
 * 过程备忘
 */
router.get('/exception/process/:id', (req, res) => res.render('projectManager/exceptionMemorandum/index', {
  appName: 'project', nav: 'process', type: 'process', id: req.params.id, name: req.query.name
}));
/**
 * 劳动力管理
 */
router.get('/labor/:id', (req, res) => res.render('projectManager/laborManager/index', {
  appName: 'project', nav: 'labor', type: 'labor', id: req.params.id, name: req.query.name
}));
/**
 * 劳动管理 考勤管理
 */
router.get('/attendance/:id', (req, res) => res.render('projectManager/laborManager/index', {
  appName: 'project', nav: 'attendance', type: 'attendance', id: req.params.id, name: req.query.name
}));
/**
 * 劳动管理 人员管理
 */
router.get('/employee/:id', (req, res) => res.render('projectManager/laborManager/index', {
  appName: 'project', nav: 'employee', type: 'employee', id: req.params.id, name: req.query.name
}));
/**
 * 成本预算
 */
router.get('/cost/:id', (req, res) => res.render('projectManager/costBudgetManager/index', {
  appName: 'project', nav: 'cost', type: 'cost', id: req.params.id, name: req.query.name
}));
/**
 * 成本预算详情
 */
router.get('/cost/budget/:id', (req, res) => res.render('projectManager/costBudgetManager/index', {
  appName: 'project', nav: 'budget', type: 'budget', id: req.params.id, subId: req.query.subId, name: req.query.name
}));
/**
 * 工程量核算
 */
router.get('/cost/quantity/:id', (req, res) => res.render('projectManager/costBudgetManager/index', {
  appName: 'project', nav: 'quantity', type: 'quantity', id: req.params.id, subId: req.query.subId, name: req.query.name
}));
/**
 * 材料
 */
router.get('/cost/material/:id', (req, res) => res.render('projectManager/costBudgetManager/index', {
  appName: 'project', nav: 'material', type: 'material', id: req.params.id, subId: req.query.subId, name: req.query.name
}));
/**
 * 人力
 */
router.get('/cost/workerCount/:id', (req, res) => res.render('projectManager/costBudgetManager/index', {
  appName: 'project',
  nav: 'workerCount',
  type: 'workerCount',
  id: req.params.id,
  subId: req.query.subId,
  name: req.query.name
}));
/**
 * 措施费
 */
router.get('/cost/step/:id', (req, res) => res.render('projectManager/costBudgetManager/index', {
  appName: 'project', nav: 'step', type: 'step', id: req.params.id, subId: req.query.subId, name: req.query.name
}));
/**
 * 分包
 */
router.get('/cost/subpackage/:id', (req, res) => res.render('projectManager/costBudgetManager/index', {
  appName: 'project',
  nav: 'subpackage',
  type: 'subpackage',
  id: req.params.id,
  subId: req.query.subId,
  name: req.query.name
}));
/**
 * 异常项
 * 废除
 */
router.get('/cost/exception/:id', (req, res) => res.render('projectManager/costBudgetManager/index', {
  appName: 'project',
  nav: 'cost-exception',
  type: 'cost-exception',
  id: req.params.id,
  subId: req.query.subId,
  name: req.query.name
}));
/**
 * 材料管理
 */
router.get('/material/:id', (req, res) => res.render('projectManager/materialManager/index', {
  appName: 'project', nav: 'project-material', type: 'project-material', id: req.params.id, name: req.query.name
}));
/**
 * 招标计划
 */
router.get('/material/bidding/:id', (req, res) => res.render('projectManager/materialManager/index', {
  appName: 'project',
  nav: 'project-bidding-material',
  type: 'project-bidding-material',
  id: req.params.id,
  name: req.query.name
}));
/**
 * 我的任务
 */
router.get('/material/plan/:id', (req, res) => res.render('projectManager/materialManager/index', {
  appName: 'project', nav: 'material-plan', type: 'material-plan', id: req.params.id, name: req.query.name
}));
/**
 * 采购汇总
 */
router.get('/material/purchase/:id', (req, res) => res.render('projectManager/materialManager/index', {
  appName: 'project', nav: 'material-purchase', type: 'material-purchase', id: req.params.id, name: req.query.name
}));
/**
 * 可计划量
 */
router.get('/material/amount/:id', (req, res) => res.render('projectManager/materialManager/index', {
  appName: 'project', nav: 'material-amount', type: 'material-amount', id: req.params.id, name: req.query.name
}));
/**
 * 库存量
 */
router.get('/material/summary/:id', (req, res) => res.render('projectManager/materialManager/index', {
  appName: 'project', nav: 'material-summary', type: 'material-summary', id: req.params.id, name: req.query.name
}));
/**
 * 采购单
 */
router.get('/material/purchase-order/:id', (req, res) => res.render('projectManager/materialManager/index', {
  appName: 'project',
  nav: 'material-purchase-order',
  type: 'material-purchase-order',
  id: req.params.id,
  name: req.query.name
}));
/**
 * 计划单
 */
router.get('/material/plan-order/:id', (req, res) => res.render('projectManager/materialManager/index', {
  appName: 'project', nav: 'material-plan-order', type: 'material-plan-order', id: req.params.id, name: req.query.name
}));

/**
 * 点收单
 */
router.get('/material/check-order/:id', (req, res) => res.render('projectManager/materialManager/index', {
  appName: 'project', nav: 'material-check-order', type: 'material-check-order', id: req.params.id, name: req.query.name
}));
/**
 * 费用单
 */
router.get('/material/cost-order/:id', (req, res) => res.render('projectManager/materialManager/index', {
  appName: 'project', nav: 'material-cost-order', type: 'material-cost-order', id: req.params.id, name: req.query.name
}));

/**
 * 财务项目
 * 财务动态
 */
router.get('/financial/status/:id', (req, res) => res.render('projectManager/projectFinancial/index', {
  appName: 'project', nav: 'financial-status', type: 'financial-status', id: req.params.id, name: req.query.name
}));
/**
 * 费用汇总
 */
router.get('/financial/cost/:id', (req, res) => res.render('projectManager/projectFinancial/index', {
  appName: 'project', nav: 'financial-cost', type: 'financial-cost', id: req.params.id, name: req.query.name
}));
/**
 * 应付账款
 */
router.get('/financial/pay/:id', (req, res) => res.render('projectManager/projectFinancial/index', {
  appName: 'project', nav: 'financial-pay', type: 'financial-pay', id: req.params.id, name: req.query.name
}));
/**
 * 我的财务
 */
router.get('/financial/me/:id', (req, res) => res.render('projectManager/projectFinancial/index', {
  appName: 'project', nav: 'financial-me', type: 'financial-me', id: req.params.id, name: req.query.name
}));
/**
 * 成本结转报告
 */
router.get('/financial/report/:id', (req, res) => res.render('projectManager/projectFinancial/index', {
  appName: 'project', nav: 'financial-report', type: 'financial-report', id: req.params.id, name: req.query.name
}));
/**
 * 合同汇总
 */
router.get('/contract/sum/:id', (req, res) => res.render('projectManager/contractManager/index', {
  appName: 'project', nav: 'contract-sum', type: 'contract-sum', id: req.params.id, name: req.query.name
}));
/**
 * 核算资源
 */
router.get('/contract/resource/:id', (req, res) => res.render('projectManager/contractManager/index', {
  appName: 'project', nav: 'contract-resource', type: 'contract-resource', id: req.params.id, name: req.query.name
}));

/**
 * 合同详情
 */
router.get('/contract/detail/:id', (req, res) => res.render('projectManager/contractManager/index', {
  appName: 'project',
  nav: 'contract-detail',
  type: 'contract-detail',
  id: req.params.id,
  subId: req.query.subId,
  name: req.query.name,
  ctrType: req.query.type
}));
/**
 * 组织结构
 */
router.get('/organization/instrument/:id', (req, res) => res.render('projectManager/organizationManager/index', {
  appName: 'project',
  nav: 'organization-instrument',
  type: 'organization-instrument',
  id: req.params.id,
  name: req.query.name,
}));
/**
 * 任务分配
 */
router.get('/organization/task/:id', (req, res) => res.render('projectManager/organizationManager/index', {
  appName: 'project', nav: 'organization-task', type: 'organization-task', id: req.params.id, name: req.query.name
}));

/**
 * 结算
 */
router.get('/balance/index/:id', (req, res) => res.render('projectManager/balanceManager/index', {
  appName: 'project', nav: 'balance-index', type: 'balance-index', id: req.params.id, name: req.query.name
}));

/**
 * 结算资源
 */
router.get('/balance/resource/:id', (req, res) => res.render('projectManager/balanceManager/index', {
  appName: 'project', nav: 'balance-resource', type: 'balance-resource', id: req.params.id, name: req.query.name
}));
/**
 * 无合同结算
 */
router.get('/balance/contract/:id', (req, res) => res.render('projectManager/balanceManager/index', {
  appName: 'project',
  nav: 'balance-contract',
  type: 'balance-contract',
  id: req.params.id,
  cid: req.query.id || '',
  name: req.query.name,
  level: req.query.type || '',
}));

/**
 * 无合同结算 查看
 */
router.get('/balance/check/:id', (req, res) => res.render('projectManager/balanceManager/index', {
    appName: 'project',
    nav: 'balance-contract',
    type: 'balance-check',
    id: req.params.id,
    cid: req.query.id || '',
    name: req.query.name,
    level: req.query.type || '',
}));

/**
 * 项目文档
 */
router.get('/document/:id', (req, res) => res.render('projectManager/documentManager/index', {
  appName: 'project', nav: 'project-document', type: 'project-document', id: req.params.id, name: req.query.name
}));
module.exports = router;
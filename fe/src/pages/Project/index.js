var project = require('./project/index');
var Page = require('../../components/Page');
var initEvent = require('./initEvent');
var mainPage = require('./projectMainFunc');
var calendar = require('./calendar');
var scheduleManager = require('./scheduleManager/index');
var exceptionManager = require('./exceptionMemorandum/index');
var exceptionEvent = require('./exceptionMemorandum/initEvent');
var laborManager = require('./laborManager/index');
var costBudgetManager = require('./costBudgetManager/index');
var materialManager = require('./materialManager/index');
var contractManager = require('./contractManager/index');
var balanceManager = require('./balanceManager/index');
var costManager = require('./costManager/index');
var documentManager = require('./documentManager/index');
var organizationManager = require('./organizationManager/index');
var projectInitEvent = require('./initEvent');

module.exports = {
    ready: function (type) {
        var user = window.localStorage.getItem('user');
        user = user ? JSON.parse(user) : {permission: {}};
        var projAttendGet = user.permission['projAttend:get'];
        var projAttend = user.permission['projAttend:*'];
        if (projAttendGet || projAttend) {
            $('#laborNav').show();
        } else {
            $('#laborNav').hide();
        }
        costManager.renderFinancialCompetenceUrl();
        costBudgetManager.renderCostBudgetNavCompetence();
        projectInitEvent.initPrincipalAndLogo();//左上角logo
        if (type === 'index') {
            project.allProjectList();
            project.renderCompetence();
        } else if (type === 'charged') {
            project.attentionProject();
            project.renderCompetence();
        } else if (type === 'participate') {
            project.myAttentionProject();
            project.renderCompetence();
        } else if( type === 'hardware'){
            project.intelligentHardware();
            project.renderCompetence();
        } else if (type === 'detail') {
            calendar.initCalendar(function () {
                mainPage.getLogQj();
            });
            initEvent.initMainPageEvent();
            mainPage.getNotice();
            mainPage.renderCompetenceMainSetting();
        } else if (type === "main-setting") {
            initEvent.initSystemSaveBtn();
            mainPage.getSubProjectList();
            mainPage.getSystemSettingFunc();
        } else if (type === 'safe-civilize') {
            mainPage.getSafeAndQulity();
        } else if (type === 'main-setting-list') {
            mainPage.getSystemInfo();
        } else if (type === 'schedule-main') {
            scheduleManager.initSchedule();
            scheduleManager.renderScheduleCompetence();
        } else if (type === 'schedule-secondary') {
            scheduleManager.initScheduleSecondary();
            //scheduleManager.renderScheduleCompetence();
        } else if (type === 'exception') {
            var page = $("#page").html('');
            var exceptionPage = new Page(page, {
                pageSize: [10, 20, 30], // 设置每页显示条数按钮
                size: 10, // 默认每页显示多少条
            });
            exceptionManager.initException(null, exceptionPage);
            exceptionEvent.initExceptionClick(exceptionPage);
            exceptionEvent.renderExceptionCompetence();
        } else if (type === 'process') {
            var page = $("#page").html('')
            var processPage = new Page(page, {
                pageSize: [10, 20, 30], // 设置每页显示条数按钮
                size: 10, // 默认每页显示多少条
            });
            exceptionManager.initProcess(null, processPage);
            exceptionEvent.initProcessClick(processPage);
            exceptionEvent.renderExceptionCompetence();
        } else if (type === 'labor') {
            laborManager.initLabor();
        } else if (type === 'attendance') {
            laborManager.initAttendance();
        } else if (type === 'employee') {
            laborManager.initEmployee();
        } else if (type === 'cost') {
            costBudgetManager.initCostBudget();
            costBudgetManager.renderCostBudgetCompetence()
        } else if (type === 'budget') {
            costBudgetManager.initCostSubProject();
        } else if (type === 'material') {
            costBudgetManager.initCostMaterial();
        } else if (type === 'workerCount') {
            costBudgetManager.initCostWorkerCount();
        } else if (type === 'step') {
            costBudgetManager.initCostStep();
        } else if (type === 'subpackage') {
            costBudgetManager.initCostSubpackage();
        } else if (type === 'quantity') {
            costBudgetManager.initCostQuantity();
        } else if (type === 'contract-sum') {
            contractManager.initContractSum();
            contractManager.renderCotractManagerCompetence();
        } else if (type === 'contract-detail') {
            contractManager.initContractDetail();
        } else if (type === 'contract-resource') {
            contractManager.initBillContractFunc();
        } else if (type === 'project-material') {
            materialManager.initMaterialPlanFunc();
            materialManager.renderCompetence()
        } else if (type === 'material-plan') {
            materialManager.initMaterialMyTAskFunc();
        } else if (type === 'material-amount') {
            materialManager.initMaterialPlanAmountFunc();
        } else if (type === 'material-purchase') {
            materialManager.initMaterialPurchaseSumFunc();
        } else if (type === 'material-summary') {
            materialManager.initMaterialPlanSummaryFunc();
        } else if (type === 'balance-index') {
            balanceManager.initBalanceFunc();
            balanceManager.renderCompetence()
        } else if (type === 'balance-contract') {
            balanceManager.initBalanceDetailFunc();
        } else if (type === 'balance-resource') {
            balanceManager.initBalanceResourceFunc();
        } else if (type === 'financial-status') {
            costManager.initFinancialStatus();
            costManager.renderFinancialCompetence()
        } else if (type === 'financial-report') {
            costManager.initFinancialReport();
            costManager.renderFinancialCompetence()
        } else if (type === 'financial-cost') {
            costManager.initFinancialCost();
            costManager.renderFinancialCompetence()
        } else if (type === 'financial-pay') {
            costManager.initFinancialPay();
            costManager.renderFinancialCompetence();
        } else if (type === 'financial-me') {
            costManager.initFinancialMe();
            costManager.renderFinancialCompetence();
        } else if (type === 'project-document') {
            documentManager.initDocumentManager();
            documentManager.renderDocmentCompetence();
        } else if (type === 'organization-instrument') {
            organizationManager.initOrganizationStructureManager();
        } else if (type === 'organization-task') {
            organizationManager.initTaskDistributionManager();
        }
    }
};

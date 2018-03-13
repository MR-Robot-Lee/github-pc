var systemApi = require('./systemApi');
var renderSystemTable = require('./renderSystemTable');

exports.addDepartmentFunc = function (data, modal) {
  var that = this;
  systemApi.postDepartment(data).then(function (res) {
    if (res.code === 1) {
      that.getDepartmentListFunc();
      modal.hide();
    }
  })
};

exports.getDepartmentListFunc = function () {
  systemApi.getDepartmentList().then(function (res) {
    var list = res.data ? res.data : [];
    renderSystemTable.renderNavListDom(list);
  })
};
exports.putDepartmentFunc = function (data, modal) {
  var that = this;
  systemApi.putDepartment(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getDepartmentListFunc();
    }
  })
};
exports.delDepartmentFunc = function (id, modal) {
    var that = this;
  systemApi.delDepartment(id).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getDepartmentListFunc();
    }
  })
};
exports.getEmployeeListFunc = function (data) {
    systemApi.getEmployeeList(data).then(function (res) {
    var list = res.data ? res.data.data : [];
    renderSystemTable.renderEmployeeTable(list);
  })
};
/**
 * 员工排序
 * @param data
 */
exports.putEmployeeSortFunc = function (data) {
    systemApi.putEmployeeSort(data).then(function (res) {
        if (res.code === 1) {
            alert('保存成功');
        }
    })
};
exports.putDepartmentSortFunc = function (data) {
    systemApi.putDepartmentSort(data).then(function (res) {

    })
};



/**
 * 添加员工信息
 * @param data
 * @param modal
 */
exports.postEmployeeFunc = function (data, modal) {
  var that = this;
  systemApi.postAddEmployee(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getEmployeeListFunc({ deptId: data.deptId });
    }
  })
};
/**
 * 更新员工信息
 * @param data
 * @param modal
 */
exports.putEmployeeFunc = function (data, modal) {
  var that = this;
    systemApi.putEmployee(data).then(function (res) {
    if (res.code === 1) {
      that.getEmployeeListFunc({ deptId: data.deptId });
      modal.hide();
    }
  })
};
/**
 * 获取企业信息
 */
exports.getCompanyInfoFunc = function (type) {
  systemApi.getCompanyInfo().then(function (res) {
    var obj = res.data ? res.data : {};
    if (type === 'account') {
      renderSystemTable.renderAccountCompanyInfo(obj);
    } else {
      renderSystemTable.renderCompanyInfoDom(obj);
    }
  })
};


exports.postCompanyInfoFunc = function (data) {
  var that = this;
  systemApi.postCompanyInfo(data).then(function (res) {
    if (res.code === 1) {
      alert('保存成功');
      that.getCompanyInfoFunc();
    }
  })
};
exports.getCompanyContractInfo = function () {
  systemApi.getContractInfo().then(function (res) {
    var obj = res.data ? res.data : {};
    renderSystemTable.renderCompanyContractDom(obj);
  })
};
exports.postCompanyContractInfo = function (data) {
  var that = this;
  systemApi.postContractInfo(data).then(function (res) {
    if (res.code === 1) {
      alert('保存成功');
      that.getCompanyContractInfo();
    }
  })
};

exports.uploadImage = function (file) {
  var req = systemApi.upload(file, function () {
  });
  req.then(function (res) {
    var obj = res.data ? res.data : {};
    renderSystemTable.renderCompanyBillboardUpdate(obj);
  });
};
exports.resetUploadImage = function (file, parents) {
  var req = systemApi.upload(file, function () {
  });
  req.then(function (res) {
    var obj = res.data ? res.data : {};
    if (obj.attachUrl) {
      parents.find('img').attr('src', window.API_PATH + "/customer" + obj.attachUrl)
    }
  })
};

exports.uploadCompanyLogo = function (file) {
  var req = systemApi.upload(file, function () {
  });
  req.then(function (res) {
    var obj = res.data ? res.data : {};
    renderSystemTable.renderCompanyLogo(obj);
  });
};
exports.getPropagationFunc = function () {
  systemApi.getPropagation().then(function (res) {
    var list = res.data ? res.data.data : [];
    renderSystemTable.renderCompanyBillboardUpdateList(list);
  })
};

exports.postPropagationFunc = function (data) {
  var that = this;
  for(var i = 0;i < data.length;i++){
      systemApi.postPropagation(data[i]).then(function (res) {
          if (res.code === 1) {
              that.getPropagationFunc();
          }
      })
  }
    alert('保存成功');
};

exports.delPropagationFunc = function (id, modal) {
  systemApi.delPropagation(id).then(function (res) {
    if (res.code === 1) {
      $('.v-' + id).remove();
      modal.hide();
    }
  })
};

exports.stopOrOpenEmployee = function (data, modal) {
  systemApi.postStopEmployee(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      $('#enterpriseNav').find('ul li.active').click();
    }
  })
};
exports.getStopOrOpenEmployee = function (data, modal) {
  systemApi.getStopEmployee(data).then(function (res) {
    if (res.code === 1) {
      var list = res.data ? res.data : [];
      renderSystemTable.renderStopUseReasonTable(list, modal);
    }
  })
};
/**
 * 添加员工modal select
 */
exports.getProjectJobSelectList = function (modal, jobId) {
  systemApi.getPostEmployeeList().then(function (res) {
    var list = res.data ? res.data : [];
    renderSystemTable.renderProjectJobSelect(list, modal, jobId);
  });
};
exports.getDepartmentSelectList = function (modal, deptId) {
  systemApi.getDepartmentList().then(function (res) {
    var list = res.data ? res.data : [];
    renderSystemTable.renderDepartmentSelect(list, modal, deptId);
  })
};
/**
 * 职务增删改查
 */
exports.getProjectJobList = function () {
  systemApi.getProjectJob().then(function (res) {
    var list = res.data ? res.data : [];
    renderSystemTable.renderProjectJobTable(list);
  });
};
exports.postAddJobFunc = function (data, modal) {
  var that = this;
  systemApi.postAddProjectJob(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getProjectJobList();
    }
  })
};
exports.putProjectJobFunc = function (data, modal) {
  var that = this;
  systemApi.putProjectJob(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getProjectJobList();
    }
  })
};
exports.delProjectJobFunc = function (id, modal) {
  var that = this;
  systemApi.delProjectJob(id).then(function (res) {
    if (res.code === 1) {
      that.getProjectJobList();
      modal.hide();
    }
  })
};

exports.getResourceRoleFunc = function (callback) {
  systemApi.getResourceRole().then(function (res) {
    var list = res.data ? res.data : [];
    renderSystemTable.renderRoleResourceTable(list);
    if (callback) {
      callback();
    }
  })
};
/**
 * 添加职务
 * @param data
 */
exports.postAddJobListFunc = function (data) {
  systemApi.postAddJob(data).then(function (res) {
    if (res.code === 1) {
      window.location.href = '/system/role';
    }
  })
};
exports.putJobFunc = function (data) {
  systemApi.putJob(data).then(function (res) {
    if (res.code === 1) {
      window.location.href = '/system/role';
    }
  })
};
exports.getPostEmployeeListFunc = function () {
  systemApi.getPostEmployeeList().then(function (res) {
    var list = res.data ? res.data : [];
    renderSystemTable.renderEmployeeRoleTable(list);
  })
};

exports.delJobFunc = function (id, modal) {
  var that = this;
  systemApi.delJob(id).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getPostEmployeeListFunc();
    }
  })
};

exports.getPostEmployeeFindByIdFunc = function (id) {
  systemApi.getPostEmployeeFindById(id).then(function (res) {
    var obj = res.data ? res.data : {};
    renderSystemTable.renderAddRoleTable(obj);
  })
};

exports.putEmployeePost = function (data, modal, childModal) {
  var that = this;
  systemApi.putEmployeePost(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getPostEmployeeListFunc();
      if (childModal) {
        childModal.hide();
      }
    }
  })
};

/**
 * 获取采购方案
 */
exports.getPurchasePlanFunc = function () {
  systemApi.getPurchasePlan().then(function (res) {
    var list = res.data ? res.data : [];
    renderSystemTable.renderPurchaseAccountInfo(list);
  })
};

exports.postOrderFunc = function (data, modal) {
  systemApi.postOrder(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
    }
  })
};
/**
 * 获取订单详情
 */
exports.getOrderListFunc = function () {
  systemApi.getOrderList().then(function (res) {
    var list = res.data ? res.data : [];
    renderSystemTable.renderOrderListTable(list);
  });
};
/**
 *
 * @param data
 * @param callback
 */
exports.postAccountPayableFunc = function (data, callback) {
  systemApi.postAccountPayable(data).then(function (res) {
    if (res.code === 1) {
      callback(res.data);
    }
  })
};
/**
 * 获取付款信息
 * @param id
 * @param modal
 */
exports.getAdminAccountBankInfoFunc = function (id, modal) {
  systemApi.getAdminAccountBankInfo(id).then(function (res) {
    var obj = res.data ? res.data : {};
    renderSystemTable.renderPayOrderObj(modal, obj);
  })
};
/**
 * 支付
 * @param data
 * @param modal
 */
exports.postPayMoneyFunc = function (data, modal) {
  var that = this;
  systemApi.postPayMoney(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getOrderListFunc();
    }
  })
};
/**
 * 申请发票
 * @param data
 * @param modal
 */
exports.applyInvoiceFunc = function (data, modal) {
  var that = this;
  systemApi.applyInvoice(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getOrderListFunc();
    }
  })
};

/**
 *  企业资质
 * @param id
 */
exports.getCompanyQualityFunc = function (id) {
  systemApi.getCompanyQuality().then(function (res) {
    var list = res.data ? res.data : [];
    renderSystemTable.renderCompanyQuality(list, id);
  })
};
/**
 * 通过id删除订单信息
 * @param id
 * @param modal
 */
exports.delOrderFindByIdFunc = function (id, modal) {
  var that = this;
  systemApi.delOrderFindById(id).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getOrderListFunc();
    }
  })
};
/**
 * 获取发票信息
 * @param orderId
 * @param modal
 * @param pItem
 */
exports.getInvoiceInfoFunc = function (orderId, modal, pItem) {
  systemApi.getInvoiceInfo(orderId).then(function (res) {
    var obj = res.data ? res.data : {};
    renderSystemTable.renderOrderInvocceInfo(obj, modal, pItem);
  })
};
var organizationApi = require('./organizationApi');
var renderOrganizationManagerTable = require('./renderOrganizationManagerTable');

/**
 * 获取项目成员及职务
 */
exports.getOrganizeStrucEmployeeFunc = function (data) {
  organizationApi.getOrganizeStrucEmployee().then(function (res) {
    var list = res.data ? res.data : [];
    renderOrganizationManagerTable.renderOrganizeStruEmployeeTable(list,data);
  })
};
/**
 * 获取modal外来人员的
 */
exports.getOrganizeFloatingPopulationModalFunc = function (modal) {
  organizationApi.getOrganizeFloatingPopulation().then(function (res) {
    var list = res.data ? res.data : [];
    renderOrganizationManagerTable.renderOrganizeStrumentOutModalTable(list, modal)
  })
};

exports.renderNewInstrumentModal = function (list, modal, parents, type) {
  renderOrganizationManagerTable.renderOrganizeStrumentModalTable(list, modal, parents, type);
};
/**
 * 获取组织结构
 */
exports.getOrganizeStrucListFunc = function () {
  organizationApi.getOrganizeStrucList().then(function (res) {
    var obj = res.data ? res.data : [];
    renderOrganizationManagerTable.renderOrganizeStruDetail(obj);
  })
};
/**
 * 获取新增成员及职务
 * @param data
 */
exports.getOrganizeFloatingPopulationFunc = function (data) {
  organizationApi.getOrganizeFloatingPopulation(data).then(function (res) {
    var list = res.data ? res.data : [];
    renderOrganizationManagerTable.renderOrganizeFloatingPopulationTable(list);
  });
};
/**
 * 添加外来人员
 * @param data
 * @param modal
 * @param parentModal
 */
exports.postOrganizeFloatingPopulationFunc = function (data, modal, parentModal) {
  var that = this;
  organizationApi.postOrganizeFloatingPopulation(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getOrganizeFloatingPopulationFunc(null, null, parentModal);
      that.getOrganizeFloatingPopulationModalFunc(parentModal);
    }
  })
};

exports.getSystemJobAllListFunc = function (id) {
  organizationApi.getSystemJobAllList().then(function (res) {
    var list = res.data ? res.data : [];
    renderOrganizationManagerTable.renderOrganizeFloatingJobSelect(list, id);
  })
};
/**
 * 任务分配
 */
exports.getTaskFirstTable = function () {
  organizationApi.getOrganizeFloatingPopulation().then(function (res) {
    var list = res.data ? res.data : [];
    renderOrganizationManagerTable.renderTaskTable(list, 'outer');
  })
};
/**
 * 任务分配
 */
exports.getTaskSecondTable = function () {
  organizationApi.getOrganizeStrucEmployee().then(function (res) {
    var list = res.data ? res.data : [];
    renderOrganizationManagerTable.renderTaskTable(list, 'inter');
  })
};
/**
 * 添加职责内容
 * @param data
 * @param parents
 */
exports.postOrganizeStrucEmployeeRemarkFunc = function (data, parents) {
  var that = this;
  if (data.type === 'inter') {
    organizationApi.postOrganizeStrucEmployeeRemark(data).then(function (res) {
      if (res.code === 1) {
        that.getTaskSecondTable();
        parents.remove();
      }
    })
  } else {
    organizationApi.postFloatingPopulationRemark(data).then(function (res) {
      if (res.code === 1) {
        that.getTaskFirstTable();
        parents.remove();
      }
    })
  }
};

exports.delTaskTable = function (data, modal) {
  var that = this;
  if (data.type === 'outer') {
    organizationApi.delOrganizeFloatingPopulation(data.id).then(function (res) {
      if (res.code === 1) {
        modal.hide();
        that.getTaskFirstTable();
      }
    })
  } else {
    organizationApi.delOrganizeStrucEmployee(data.id).then(function (res) {
      if (res.code === 1) {
        modal.hide();
        that.getTaskSecondTable();
      }
    })
  }
};
/**
 * 获取项目职务
 * @param parents
 */
exports.getOrganizePositionFunc = function (parents) {
  organizationApi.getOrganizePosition().then(function (res) {
    var list = res.data ? res.data : [];
    renderOrganizationManagerTable.renderOrganizePositionSelect(list, parents);
  })
};

exports.addOrganizeAndApprovalFunc = function (data, modal) {
  var that = this;
  organizationApi.addOrganizeAndApproval(data).then(function (res) {
    if (res.code === 1) {
        modal.hide();
        that.getOrganizeStrucListFunc();
      that.getOrganizeFloatingPopulationFunc();
      that.getPostEmployeeFunc();
    }
  })
};
/**
 * 修改
 * @param data
 * @param modal
 */
exports.putOrganizeStrucFunc = function (data, modal) {
  var that = this;
  organizationApi.putOrganizeStruc(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getOrganizeStrucListFunc();
      that.getOrganizeFloatingPopulationFunc();
      that.getPostEmployeeFunc();
    }
  })
};
/**
 * 删除内部员工  项目中的
 * @param data
 * @param modal
 * @param parents
 */
exports.delUpdateOrganiza = function (data, modal, parents) {
  var that = this;
  organizationApi.delOrganizeStrucEmployee(data.id).then(function (res) {
    if (res.code === 1) {
      parents.remove();
      that.getPostEmployeeFunc();
      modal.hide();
    }
  });
};

/**
 * 删除外来人员
 * @param id
 * @param modal
 * @param parentModal
 */
exports.delOrganizeStrucEmployeeFunc = function (id, modal, parentModal) {
  var that = this;
  organizationApi.delOrganizeFloatingPopulation(id).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getOrganizeFloatingPopulationModalFunc(parentModal);
    }
  });
};

/**
 * 修改外来人员
 * @param data
 * @param modal
 * @param parentModal
 */
exports.putOrganizeFloatingPopulationFunc = function (data, modal, parentModal) {
  var that = this;
  organizationApi.putOrganizeFloatingPopulation(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getOrganizeFloatingPopulationFunc(null, null, parentModal);
      that.getOrganizeFloatingPopulationModalFunc(parentModal);
    }
  })
};

exports.getPostEmployeeFunc = function(){
    var that = this;
    organizationApi.getPostEmployeeList().then(function(res){
        that.getOrganizeStrucEmployeeFunc(res);
    });
}

exports.getJobDescFunc = function(postId){
    organizationApi.getPostEmployeeFindById(postId).then(function(res){
        var data = res.data ? res.data : {};
        var posRemark = data.posRemark || '无';
        $('.job-description').html(posRemark);
    });
}

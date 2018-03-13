var request = require('../../helper/request');
/**
 * 添加部门
 * @param data
 * @returns {Request}
 */
exports.postDepartment = function (data) {
  return request.post('/customer/system/addDepartment', { body: data });
};
/**
 * 通过id删除部门
 * @param id
 */
exports.delDepartment = function (id) {
  return request.del('/customer/system/delDepartment/' + id);
};
/**
 * 通过id修改部门
 * @param data
 * @returns {Request}
 */
exports.putDepartment = function (data) {
  return request.put('/customer/system/updDepartment/' + data.id, { body: data });
};
/**
 * 获取部门列表
 * @returns {Request}
 */
exports.getDepartmentList = function () {
  return request.get('/customer/system/getDepartments');
};

/**
 * 添加停用
 * @param data
 * @returns {Request}
 */
exports.postStopEmployee = function (data) {
  return request.post('/customer/system/addDisable', { body: data });
};

/**
 * 获取停用记录列表
 * @returns {Request}
 */
exports.getStopEmployee = function (data) {
  return request.get('/customer/system/getDisables', { qs: data });
};
/**
 * 添加员工
 * @param data
 * @returns {Request}
 */
exports.postAddEmployee = function (data) {
  return request.post('/customer/system/addEmployee', { body: data });
};
/**
 * 获取员工列表
 * @param data
 * @returns {Request}
 */
exports.getEmployeeList = function (data) {
  return request.get('/customer/system/getEmployees', { qs: data });
};
/**
 * 通过id修改员工
 * @param data
 * @returns {Request}
 */
exports.putEmployee = function (data) {
  return request.put('/customer/system/updEmployee/' + data.id, { body: data });
};

/**
 * 员工排序
 * @param data
 * @returns {Request}
 */
exports.putEmployeeSort = function (data) {
    // return request.put('/customer/system/employee/sort/' + data.id, { body: data });
    return request.put('/customer/system/employee/sort/?' + 'deptId=' + data.deptId + '&employeeIds=' + data.employeeIds + '&sortIds=' + data.sortIds);
};

/**
 * 部门排序
 * @param data
 * @returns {Request}
 */
exports.putDepartmentSort = function (data) {
    // return request.put('/customer/system/employee/sort/' + data.id, { body: data });
    return request.put('/customer/system/department/sort/?' + 'deptIds=' + data.deptIds + '&sortIds=' + data.sortIds);
};


/**
 * 添加企业信息
 * @param data
 * @returns {Request}
 */
exports.postCompanyInfo = function (data) {
  return request.post('/customer/system/addMessage', { body: data });
};
/**
 * 获取企业信息
 * @returns {Request}
 */
exports.getCompanyInfo = function () {
  return request.get('/customer/system/getEnterMessage');
};
/**
 * 添加职务
 * @param data
 * @returns {Request}
 */
exports.postAddJob = function (data) {
  return request.post('/customer/system/addPost', { body: data });
};
/**
 * 通过id删除职务
 * @param id
 */
exports.delJob = function (id) {
  return request.del('/customer/system/delPost/' + id);
};

/**
 * 通过id获取职务
 * @param id
 * @returns {Request}
 */
exports.getJob = function (id) {
  return request.get('/customer/system/getPost', { qs: { postId: id } });
};
/**
 * 通过id修改职务
 * @param data
 * @returns {Request}
 */
exports.putJob = function (data) {
  return request.put('/customer/system/updPost/' + data.id, { body: data });
};
/**
 * 添加项目部职务
 * @param data
 * @returns {Request}
 */
exports.postAddProjectJob = function (data) {
  return request.post('/customer/system/addProjPost', { body: data });
};
/**
 * 通过id删除项目部职务
 * @param id
 */
exports.delProjectJob = function (id) {
  return request.del('/customer/system/delProjPost/' + id);
};
/**
 * 通过id获取项目部职务
 * @returns {Request}
 */
exports.getProjectJob = function () {
  return request.get('/customer/system/getProjPost');
};
/**
 * 通过id修改项目职务
 * @param data
 * @returns {Request}
 */
exports.putProjectJob = function (data) {
  return request.put('/customer/system/updProjPost/' + data.id, { body: data });
};
/**
 * 添加宣传
 * @param data
 * @returns {Request}
 */
exports.postPropagation = function (data) {
  return request.post('/customer/system/addPublicity', { body: data });
};
/**
 * 通过id删除宣传
 * @param id
 */
exports.delPropagation = function (id) {
  return request.del('/customer/system/delPublicity/' + id);
};
/**
 * 获取宣传列表
 * @returns {Request}
 */
exports.getPropagation = function () {
  return request.get('/customer/system/getPublicity')
};
/**
 * 获取权限资源
 * @returns {Request}
 */
exports.getResourceRole = function () {
  return request.get('/customer/system/resource');
};
/**
 * 获取联系人信息
 * @returns {Request}
 */
exports.getContractInfo = function () {
  return request.get('/customer/system/getPersonContact');
};
/**
 * 添加联系人信息
 * @param data
 * @returns {Request}
 */
exports.postContractInfo = function (data) {
  return request.post('/customer/system/addPerContect', { body: data });
};
/**
 * 上传文件
 * @param file
 * @param callback
 */
exports.upload = function (file, callback) {
  return request.upload(file, callback);
};
/**
 * 查询职务列表及所属人员
 * @returns {Request}
 */
exports.getPostEmployeeList = function () {
  return request.get('/customer/system/getPostEmpl');
};

exports.getPostEmployeeFindById = function (id) {
  return request.get('/customer/system/post/' + id);
};
/**
 * 更新职务权限列表的人员
 * @param data
 * @returns {Request}
 */
exports.putEmployeePost = function (data) {
  return request.put('/customer/system/updEmployeePost', { body: data });
};

/**
 * 获取购买方案
 * @returns {Request}
 */
exports.getPurchasePlan = function () {
  return request.get('/customer/system/goods');
};
/**
 * 添加订单 type 1 购买 2 追号 3 存储
 * @param data
 * @returns {Request}
 */
exports.postOrder = function (data) {
  return request.post('/customer/system/order', { body: data });
};
/**
 * 申请开发票
 * @param data
 * @returns {Request}
 */
exports.applyInvoice = function (data) {
  return request.post('/customer/system/invoice', { body: data });
};
/**
 * 支付订单费用
 * @param data
 * @returns {Request}
 */
exports.postPayMoney = function (data) {
  return request.post('/customer/system/pay', { body: data });
};
/**
 * 获取订单列表
 * @returns {Request}
 */
exports.getOrderList = function () {
  return request.get('/customer/system/order');
};
/**
 * 获取订单信息
 * @param orderId
 * @returns {Request}
 */
exports.getInvoiceInfo = function (orderId) {
  return request.get('/customer/system/invoice/' + orderId);
};
/**
 * 获取阿筑 对公账户信息
 * @param id
 * @returns {Request}
 */
exports.getAdminAccountBankInfo = function (id) {
  return request.get('/customer/system/order/' + id);
};
/**
 * 查询要支付的金额
 * @param data
 * @returns {Request}
 */
exports.postAccountPayable = function (data) {
  return request.post('/customer/system/prchPrice', { body: data });
};


exports.getCompanyQuality = function () {
  return request.get('/customer/system/quality');
};
/**
 * 删除订单
 * @param id
 */
exports.delOrderFindById = function (id) {
  return request.del('/customer/system/order/'+id);
};





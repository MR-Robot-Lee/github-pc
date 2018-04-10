var request = require('../../helper/request');
/**
 * 招标状态修改
 * @returns {Request}
 */
exports.putBidsStatus = function putBidsStatus(id, status) {
    return request.put('/customer/bid/bid/' + id + '/' + status);
};
/**
 * 招标信息添加
 * @returns {Request}
 */
exports.postBidsInfo = function postBidsInfo(data) {
    data = data || {};
    return request.post('/customer/bid/bidBean', {body: data});
};
/**
 * 查看某一招标信息
 * @returns {Request}
 */
exports.getBidInfo = function getBidInfo(id) {
    id = id || '';
    return request.get('/customer/bid/bidBean/' + id);
};
/**
 * 招标信息修改
 * @returns {Request}
 */
exports.putBidsInfo = function putBidsInfo(data) {
    data = data || {};
    return request.put('/customer/bid/bidBean/' + data.id, {body: data});
};
/**
 * 查看招标列表
 * @returns {Request}
 */
exports.getBidsList = function getBidsList(data) {
    data = data || {};
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/bid/bidList', {qs: data});
};
/**
 * 查看信息模板列表
 * @returns {Request}
 */
exports.getInfoModalList = function getInfoModalList() {
    return request.get('/customer/bid/bidRequire');
};
/**
 * 添加信息模板
 * @returns {Request}
 */
exports.postInfoModal = function postInfoModal(data) {
    data = data || {};
    return request.post('/customer/bid/bidRequire', {body: data});
};
/**
 * 删除信息模板
 * @returns {Request}
 */
exports.delInfoModal = function delInfoModal(id) {
    return request.del('/customer/bid/bidRequire/' + id);
};
/**
 * 修改信息模板
 * @returns {Request}
 */
exports.putInfoModal = function putInfoModal(id, data) {
    data = data || {};
    return request.put('/customer/bid/bidRequire/' + id, {body: data});
};

/**
 * 选定中标
 * @returns {Request}
 */
exports.putWinBid = function putWinBid(id, entpId) {
    return request.put('/customer/bid/winBid/' + id + '/' + entpId);
};

/**
 * 查看某一供应商对某一招标的投标信息
 * @returns {Request}
 */
exports.getBidingInfo = function getBidingInfo(data) {
    return request.get('/customer/bid/bidding',{qs: data});
};
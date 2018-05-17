var request = require('../../helper/request');
var charge = require('./chargeRender');
var renderTableDom = require('./renderTableDom');
var Page = require('../../components/Page');
/**
 * 分包,人工,措施,获取基础数据
 * @param type
 * @param page
 * @param item
 */
exports.getTableList = function getTableList(item, type, page, funType) {
    // console.log(funType);
    var url = '';
    var data = {};
    if (type === 'charge') {
        url = '/customer/labor/baseStats';
        data.qs = { laborType: item.id, pageNo: item.pageNo || 1, pageSize: item.pageSize || 10 }
        if (item.keywords) {
            data.qs.keywords = item.keywords
        }
    } else if (type === 'step') {
        url = '/customer/measure/baseStats';
        data.qs = { measureType: item.id, pageNo: item.pageNo || 1, pageSize: item.pageSize || 10 }
        if (item.keywords) {
            data.qs.keywords = item.keywords
        }
    } else if (type === 'subpackage') {
        url = '/customer/sublet/baseStats';
        data.qs = { subletType: item.id, pageNo: item.pageNo || 1, pageSize: item.pageSize || 10 }
        if (item.keywords) {
            data.qs.keywords = item.keywords
        }
    } else if (type === 'supplier') {
        url = '/customer/enterpise/base';
        data.qs = { entpType: item.id, pageNo: item.pageNo || 1, pageSize: item.pageSize || 10 }
        if (item.keywords) {
            data.qs.keywords = item.keywords
        }
    } else if (type === 'library') {
        url = '/customer/project/base/' + item.id;
        data.qs = { pageNo: item.pageNo || 1, pageSize: item.pageSize || 10 }
        if (item.keywords) {
            data.qs.keywords = item.keywords
        }
    } else if (type === 'enterprise') {
        url = '/customer/material/baseStats';
        data.qs = {
            pageNo: item.pageNo || 1,
            pageSize: item.pageSize || 10,
            mtrlType: item.id,
            mtrlCategory: item.mtrlCategory
        };
        if (item.keywords) {
            data.qs.keywords = item.keywords
        }
    } else if (type === 'hr') {
        url = '/customer/attend/getWorksByCondition';
        data.qs = { teamId: item.teamId, pageNo: item.pageNo || 1, pageSize: item.pageSize || 10 }
        if (item.keywords) {
            data.qs.keywords = item.keywords
        }
    } else {
        return
    }
    request.get(url, data).then(function (res) {
        var parent = $('#enterpriseLibrary').html('');
        if (!page) {
            var $page = $('#page').html('');
            page = new Page($page, {
                pageSize: [10, 20, 30], // 设置每页显示条数按钮
                size: 10, // 默认每页显示多少条
            });
        }
        if (res.code === 1) {
            renderTableDom.renderLabourCharge(res.data.data, parent, type, funType);
            // LEE:
            console.log('触发了pageupdate事件');
            page.update({ pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total });
            //绑定分页修改事件
            page.change(function ($page) {
                //一旦分页有变动，这里就会回调，然后在这里面执行ajax请求接口刷新数据
                //分页的界面更新是由接口返回的数据驱动的 所以ajax请求完成后需要执行update更新分页界面
                //理论上 接口返回的分页数据应该与 函数里的data相同
                // Page.update(data);
                console.log("触发了page.change事件")
                item.pageNo = $page.pageNo;
                item.pageSize = $page.pageSize;
                var tableListInfo = {};
                tableListInfo.item = item;
                tableListInfo.type = type;
                tableListInfo.page = page;
                tableListInfo.funType = funType;
                localStorage.setItem('tableListInfo', JSON.stringify(tableListInfo));
                getTableList(item, type, page, funType);
            });
        }
    })
};

exports.postTableList = function postTableList(data, type, callback) {
    var url = '';
    if (type === 'charge' || type === 'labor') {
        url = '/customer/labor/base';
    } else if (type === 'step') {
        url = '/customer/measure/base';
    } else if (type === 'subpackage') {
        url = '/customer/sublet/base';
    } else if (type === 'library') {
        url = '/customer/project/base';
    } else if (type === 'supplier') {
        url = '/customer/enterpise/base';
    } else if (type === 'enterprise' || type === 'material') {
        url = '/customer/material/base';
    } else if (type === 'hr') {

    }
    request.post(url, { body: data }).then(function (res) {
        if (callback) {
            callback(res)
        }
    })
};

/**
 * 添加材料
 * @param data
 * @returns {Request}
 */
exports.postMaterialBaseAll = function postMaterialBaseAll(data, type, callback) {
    var url = '';
    if (type === 'charge' || type === 'labor') {
        url = '/customer/labor/baseAll';
    } else if (type === 'step') {
        url = '/customer/measure/baseAll';
    } else if (type === 'subpackage') {
        url = '/customer/sublet/baseAll';
    } else if (type === 'library') {
        url = '/customer/project/baseAll';
    } else if (type === 'supplier') {
        url = '/customer/enterpise/baseAll';
    } else if (type === 'enterprise' || type === 'material') {
        url = '/customer/material/baseAll';
    }
    request.post(url, { body: data }).then(function (res) {
        if (callback) {
            callback(res)
        }
    })
};


exports.putTableList = function putTableList(data, type, callback) {
    var url = '';
    if (type === 'charge') {
        url = '/customer/labor/base';
    } else if (type === 'step') {
        url = '/customer/measure/base';
    } else if (type === 'subpackage') {
        url = '/customer/sublet/base'
    } else if (type === 'library') {
        url = '/customer/project/base';
    } else if (type === 'supplier') {
        url = '/customer/enterpise/base';
    } else if (type === 'enterprise') {
        url = '/customer/material/base'
    }
    request.put(url + '/' + data.id, { body: data }).then(function (res) {
        if (callback) {
            callback(res)
        }
    })
};
/**
 * 通过id删除
 * @param id
 * @param callback
 */
exports.delTableList = function delTableList(id, type, callback) {
    var url = '';
    if (type === 'charge') {
        url = '/customer/labor/base';
    } else if (type === 'step') {
        url = '/customer/measure/base';
    } else if (type === 'subpackage') {
        url = '/customer/ sublet/base';
    } else if (type === 'library') {
        url = '/customer/project/base';
    } else if (type === 'supplier') {
        url = '/customer/enterpise/base';
    } else if (type === 'enterprise') {
        url = '/customer/material/base';
    } else if (type === 'hr') {
        url = '/customer/attend/delWorkById';
    }
    request.del(url + '/' + id).then(function (res) {
        if (callback) {
            callback(res)
        }
    })
};
/**
 * 获取二级菜单
 * @param type
 * @param handle
 * @param data
 * @param page
 */
exports.getChildNav = function getChildNav(type, handle, data, page) {
    var url = '';
    var temp = '';
    var _temp = '';
    if (type === 'charge') {
        url = '/customer/labor/type';
        temp = 'labor';
    } else if (type === 'step') {
        url = '/customer/measure/type';
        temp = 'step';
    } else if (type === 'subpackage') {
        url = '/customer/sublet/type';
        temp = 'subpackage';
    } else if (type === 'supplier') {
        url = '/customer/enterpise/type';
        temp = 'supplier';
    } else if (type === 'library') {
        url = '/customer/project/type';
    } else if (type === 'enterprise') {
        url = '/customer/material/categoryTree';
        temp = 'material';
        _temp = '_material';
    } else if (type === 'enterprise-level') {
        url = '/customer/material/categoryTree';
        temp = 'material';
        _temp = '_material';
    } else if (type === 'hr') {
        url = '/customer/attend/getAllEntpTeams';
        temp = 'hr';
    }
    request.get(url).then(function (res) {
        var parents = $('#childNav').html('');
        if (res.code === 1 && res.data) {
            var list = [];
            if (type === 'enterprise-level') {
                type = 'enterprise';
            }
            if (type === 'hr') {
                list = res.data;
            } else {
                list = res.data.data;
            }
            charge.renderNav(list, type, parents, null, null, page);
            charge.initDomSpanClick(parents, type);
            /*材料、人工、措施、分包、供应 一级标签的点击*/
            var tempId = sessionStorage.getItem(temp);
            if (tempId) {
                $('#childNav>li').each(function (index, ele) {
                    if ($(this).attr('id') == tempId) {
                        sessionStorage.removeItem(temp);
                        $(this).click();
                        return false;
                    }
                });
                /*材料库中 点击二级标签*/
                if (_temp) {
                    var _tempId = sessionStorage.getItem(_temp);
                    $('#childNav>li.active ul li').each(function (index, ele) {
                        if ($(this).attr('id') == _tempId) {
                            sessionStorage.removeItem(_temp);
                            $(this).click();
                            return false;
                        }
                    });
                    return false;
                }
                return false;
            }
            if (handle === 'add') {
                parents.find(">li:last-child").click();
            } else if (handle === 'update') {
                if (data.mtrlCategory) {
                    var $parentLi = parents.find("#" + data.mtrlCategory);
                    $parentLi.find("#" + data.id + "-level").click();
                } else {
                    parents.find("#" + data.id).click();
                }
            } else if (handle === 'add-level') {
                var parentLi = $("#" + data.mtrlCategory);
                parentLi.find("ul>li:last-child").click();
            } else if (handle === 'get') {
                if (type === 'enterprise-level') {
                    $('#' + data.mtrlCategory).click();
                } else {
                    parents.find(">li:first-child").click();
                }
            }
        }
    })
};
/**
 * 获取二级菜单
 * @param data
 * @param type
 * @param callback
 */
exports.postChildNav = function postChildNav(data, type, callback) {

    var url = '';
    if (type === 'charge') {
        url = '/customer/labor/type';
    } else if (type === 'step') {
        url = '/customer/measure/type';
    } else if (type === 'subpackage') {
        url = '/customer/sublet/type';
    } else if (type === 'supplier') {
        url = '/customer/enterpise/type';
    } else if (type === 'library') {
        url = '/customer/project/type';
    } else if (type === 'enterprise') {
        url = '/customer/material/category';
    } else if (type === 'enterprise-level') {
        url = '/customer/material/type';
    } else if (type === 'hr') {
        url = '/customer/attend/addEntpTeam';
    }
    request.post(url, { body: data }).then(function (res) {
        if (callback) {
            callback(res)
        }
    })
};

/**
 * 更新二级菜单
 * @param type
 * @param callback
 */
exports.putChildNav = function putChildNav(data, type, callback) {
    var url = '';
    if (type === 'charge') {
        url = '/customer/labor/type';
    } else if (type === 'step') {
        url = '/customer/measure/type';
    } else if (type === 'subpackage') {
        url = '/customer/sublet/type';
    } else if (type === 'supplier') {
        url = '/customer/enterpise/type';
    } else if (type === 'library') {
        url = '/customer/project/type';
    } else if (type === 'enterprise') {
        url = '/customer/material/category';
    } else if (type === 'enterprise-level') {
        url = '/customer/material/type';
    } else if (type === 'hr') {
        url = '/customer/attend/updEntpTeamName';
    }
    var id = data.id;
    if (type === 'hr') {
        id = data.teamId;
    }
    request.put(url + '/' + id, { body: data }).then(function (res) {
        if (callback) {
            callback(res)
        }
    })
};

/**
 * 删除二级菜单
 * @param type
 * @param callback
 */
exports.delChildNav = function delChildNav(id, type, callback) {
    var url = '';
    if (type === 'charge') {
        url = '/customer/labor/type';
    } else if (type === 'step') {
        url = '/customer/measure/type';
    } else if (type === 'subpackage') {
        url = '/customer/sublet/type';
    } else if (type === 'supplier') {
        url = '/customer/enterpise/type';
    } else if (type === 'library') {
        url = '/customer/project/type';
    } else if (type === 'enterprise') {
        url = '/customer/material/category';
    } else if (type === 'enterprise-level') {
        url = '/customer/material/type';
    } else if (type === 'hr') {
        url = '/customer/attend/delTeamById';
    }
    request.del(url + '/' + id).then(function (res) {
        if (callback) {
            callback(res)
        }
    })
};
/**
 * 获取所有材料菜单信息
 * @param callback
 */
exports.getMaterialList = function getMaterialList(type, callback) {
    type = type || 'enterprise';
    var url = '';
    if (type === 'charge') {
        url = '/customer/labor/type';
    } else if (type === 'step') {
        url = '/customer/measure/type';
    } else if (type === 'subpackage') {
        url = '/customer/sublet/type';
    } else if (type === 'supplier') {
        url = '/customer/enterpise/type';
    } else if (type === 'library') {
        url = '/customer/project/type';
    } else if (type === 'enterprise') {
        url = '/customer/material/categoryTree';
    } else if (type === 'enterprise-level') {
        url = '/customer/material/categoryTree';
    } else if (type === 'hr') {
        url = '/customer/attend/getAllEntpTeams';
    }
    request.get(url).then(function (res) {
        if (res.code === 1 && callback) {
            var data = res.data || {};
            if (type !== 'hr') {
                data = res.data.data;
            }
            callback(data);
        }
    })
};
/**
 * 移动二级数据
 */
exports.moveMaterialData = function moveMaterialData(data, callback) {
    request.put('/customer/material/typeTrans?newCategoryId=' + data.newCategoryId + '&oldCategoryId=' + data.oldCategoryId + '&typeId=' + data.typeId)
        .then(function (res) {
            if (callback) {
                callback(res);
            }
        })
};

exports.moveTableOther = function moveTableOther(type, item, callback) {
    var url = '';
    var data = {};
    if (type === 'charge') {
        url = '/customer/labor/baseTrans?oldTypeId=' + item.oid + '&newTypeId=' + item.nid + '&laborIds=' + item.id;
    } else if (type === 'step') {
        url = '/customer/measure/baseTrans?oldTypeId=' + item.oid + '&newTypeId=' + item.nid + '&measureIds=' + item.id;
    } else if (type === 'subpackage') {
        url = '/customer/sublet/baseTrans?oldTypeId=' + item.oid + '&newTypeId=' + item.nid + '&subletIds=' + item.id;
    } else if (type === 'supplier') {
        url = '/customer/enterpise/baseTrans?oldTypeId=' + item.oid + '&newTypeId=' + item.nid + '&entpIds=' + item.id;
    } else if (type === 'library') {
        url = '/customer/project/baseTrans?oldTypeId=' + item.oid + '&newTypeId=' + item.nid + '&projIds=' + item.id;
    } else if (type === 'enterprise') {
        url = '/customer/material/baseTrans?oldCategoryId=' + item.oid + '&oldTypeId=' + item.ocid + '&newCategoryId=' + item.nid + '&newTypeId=' + item.ncid + '&mtrlIds=' + item.id;
    } else if (type === 'hr') {
        url = '/customer/attend/transTeam?oldTeamId=' + item.oid + '&newTeamId=' + item.nid + '&workerNos=' + item.id;
    }
    request.put(url, { body: data }).then(function (res) {
        if (callback) {
            callback(res);
        }
    })
};


/**
 * 获取里企业库的nav列表
 * type material 材料库
 * labor 人工费库
 * step 措施费
 * subpackage 分包库
 * supplier 供应商库
 */
exports.getModalNavList = function getModalNavList(type) {
    type = type || 'material';
    var url = '';
    if (type === 'labor') {
        url = '/customer/labor/type';
    } else if (type === 'step') {
        url = '/customer/measure/type';
    } else if (type === 'subpackage') {
        url = '/customer/sublet/type';
    } else if (type === 'supplier') {
        url = '/customer/enterpise/type';
    } else if (type === 'library') {
        url = '/customer/project/type';
    } else if (type === 'material') {
        url = '/customer/material/categoryTree';
    }
    return request.get(url);
};
/**
 * 通过类型id 获取列表库
 * @param type
 * @param item
 * @returns {Request}
 */
exports.getModalTableList = function getModalTableList(type, item) {
    var data = {};
    type = type || 'material';
    var url = '';
    if (type === 'labor') {
        url = '/customer/labor/base';
        data.qs = { laborType: item.id, pageNo: item.pageNo || 1, pageSize: 10000 }
    } else if (type === 'step') {
        url = '/customer/measure/base';
        data.qs = { measureType: item.id, pageNo: item.pageNo || 1, pageSize: 10000 }
    } else if (type === 'subpackage') {
        url = '/customer/sublet/base';
        data.qs = { subletType: item.id, pageNo: item.pageNo || 1, pageSize: 10000 }
    } else if (type === 'supplier') {
        url = '/customer/enterpise/base';
        data.qs = { entpType: item.id, pageNo: item.pageNo || 1, pageSize: 10000 }
    } else if (type === 'material') {
        url = '/customer/material/base';
        data.qs = {
            pageNo: item.pageNo || 1,
            pageSize: 10000,
            mtrlType: item.id,
            mtrlCategory: item.mtrlCategory
        }
    } else if (type === 'hr') {

    }
    return request.get(url, data);
};

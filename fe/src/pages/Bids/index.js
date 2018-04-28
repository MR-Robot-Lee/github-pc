var initEvent = require('./initEvent');
var initBidsFunc = require('./initBidsFunc');
var Page = require('../../components/Page');

module.exports = {
    ready: function (type) {
        if(type === 'bids-add'){//新建招标
            initEvent.initAddBidsEvent();
            initBidsFunc.getAllProjectFunc($('#allProject'));

        } else if(type === 'bids-all'){//招标公告
            var page = new Page($('#page'), {
                pageSize: [10, 20, 30], // 设置每页显示条数按钮
                size: 10, // 默认每页显示多少条
            })
            initEvent.initAllBidsEvent(page);
            initBidsFunc.getBidsListFunc(null, page);
            initBidsFunc.getAllProjectFunc($('[name=allProject]'));
        } else if(type === 'bids-notice'){//中标公示
            var page = new Page($('#page'), {
                pageSize: [10, 20, 30], // 设置每页显示条数按钮
                size: 10, // 默认每页显示多少条
            })
            initEvent.initBidsNoticeEvent(page);
            initBidsFunc.getBidsNoticeListFunc(null, page);
            initBidsFunc.getAllProjectFunc($('[name=allProject]'));
        } else if(type === 'bids-setting'){//设置条件
            initBidsFunc._getInfoModalListFunc();
            initEvent.initBidsSettingEvent();
        }

        var user = window.localStorage.getItem('user');
        user = user ? JSON.parse(user) : {permission: {}};
        var bid2 = user.permission['bid:add'];
        if(!bid2){
            $('#addBid').hide();
            $('#bidSetting').hide();
        }
    }
}
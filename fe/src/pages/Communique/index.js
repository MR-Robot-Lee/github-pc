var initCommuniqueFunc = require('./initCommuniqueFunc');

module.exports = {
    ready: function (type) {
        initCommuniqueFunc.getCommuniqueCompetence();
        if (type === 'communique-add') {
            initCommuniqueFunc.initCommuniqueType();
        } else if (type === 'communique-setting') {
            initCommuniqueFunc.communiqueType();
        } else if (type === 'communique-all') {
            var typeId = $('#allKnowledgeList').data('id');
            initCommuniqueFunc.initAllCommunique({typeId: typeId});
            initCommuniqueFunc.getCommuniqueTypeFunc(typeId);
        } else if (type === 'communique-detail') {
            var communiqueDetail = $('#communiqueDetail');
            var id = communiqueDetail.data('id');
            var $type = communiqueDetail.data('type');
            initCommuniqueFunc.getCommuniqueByIdFunc(id);
            initCommuniqueFunc.initCommentList(id);
            initCommuniqueFunc.getCommuniqueTypeFunc($type, 'jump');
        }
    }
};
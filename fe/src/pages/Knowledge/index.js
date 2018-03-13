var initKnowledgeFunc = require('./initKnowledgeFunc');

module.exports = {
  ready: function (type) {
    initKnowledgeFunc.renderCompetence();
    if (type === 'knowledge-add') {
      initKnowledgeFunc.initAddKnowledge();
    } else if (type === 'knowledge-type') {
      initKnowledgeFunc.initKnowledgeType();
    } else if (type === 'knowledge-all') {
      var typeId = $('#allKnowledgeList').data('id');
      initKnowledgeFunc.initAllKnowledgeFunc({ typeId: typeId });
      initKnowledgeFunc.initAllKnowledgeClickAndNav(typeId);
    } else if (type === 'knowledge-detail') {
      var knowledgeDetail = $('#knowledgeDetail');
      var id = knowledgeDetail.data('id');
      var $type = knowledgeDetail.data('type');
      initKnowledgeFunc.initAllKnowledgeClickAndNav($type, 'jump');
      initKnowledgeFunc.initAllKnowledgeFunc({ typeId: $type });
      initKnowledgeFunc.getFindCompanyNoAndIdByKnowledgeFunc({ id: id });
    }
  }
};
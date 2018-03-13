var initDocumentFunc = require('./initDocumentFunc');
module.exports = {
  ready: function (type) {
    initDocumentFunc.renderCompetence();
    if (type === 'document-company') {
      initDocumentFunc.initFileCabinet();
      initDocumentFunc.initAddFileCabinet();
    } else if (type === 'admin-company' || type === 'admin-me' || type === 'admin-manager') {
      var typeNo = $('.document-menus').data('type-no');
      if (type === 'admin-me') {
        typeNo = 2;
      }
      initDocumentFunc.initFileCabinetDetail(typeNo);
      initDocumentFunc.initChildFile();
      initDocumentFunc.initAddFileCabinet();
    } else if (type === 'document-me') {
      initDocumentFunc.initMyFileCabinet();
      initDocumentFunc.initAddFileCabinet();
    } else if (type === 'document-manager') {
      initDocumentFunc.initFileCabinetManager();
      initDocumentFunc.initAddFileCabinet();
    } else if (type === 'document-admin-company' || type === 'document-admin-me' || type === 'document-admin-manager') {
      initDocumentFunc.initGetCallBackList();
      initDocumentFunc.initChildFile();
      initDocumentFunc.initAddFileCabinet();
    }
  }
};
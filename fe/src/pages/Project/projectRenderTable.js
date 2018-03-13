/**
 * 绘制项目table
 */
exports.renderProjectTable = function renderProjectTable (list, parents, type) {
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = '';
    if (type === 'index') {
      dom = renderTrDom(item);
    } else {
      dom = renderOtherTrDom(item);
    }
    dom.appendTo(parents);
  }
};
function renderOtherTrDom (item) {
  return $('<tr>\
             <td>' + item.projShortTitle + '</td>\
             <td>' + item.contractPrice + '</td>\
             <td>' + item.chargeUserName + '</td>\
             <td>\
              <div style="width: 100px">\
              <div class="Progress-Bar-fixed">\
              <div class="bar-item">\
              <div class="span-default progress-bc-5cc796" style="width: ' + item.completePer + '%"></div>\
              <div class="progress-desc" style="left: ' + item.completePer + '%">' + item.completePer + '%</div>\
              </div>\
              </div>\
              </div>\
            </td>\
            <td style="text-align: center">\
             <div class="icon-piece"></div>\
           </td>\
          <td>' + parseProjestStatus(item.projState) + '</td>\
          <td>\
           <a href="/project/detail/' + item.id + '" target="_blank">进入项目</a>\
         </td>\
        </tr>')
}
function renderTrDom (item) {
  return $('<tr>\
             <td>' + item.projShortTitle + '</td>\
             <td>' + item.contractPrice + '</td>\
             <td>' + item.chargeUserName + '</td>\
             <td>\
              <div style="width: 100px">\
              <div class="Progress-Bar-fixed">\
              <div class="bar-item">\
              <div class="span-default progress-bc-5cc796" style="width: ' + item.completePer + '%"></div>\
              <div class="progress-desc" style="left: ' + item.completePer + '%">' + item.completePer + '%</div>\
              </div>\
              </div>\
              </div>\
            </td>\
            <td style="text-align: center">\
             <div class="icon-piece"></div>\
           </td>\
          <td>' + parseProjestStatus(item.projState) + '</td>\
        </tr>')
}
function parseProjestStatus (status) {
  status = parseInt(status);
  switch (status) {
    case 1:
      return '未开工';
    case 2:
      return '在建';
    case 3:
      return '停工';
    case 4:
      return '竣工';
    case 5:
      return '质保';
    default:
      return '';
  }
}
/**
 * 还原table 列表
 * @param list
 * @param parents
 */
exports.renderReductionTable = function renderReductionTable (list, parents) {
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = renderReductionTrDom(item);
    dom.appendTo(parents);
  }
};

function renderReductionTrDom () {
  return $('<tr>\
             <td>装修工程</td>\
             <td>西安地铁三号线项目部</td>\
             <td>未执行</td>\
             <td>\
              <a>还原</a>\
             </td>\
            </tr>');
}

exports.renderProjectType = function renderProjectType (parents, list) {
  $('<option value="a">工程类型</option>').appendTo(parents);
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = $('<option></option>');
    dom.val(item.id);
    dom.text(item.projTypeName);
    dom.appendTo(parents);
  }
};
$('body').click(function(){
  $()
})
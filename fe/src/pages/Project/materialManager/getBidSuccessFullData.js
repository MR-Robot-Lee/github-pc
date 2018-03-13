exports.getBidSuccessFullData = function (parents) {
  var trs = parents.find('tbody tr');
  var list = [];
  for (var i = 0; i < trs.length; i++) {
    var item = $(trs[i]).data('item');
    if (!item) {
      return new Error('dom data not exist');
    }
    list.push(item);
  }
  return list;
};
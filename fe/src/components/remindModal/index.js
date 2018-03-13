var Modal = require('../Model');
var remindModal = require('./remindModal.ejs');

function RemindModal (title, body) {
  this.$modal = Modal(title, remindModal());
  this.$body = this.$modal.$body.find('.enterprise-remind').html('');
  this.$modal.showClose();
  $(body).appendTo(this.$body);
  return this.$modal
}
module.exports = RemindModal;

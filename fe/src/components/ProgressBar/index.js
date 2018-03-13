var Temp = require('./ProgressBar.ejs');

function ProgressBar (container, width) {
  this.$container = $(container);
  this.$ProgressBar = $(Temp());
  this.$ProgressBar.appendTo(this.$container);
  this.$scale = this.$ProgressBar.find('.scale');
  this.$number = this.$ProgressBar.find('.Bar-number');
  width = width || 0;
  if (width === 0) {
    this.$scale.css("width", width);
    this.$number.text(this.width + "%");
  } else if (width <= 30 && width > 0) {
    this.$scale.css("width", width);
    this.$number.text(this.width + "%");
  } else if (width <= 50 && width > 30) {
    this.$scale.css("width", width);
    this.$scale.addClass("zhong");
    this.$number.text(this.width + "%");
  } else if (width <= 100 && width > 50) {
    this.$scale.css("width", width);
    this.$scale.addClass("you");
    this.$number.text(this.width + "%");
  }
}
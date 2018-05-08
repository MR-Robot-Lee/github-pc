/**
 * 自定义下拉选择框
 */
function cusSelect() {
    var select = $('.cus-select');
    select.click(function (e) {
        stopPropagation(e);
        select.removeClass("active");
        $(this).addClass("active");
        $('.cus-select').find('ul').hide();
        $(this).find('ul').show();
    });
    select.find('li').click(function () {
        $('.cus-select').find('li').removeClass('active');
        $(this).addClass("active");

    });
}

/**
 * 禁止冒泡
 * @param e
 */
function stopPropagation(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.returnValue = false;
    }
}

/**
 * 点击body关闭显示的select
 */
function clickBody() {
    $("body").click(function (e) {
        stopPropagation(e);
        var select = $('.cus-select');
        if (select.hasClass('active')) {
            select.removeClass("active");
            select.find('ul').hide();
        }
    });
}

/**
 * 获取焦点改变颜色
 */
function inputFocus() {
    $(".cus-input").find("input").focus(function () {
        $(".cus-input").css('border-color', "#009441");
    }).blur(function () {
        $(".cus-input").css('border-color', "#bebebe");
    });
}

module.exports = {
    clickBody: clickBody,
    cusSelect: cusSelect,
    stopPropagation: stopPropagation,
    inputFocus: inputFocus
};
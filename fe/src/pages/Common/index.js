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
/**
 * 
 * @param table 要导出的表格的jQuery选择器
 * LEE: 增加导出表格功能
 */
function initExportList(table) {
    $('#exportTable').css({
        position: 'relative'
    })
    var list = $('<ul>'
        + '<li>导出为PNG</li>' 
        + '<li>导出为DOC</li>' 
        + '<li>导出为XLS</li>' 
        + '</ul>');
    list.css({
        display: 'none',
        position: 'absolute',
        top: '29px',
        left: '50%',
        marginLeft: '-55px',
        backgroundColor: '#fff',
        border: '1px solid #bebebe',
        width: '100px',
        textAlign: 'center',
    });
    list.children('li').css({
        color: '#5b5b5b'
    }).mouseover(function () {
        $(this).css({
            color: "#009411"
        }).siblings().css({
            color: "#5b5b5b"
        })
    })
    list.appendTo($('#exportTable'));
    $('#exportTable').hover(function () {
        list.show();
    }, function () {
        list.hide();
    })
    list.children('li').click(function (e) {
        stopPropagation(e);
        var index = $(this).index();
        if(index === 0) {
            $(table).tableExport({
                type: 'png'
            })
        }
        if(index === 1) {
            $(table).tableExport({
                type: 'doc'
            })
        }
        if (index === 2) {
            $(table).tableExport({
                type: 'xls'
            })
        }
    })
}

module.exports = {
    clickBody: clickBody,
    cusSelect: cusSelect,
    stopPropagation: stopPropagation,
    inputFocus: inputFocus,
    initExportList: initExportList
};
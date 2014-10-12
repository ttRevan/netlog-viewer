(function() {
    $(document).ready(function () {
        var canvas = $("#chart");
        var resizer = function () {
            canvas.height($(document).height() - $("#nav-toolbar").height());
        };
        canvas.resize(resizer);
        resizer();
        $.ajax({
            url : 'Net_1.log',
            dataType : 'text',
            success : function (data) {
                draw(data);
            }
        });
    })
})();

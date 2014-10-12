var minX = Number.POSITIVE_INFINITY;
var maxX = Number.NEGATIVE_INFINITY;
var minY = Number.POSITIVE_INFINITY;
var maxY = Number.NEGATIVE_INFINITY;
var netStates = [];
var lerpStates = [];
var width, height, xRange, yRange;

function drawDot(dot, context, extent) {
    extent = extent || 1;
    var xPos = (dot.x - minX) / xRange * width;
    var yPos = (dot.y - minY) / yRange * height;
    context.fillRect(xPos - extent, yPos - extent, extent * 2, extent * 2);
    return { x: xPos, y: yPos };
}

function draw(data) {
    var emptyTitle = { text: '' };
    var options = {
        chart : {
            zoomType : 'x',
            backgroundColor : '#202020'
        },
        title: emptyTitle,
        yAxis: {
            gridLineColor: 'rgba(70, 70, 70, 0.3)',
            title: emptyTitle
        },
        xAxis: {
            plotLines : []
        },
        series: [
            {
                name: 'sync state',
                data: [],
                lineWidth: 1,
                animation: false,
                type: 'line',
                dashStyle : 'Solid'
            },
            {
                name : 'lerp state',
                color : 'rgba(0, 0, 0, 0)',
                data : [],
                lineWidth : 1,
                animation : false,
                type: 'line',
                dashStyle : 'Dot'
            }
        ]
    };
    var lines = data.split('\n');
    netStates = [];
    lerpStates = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.trim().length == 0) {
            continue;
        }
        var parts = line.split('@');
        var type = parts[0];
        var time = parts[1];
        var vecs = parts[2].split('#');
        var pos = vecs[0].split(':')[1].split(',');
        minX = Math.min(minX, time);
        maxX = Math.max(maxX, time);
        minY = Math.min(minY, pos[0]);
        maxY = Math.max(maxY, pos[0]);
        if (type == "net") {
            options.series[0].data.push({
                x: parseFloat(time), y: parseFloat(pos[0]),
                marker: { symbol: 'square', radius : 2, enabled : true }
            });
            options.xAxis.plotLines.push({
                value : parseFloat(time),
                color : 'rgba(100, 200, 100, 0.3)',
                width : 1
            });
        } else if (type == "lerp") {
            options.series[1].data.push({
                x: parseFloat(time), y: parseFloat(pos[0]),
                marker: { symbol: 'square', radius : 2, enabled : true, fillColor : '#AA2020' }
            });
        }
    }
    var canvas = $("#chart");
    console.log(options.series[0].data.length);
    canvas.highcharts(options);
}
function handleFile(files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        draw(reader.result);
//        var context = canvas.getContext("2d");
//        var canvasWidth = canvas.clientWidth;
//        var canvasHeight = canvas.clientHeight;
//        width = canvas.width = canvasWidth;
//        height = canvas.height = canvasHeight;
//        context.fillStyle = 'rgb(70, 70, 70)';
//        context.fillRect(0, 0, width, height);
//        xRange = (maxX - minX);
//        yRange = (maxY - minY);
//        context.fillStyle = 'rgba(255, 100, 100, 0.5)';
//        context.strokeStyle = 'rgb(100, 100, 255)';
//        context.lineWidth = 2;
//        context.beginPath();
//        for (var j = 0; j < netStates.length; j++) {
//            var netDot = netStates[j];
//            var cPos = drawDot(netDot, context, 2);
//            if (j == 0) {
//                context.moveTo(cPos.x, cPos.y);
//            } else {
//                context.lineTo(cPos.x, cPos.y);
//            }
//            context.save();
//            context.fillStyle = 'rgba(150, 150, 150, 0.3)';
//            context.fillRect(cPos.x, 0, 1, height);
//            context.restore();
//        }
//        context.stroke();
//
//        context.fillStyle = 'black';
//        for (var k = 0; k < lerpStates.length; k++) {
//            var lerpDot = lerpStates[k];
//            drawDot(lerpDot, context, 2);
//        }
    };
    reader.readAsText(file);
}


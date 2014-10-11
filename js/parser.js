
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

function handleFile(files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var lines = reader.result.split('\n');
        netStates = [];
        lerpStates = [];
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.trim().length == 0) { continue; }
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
                netStates.push({ x: time, y: pos[0]});
            } else if (type == "lerp") {
                lerpStates.push({ x: time, y: pos[0]});
            }
        }
        var canvas = $("#plot")[0];
        var context = canvas.getContext("2d");
        var canvasWidth = canvas.clientWidth;
        var canvasHeight = canvas.clientHeight;
        width = canvas.width = canvasWidth;
        height = canvas.height = canvasHeight;
        xRange = maxX - minX;
        yRange = maxY - minY;
        context.fillStyle = 'rgba(255, 0, 0, 0.5)';
        context.strokeStyle = 'rgb(0, 255, 0)';
        context.beginPath();
        for (var j = 0; j < netStates.length; j++) {
            var netDot = netStates[j];
            var cPos = drawDot(netDot, context, 2);
            if (j == 0) {
                context.moveTo(cPos.x, cPos.y);
            } else {
                context.lineTo(cPos.x, cPos.y);
            }
        }
        context.stroke();

        context.fillStyle = 'black';
        for (var k = 0; k < lerpStates.length; k++) {
            var lerpDot = lerpStates[k];
            drawDot(lerpDot, context, 2);
        }
    };
    reader.readAsText(file);
}


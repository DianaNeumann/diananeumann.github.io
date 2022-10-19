var x, y, step = 14,
    flag = 0;

var message = "примите лабы плз ";

message = message.split("");

var xpos = new Array();
for (var i = 0; i <= message.length - 1; i++) {
    xpos[i] = -50;
}

var ypos = new Array();
for (i = 0; i <= message.length - 1; i++) {
    ypos[i] = -50;
}

function handlerMM(e) {
    e = e || window.event;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else if (e.clientX || e.clientY) {
        x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
        y = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
    }
    flag = 1;
}

function makesnake() {
    if (flag == 1) {
        for (i = message.length - 1; i >= 1; i--) {
            xpos[i] = xpos[i - 1] + step;
            ypos[i] = ypos[i - 1];
        }
        xpos[0] = x + step;
        ypos[0] = y;

        for (i = 0; i < message.length - 1; i++) {
            var elem = document.getElementById('span' + i);
            elem.style.left = xpos[i] + 'px';
            elem.style.top = ypos[i] + 'px';
        }

    }
    var timer = setTimeout(function() {
        makesnake()
    }, 90);
}

for (i = 0; i <= message.length - 1; i++) {
    document.body.innerHTML += "<span id='span" + i + "' class='spanstyle'>" + message[i] + "</span>";
}

makesnake();
document.body.onmousemove = function(e) {
    handlerMM(e)
};